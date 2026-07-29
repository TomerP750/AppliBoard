# AppliBoard

A full-stack job application tracker that helps candidates organize applications, monitor progress, and understand their job-search activity from one dashboard.

AppliBoard was built as a portfolio project to demonstrate feature-based frontend architecture, REST API design, relational and document data storage, secure token-based authentication, and responsive UI development.

## Features

### Application management

- Create, edit, and delete job applications.
- Record the company, city, position type, status, application date, and personal notes.
- Mark important applications as favorites.
- View notes and stale-application indicators directly from application cards.

### Search and organization

- Search applications by company name.
- Filter by status, position type, and favorite state.
- Sort by newest or oldest application date.
- Navigate paginated results and choose the page size.

### Dashboard and analytics

- View a personalized dashboard with quick links to the main areas of the app.
- Review recent activity generated when applications are created, updated, or deleted.
- Track total applications, applications sent this week, status distribution, and weekly activity.
- Visualize application data with responsive charts.

### Authentication and account management

- Create an account, sign in, and sign out.
- Protect dashboard routes from unauthenticated access.
- Restore authenticated sessions after a page refresh.
- Update personal details, change the account password, or delete the account.
- Switch between light and dark themes.

### Notifications

The notification foundation currently includes backend endpoints for paginated notifications, unread counts, and read-state updates, together with a dashboard notification menu. Automated stale-application reminder generation and live frontend API integration are still in progress.

## Architecture

The repository contains two applications:

- `frontend` — a React single-page application organized by feature.
- `appliboard` — a Spring Boot REST API organized into controller, service, repository, DTO, and domain layers.

Application and user data are stored in MySQL. Refresh-token sessions are stored as hashed values in MongoDB. The frontend communicates with the API through Axios and uses TanStack Query to manage server state.

## Authentication Flow

1. The user signs up or logs in.
2. The API returns a short-lived JWT access token and sets a refresh token in an HTTP-only, SameSite cookie.
3. The frontend keeps the access token in memory and attaches it to protected requests.
4. When an access token expires, the frontend requests a rotated token and retries the failed request once.
5. Logging out revokes the refresh token, clears its cookie, and removes the local session state.

Passwords are hashed with BCrypt, protected endpoints use stateless Spring Security, and users can access only their own application data.

## Tech Stack

### Frontend

- React 19 and TypeScript
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

### Data and testing

- MySQL
- MongoDB
- JUnit 5
- Mockito

## Project Structure

```text
AppliBoard/
├── appliboard/
│   ├── src/main/java/com/backend/appliboard/
│   │   ├── features/            # Domain features and REST endpoints
│   │   ├── infrastructures/     # Security and JWT infrastructure
│   │   └── shared/              # Shared exceptions and error handling
│   ├── src/main/resources/      # Spring configuration
│   └── src/test/java/           # Backend tests
├── frontend/
│   └── src/
│       ├── features/            # Feature-specific pages, components, and APIs
│       ├── layout/              # Application routing
│       └── shared/              # Shared UI, models, hooks, contexts, and utilities
└── README.md
```


## Current Status

Core application tracking, authentication, analytics, activity history, account settings, responsive navigation, and theme switching are implemented. The notification workflow remains under active development.
