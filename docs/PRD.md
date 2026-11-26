# AppliBoard — Product Requirements Document

## Overview

**AppliBoard** is a full-stack job application tracker. It helps job seekers organize applications, follow their progress, understand their search activity through analytics, get reminders about stale applications, and tailor their CV to job descriptions with AI.

## Problem

Job seekers apply to many positions across many sites and quickly lose track of where they applied, what stage each application is in, and which ones went silent. Spreadsheets are manual and give no insight or reminders.

## Target users

- Active job seekers (students, juniors, career changers, experienced developers) managing tens to hundreds of applications.
- Single-user accounts: each user sees only their own data.

## Goals

1. One place to record and manage every job application.
2. Fast search, filter, and sorting across large application lists.
3. Clear insight into activity and outcomes (analytics).
4. Proactive reminders so no application is forgotten (notifications).
5. AI help for adjusting and creating CVs for a specific job.
6. Secure, reliable authentication and session handling.

## Non-goals (for now)

- Multi-user teams, recruiters, or shared boards.
- Scraping or auto-applying to job sites.
- Native mobile apps (the web app is responsive instead).
- Payments or subscriptions.

## Features and requirements

| # | Feature | Status | Requirements |
| --- | --- | --- | --- |
| F1 | **Authentication** | Done | Sign up, log in, log out; BCrypt passwords. Short-lived JWT access token (15 min) kept in memory. Rotating refresh token (7-day session) in an `HttpOnly` cookie, stored hashed in Redis with reuse detection. The client refreshes once on `401` (one shared refresh across requests and tabs) and restores the session on reload. Logout, password change and account deletion revoke sessions. Remaining: tests for `AuthService` and `JwtFilter`. |
| F2 | **Application management** | Done | Create, edit, delete, favorite. Fields: company, location, position, status, date, notes. |
| F3 | **Search, filter, sort, paginate** | Done | Search by company; filter by status, position, favorites; sort by date; configurable page size. |
| F4 | **Dashboard & activity** | Done | Quick actions and recent create/update/delete activity feed. |
| F5 | **Analytics** | Done | Totals, weekly submissions, status distribution, daily/monthly activity charts. |
| F6 | **Account settings** | Done | Update profile, change password, delete account, light/dark theme. |
| F7 | **Notifications** | In progress | Paginated list, unread count, mark as read (done). A daily scheduled job finds stale applications and creates an in-app notification and an email reminder for each. Remaining: real email sender (currently `LoggingEmailSender`), live frontend integration. |
| F8 | **CV helper (AI)** | In progress | Upload CV (PDF, ≤5 MB), adjust it to a job description, create a new CV with a chosen layout, using Spring AI (OpenAI / Anthropic). Remaining: connect the adjust page to the existing `/api/cv-helper/adjust` endpoint; build the create-from-scratch endpoint and flow. |
| F9 | **AI weekly review** | Done | Weekly AI review of application consistency: stats computed in code, summary and notes written by the AI, validated output, one review per week, and a paginated history. Remaining: delete the unused sample data files in the frontend. |
| F10 | **Responsive UI** | Done | Desktop sidebar, mobile bottom menu, accessible light/dark themes. |

## Non-functional requirements

- **Security:** users may access only their own resources; no secrets in code or logs; validate all input on the server. Expired or missing logins return `401`; login errors don't reveal which emails are registered; session storage fails closed when Redis is down.
- **Reliability:** scheduled jobs must not send the same reminder twice, and one failing item must not stop the rest of the run.
- **Performance:** list endpoints are paginated; no unbounded queries.
- **Accessibility:** WCAG AA contrast, keyboard support, labeled controls (see `frontend/AGENTS.md`).
- **Maintainability:** feature-based modules, interface + implementation services, DTOs and mappers at the API boundary, global exception handling.

## Architecture

```text
React SPA (Vite, TS) ──Axios/TanStack Query──▶ Spring Boot REST API ──▶ MySQL   (app data, JPA)
                                                      ├── Redis (refresh-token sessions, analytics cache)
                                                      ├── @Scheduled job (stale applications → notification & email)
                                                      └── Spring AI (OpenAI / Anthropic) for CV features
```

## Roadmap

1. **Notifications:** connect the notification menu to the live API; add a real email sender.
2. **Tests and CI:** add tests for auth (`AuthService`, `JwtService`, `JwtFilter`), notifications, activity and controllers; run CI on push/PR with all backend tests plus frontend lint and build.
3. **CV helper:** complete the adjust and create flows end to end.
4. **Before going live:** read the allowed CORS origin from config instead of `localhost:5173`; set `AUTH_COOKIE_SECURE=true` behind HTTPS.
