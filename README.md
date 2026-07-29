# AppliBoard

> A full-stack job application tracker for organizing opportunities, monitoring progress, and understanding job-search activity.

## Overview

AppliBoard brings application tracking, search, analytics, activity history, and account management into a single responsive dashboard. The project demonstrates feature-based frontend organization, layered REST API design, secure token-based authentication, and persistence across relational and document databases.

## Key Features

- **Application management** — Create, edit, delete, and favorite job applications while recording company, location, position, status, date, and notes.
- **Search and filtering** — Search by company, filter by status, position, or favorites, and sort by application date.
- **Pagination** — Browse large application collections with configurable page sizes.
- **Dashboard** — Access key areas quickly and review recent create, update, and delete activity.
- **Analytics** — Monitor totals, weekly submissions, status distribution, and daily activity through responsive charts.
- **Stale tracking** — Identify applications that have not been updated recently.
- **Authentication** — Sign up, sign in, restore sessions, and access protected dashboard routes.
- **Account settings** — Update personal details, change passwords, delete accounts, and select a light or dark theme.
- **Responsive interface** — Use desktop sidebar navigation or a mobile-friendly bottom menu.

## Notification Status

Notification infrastructure is under development. The backend supports paginated results, unread counts, and read-state updates, while the dashboard includes the initial notification menu. Automated stale-application reminders and live frontend integration are planned next.

## Architecture

The React client communicates with a layered Spring Boot REST API through Axios, with TanStack Query managing server state. MySQL stores application data, while MongoDB stores hashed refresh-token sessions.

## Security and Session Management

- Short-lived JWT access tokens are stored in memory.
- Refresh tokens are hashed in MongoDB and delivered through HTTP-only, SameSite cookies.
- Expired sessions are refreshed automatically, with failed requests retried once.
- Refresh tokens rotate during session restoration and token renewal.
- BCrypt secures passwords, and Spring Security protects user-specific resources.
- Logout revokes the active refresh token and clears both cookie and client session state.

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Axios
- Tailwind CSS
- Recharts
- Lucide React

### Backend

- Java 17
- Spring Boot
- Spring MVC
- Spring Security
- Spring Data JPA
- Spring Validation
- JWT
- Lombok
- Maven

### Data

- MySQL
- MongoDB

### Testing

- JUnit 5
- Mockito

## Project Structure

```text
AppliBoard/
├── appliboard/                         # Spring Boot REST API
│   ├── src/main/java/com/backend/appliboard/
│   │   ├── features/                  # Auth, users, applications, analytics, activity, notifications
│   │   ├── infrastructures/           # JWT and Spring Security
│   │   └── shared/                    # Exceptions and global error handling
│   ├── src/main/resources/            # Backend configuration
│   └── src/test/java/                 # Backend tests
├── frontend/                          # React single-page application
│   └── src/
│       ├── features/                  # Home, authentication, dashboard, applications, analytics, settings
│       ├── layout/                    # Application routing
│       └── shared/                    # Reusable UI, models, contexts, and utilities
└── README.md
```

## Project Status

Application tracking, authentication, analytics, activity history, account settings, responsive navigation, and theme support are implemented. The notification workflow remains in active development.
