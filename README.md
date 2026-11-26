# AppliBoard

> A full-stack job application tracker with AI-written weekly reviews, scheduled stale-application reminders, and analytics. It helps job seekers keep their search organized, consistent and moving forward.

**React 19 · TypeScript · Spring Boot 4 · Java 17 · Spring Security + JWT · Spring AI (Anthropic) · MySQL**

## Overview

Job seekers apply to many positions across many sites and quickly lose track of where they applied, what stage each application is in, and which ones went silent. AppliBoard brings application tracking, search, analytics, activity history, AI insights and account management into one responsive dashboard.

The project focuses on clean, production-style engineering:

- Feature-based modules on both the frontend and the backend.
- A layered REST API (controller → service interface → implementation → repository) with DTOs and mappers at the boundary.
- Secure token-based authentication: short-lived JWT access tokens plus rotating refresh tokens in Redis.
- Relational persistence with MySQL and Spring Data JPA.
- AI integration that is validated, fails safely, and never invents the numbers it reports.

## Key Features

### Job search tracking

- **Application management**: create, edit, delete and favorite job applications, recording company, location, position, status, date and notes.
- **Search, filter and sort**: search by company, filter by status, position or favorites, and sort by application date.
- **Pagination**: browse large application lists with configurable page sizes.
- **Dashboard and activity feed**: quick actions plus a history of recent create, update and delete activity.
- **Analytics**: totals, weekly submissions, status distribution, and daily and monthly activity in responsive Recharts charts.

### AI weekly review

A weekly AI review of the user's application consistency, built with **Spring AI** and **Anthropic**.

- **Numbers come from code, words come from the AI.** The backend computes the stats itself (applications per day, weekly total, the previous week's total, active days, longest streak and an up/down/neutral trend), and the model only writes the summary and notes around them.
- **Structured, validated output.** The AI response is mapped to a typed DTO and checked with Bean Validation: a non-blank summary with a length limit and 1–5 notes, each tagged `GOOD`, `NEUTRAL` or `IMPROVE`. Invalid notes are dropped, and an unusable answer is rejected.
- **One review per week.** A review window resets every Sunday at 08:00 and analyzes the full Sunday-to-Saturday week before it. A service-level check and a unique database index on (user, window) prevent duplicates, including concurrent requests.
- **No database connection held during the AI call.** Review generation deliberately runs outside a transaction, because the model call can take several seconds.
- **Safe failure.** If AI is not configured or the call fails, the API returns `503 Service Unavailable` with a friendly message instead of internal details.
- **Review history**: a paginated list of past weekly reviews.
- **Frontend**: a Weekly Review page and a History page built with TanStack Query, with loading, error and retry states.

### Stale-application reminders

- A **daily scheduled job** (`@Scheduled`, 09:00 server time) finds active applications (pending, in progress or interview scheduled) that haven't been updated for **14 days**.
- For each one it sends an email reminder and creates an in-app notification.
- **Idempotent by design**: the query skips any application that already has a notification since its last update, so a reminder is never sent twice. One failing item is logged and doesn't stop the rest of the run.
- Email delivery goes through an `EmailSender` interface. The current implementation (`LoggingEmailSender`) logs the email, so a real provider can be added without changing callers.
- The notification API supports paginated results, unread counts and marking notifications as read.

### Redis caching

A user's analytics are cached in **Redis** with cache-aside, written with `StringRedisTemplate`: on a hit the cached figures are returned, on a miss they are aggregated in MySQL and cached. The application list is not cached: it's an indexed per-user query, and the user who reads it is the one who changes it, so a cache would rarely be hit.

- **One key per user**: `appliboard::analytics::<userId>`, holding the analytics as JSON. The key is the user ID, so one user can never read another user's cached data.
- **Period-aware TTL**: an entry expires after 10 minutes or when the current week or month ends, whichever comes first, so weekly and monthly figures never carry over into the next period. `SET` with an expiry is a single command, so a key can never exist without a TTL.
- **Event-driven invalidation**: creating or deleting an application, or changing its status, publishes `JobApplicationsChangedEvent`. Deleting an account publishes `UserDeletedEvent`. `AnalyticsCache` listens with `@TransactionalEventListener(AFTER_COMMIT)` and deletes the user's key, so a rolled-back write leaves the cache as it was, and the job application feature doesn't depend on analytics.
- **Fails safe**: short Redis timeouts (1 s connect, 500 ms per command). If Redis is down or slow, reads fall back to MySQL and errors are only logged. A failed eviction is logged too, and the stale entry expires through the TTL.
- **Known limit**: a read that runs at the same moment as a write can store the old figures after the eviction (the usual cache-aside race). They are stale for at most the 10-minute TTL.

### Accounts and UI

- **Authentication**: sign up, sign in, restore sessions and protect dashboard routes.
- **Account settings**: update personal details, change password, delete the account, and choose a light or dark theme.
- **Responsive interface**: desktop sidebar navigation and a mobile bottom menu.
- **Route-level code splitting** with `React.lazy` and `Suspense`.

## Security and Session Management

### Tokens

| Token | Lifetime | Where it lives | Used for |
| --- | --- | --- | --- |
| **Access token** (JWT) | 15 minutes | In memory in the browser, never in storage | The `Authorization: Bearer` header on every API call |
| **Refresh token** (random, not a JWT) | 7 days per login | An `HttpOnly`, `SameSite=Strict` cookie, sent only to `/api/auth` | Getting a new access token |

- **Rotating refresh tokens in Redis.** A token is `<familyId>.<secret>`. Redis stores only a SHA-256 hash of the secret, so a Redis dump can't be replayed. Every refresh swaps the secret for a new one.
- **Reuse detection.** One login is one token "family". If an older secret of a family is used again, the token was copied, so the whole family is revoked.
- **Fixed session length.** Rotation keeps the original TTL, so a session ends at most 7 days after login, however often it's refreshed.
- **Access tokens are checked strictly.** Each one is verified once per request: signature, expiry, issuer and an `ACCESS` type claim. The signing key is built at startup, so a secret that is too short stops the app instead of failing every request.

### Session flow

- **Login and signup** return the access token in the body and set the refresh cookie.
- **`POST /api/auth/refresh`** rotates the cookie and returns a new access token.
- **Page reload:** the access token is in memory only, so the app restores the session by calling refresh once.
- **Expired access token:** the Axios interceptor catches the `401`, refreshes once, and retries the request. Requests that fail at the same time share **one** refresh, and a browser lock (`navigator.locks`) stops two tabs from refreshing at once. Without that, the backend would see the same token twice and end the session. If the refresh fails, the user is logged out.
- **Logout** revokes the session in Redis and clears the cookie.
- **Password change** ends every session of the user; the device that made the change gets a new one and stays signed in.
- **Account deletion** revokes all of the user's sessions once the deletion has committed.

### Other measures

- Passwords are hashed with BCrypt, and Spring Security scopes every resource to the authenticated user.
- An unknown email at login gets the same "Bad credentials" answer as a wrong password, so the login form doesn't reveal which emails are registered.
- Unauthenticated requests, expired tokens and tokens of deleted users all return `401`, so the client always knows when to refresh.
- Redis errors on sessions fail closed: unlike the analytics cache, there's no database to fall back to.
- A global exception handler maps domain exceptions to consistent HTTP responses (400, 401, 404, 409, 503).

## Architecture

```text
React SPA (Vite, TypeScript)
        │  Axios + TanStack Query
        ▼
Spring Boot REST API ──▶ MySQL    (applications, users, activity, notifications, weekly reviews)
        ├── Redis                 (refresh-token sessions, analytics cache)
        ├── @Scheduled job        (stale applications → notification + email reminder)
        └── Spring AI (Anthropic) (weekly review, CV adjustment)
```

## Technology Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Axios, Tailwind CSS, Recharts, Lucide React |
| **Backend** | Java 17, Spring Boot 4, Spring MVC, Spring Security, Spring Data JPA, Spring Validation, Spring AI, JWT, Lombok, Maven |
| **Data** | MySQL, Redis (refresh-token sessions and analytics cache) |
| **Testing** | JUnit 5, Mockito |
| **CI** | GitHub Actions (backend unit tests and build, triggered manually) |

## Testing

The backend has JUnit 5 and Mockito unit tests for the core services and the weekly review logic:

- `JobApplicationServiceTest` and `UserServiceTest`
- `AnalyticsServiceTest` and `AnalyticsCacheTest`: analytics figures, cache hits, misses, period-aware TTL, eviction, and falling back when Redis is down
- `RefreshTokenStoreTest`: refresh token creation, rotation, reuse detection and revocation
- `WeeklyReviewServiceTest`: generation, duplicate prevention and history
- `WeeklyReviewWindowTest`: window boundaries, tested with a fixed `Clock`
- `WeeklyConsistencyStatsTest`: totals, active days, streaks and trend
- `WeeklyReviewAiWriterTest`: AI output validation and failure handling

```bash
cd appliboard
./mvnw test
```

## Project Structure

```text
AppliBoard/
├── appliboard/                          # Spring Boot REST API
│   ├── src/main/java/com/backend/appliboard/
│   │   ├── features/                   # authentication, user, job_application, analytics,
│   │   │                               # activity, notification, weekly_review, cv_helper
│   │   ├── infrastructures/            # JWT, refresh tokens, Spring Security and AI configuration
│   │   └── shared/                     # exceptions and global error handling
│   ├── src/main/resources/             # configuration and AI prompt templates
│   └── src/test/java/                  # unit tests
├── frontend/                           # React single-page application
│   └── src/
│       ├── features/                   # home, authentication, dashboard (applications,
│       │                               # analytics, ai_summary, settings), cv_helper
│       ├── layout/                     # application routing
│       └── shared/                     # reusable UI, models, contexts and utilities
├── docs/PRD.md                         # product requirements and roadmap
└── README.md
```

## Project Status

| Area | Status |
| --- | --- |
| Authentication, application management, search and pagination | Done |
| Rotating refresh tokens, session restore and automatic refresh on `401` | Done: not yet tested end to end; `AuthService` and `JwtFilter` have no tests yet |
| Dashboard, activity feed and analytics | Done |
| Account settings, theming and responsive navigation | Done |
| AI weekly review and history | Done |
| Stale-application reminder job and notification API | Done |
| Notification menu connected to the live API | In progress |
| Redis caching for analytics | Done: unit tested; not yet tested against a running Redis |
| Real email provider (currently a logging sender) | Planned |
| CV helper: AI CV adjustment from an uploaded PDF and a job description | In progress: the backend endpoint is in place and the frontend UI is not connected yet |
| CV helper: create a new CV from scratch | Planned |

See [`docs/PRD.md`](docs/PRD.md) for the full requirements and roadmap.
