# AppliBoard

> A full-stack job application tracker with AI-written weekly reviews, scheduled stale-application reminders, and analytics. It helps job seekers keep their search organized, consistent and moving forward.

**React 19 · TypeScript · Spring Boot 4 · Java 17 · Spring Security + JWT · Spring AI (Anthropic) · MySQL**

## Overview

Job seekers apply to many positions across many sites and quickly lose track of where they applied, what stage each application is in, and which ones went silent. AppliBoard brings application tracking, search, analytics, activity history, AI insights and account management into one responsive dashboard.

The project focuses on clean, production-style engineering:

- Feature-based modules on both the frontend and the backend.
- A layered REST API (controller → service interface → implementation → repository) with DTOs and mappers at the boundary.
- Secure token-based authentication with short-lived JWT access tokens.
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

The application list is cached in **Redis** with cache-aside, written with `StringRedisTemplate`: on a hit the cached page is returned, on a miss MySQL filters, sorts and pages with JPA Specifications and the page is cached.

- **One Redis hash per user**: `appliboard::jobApplications::<userId>`, with one field per filters + page combination. The key is the user ID, so one user can never read another user's cached data.
- **O(1) invalidation**: create, update, delete and favorite remove the user's whole hash with a single `DEL`, after the DB transaction commits. No key scans or pattern deletes, other users keep their cached pages, and a failed write leaves the cache as it was.
- **Typed JSON**: pages are stored as JSON and read back with a typed `TypeReference`, so no class names are stored in Redis. Pages are cached as a `PageResponse` record because Spring's `Page` can't be read back from JSON. Its JSON shape matches the API's normal page format, so clients see no difference.
- **Atomic write + TTL**: a page is stored with a small Lua script that runs `HSET` and `EXPIRE ... NX` as one Redis command, so the user's hash can never exist without a TTL. It expires 5 minutes after its first page was cached, so cached data (including the time-based "stale" flag) is never older than that. `EXPIRE ... NX` needs Redis 7 or later.
- **Fails safe**: short Redis timeouts (1 s connect, 500 ms per command). If Redis is down or slow, reads fall back to MySQL and errors are only logged. A failed eviction is logged too, and the stale pages expire through the TTL.
- **Known limit**: a list read that runs at the same moment as a write can store the pre-write page after the eviction (the usual cache-aside race). That page is stale for at most the 5-minute TTL. A per-user version number in the key would close this gap if it ever mattered.

### Accounts and UI

- **Authentication**: sign up, sign in, restore sessions and protect dashboard routes.
- **Account settings**: update personal details, change password, delete the account, and choose a light or dark theme.
- **Responsive interface**: desktop sidebar navigation and a mobile bottom menu.
- **Route-level code splitting** with `React.lazy` and `Suspense`.

## Security and Session Management

- Short-lived JWT access tokens are kept in memory on the client.
- Refresh tokens and session restore are being moved to an external identity provider (e.g. AWS Cognito). Until then, a session ends when the access token expires or the page reloads.
- Logout clears the client session state.
- Passwords are hashed with BCrypt, and Spring Security scopes every resource to the authenticated user.
- A global exception handler maps domain exceptions to consistent HTTP responses (400, 401, 404, 409, 503).

## Architecture

```text
React SPA (Vite, TypeScript)
        │  Axios + TanStack Query
        ▼
Spring Boot REST API ──▶ MySQL    (applications, users, activity, notifications, weekly reviews)
        ├── @Scheduled job        (stale applications → notification + email reminder)
        └── Spring AI (Anthropic) (weekly review, CV adjustment)
```

## Technology Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Axios, Tailwind CSS, Recharts, Lucide React |
| **Backend** | Java 17, Spring Boot 4, Spring MVC, Spring Security, Spring Data JPA, Spring Validation, Spring AI, JWT, Lombok, Maven |
| **Data** | MySQL, Redis (cache) |
| **Testing** | JUnit 5, Mockito |
| **CI** | GitHub Actions (backend unit tests and build, triggered manually) |

## Testing

The backend has JUnit 5 and Mockito unit tests for the core services and the weekly review logic:

- `JobApplicationServiceTest` and `UserServiceTest`
- `JobApplicationPageCacheTest`: cache hits, misses, TTL, eviction after commit, and falling back when Redis is down
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
│   │   ├── infrastructures/            # JWT, Spring Security and AI configuration
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
| Dashboard, activity feed and analytics | Done |
| Account settings, theming and responsive navigation | Done |
| AI weekly review and history | Done |
| Stale-application reminder job and notification API | Done |
| Notification menu connected to the live API | In progress |
| Redis caching for the application list | Done: unit tested; not yet tested against a running Redis |
| Real email provider (currently a logging sender) | Planned |
| CV helper: AI CV adjustment from an uploaded PDF and a job description | In progress: the backend endpoint is in place and the frontend UI is not connected yet |
| CV helper: create a new CV from scratch | Planned |

See [`docs/PRD.md`](docs/PRD.md) for the full requirements and roadmap.
