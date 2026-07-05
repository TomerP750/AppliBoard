# 📋 AppliBoard

## 🔎 Overview

AppliBoard is a full-stack job application tracking project built to help candidates organize their search with clarity and control. It brings applications, statuses, favorites, search, filtering, analytics, and account management into one focused workspace.

The project is designed around a clean dashboard experience for tracking job applications in one place.

## ✨ Features

- Track job applications with company name, city, role type, status, favorite state, and application date.
- Manage applications through create, edit, delete, and favorite actions from a card-based dashboard.
- Search and filter applications by company name, role, status, favorites, and newest or oldest application date.
- Browse applications with paginated results and adjustable page sizes for larger job searches.
- View analytics for total applications, weekly applications sent, status breakdowns, and daily weekly activity.
- Use a personalized dashboard with quick access to applications, analytics, and settings.
- Sign up and log in with JWT-based authentication and user-specific application data.
- Update personal details, change password, and delete an account from the settings area.
- Work in a responsive interface with dark-mode styling and reusable UI components.

## 📁 Folder Structure

```text
AppliBoard/
├── appliboard/                  # Spring Boot backend
│   ├── src/main/java/com/backend/appliboard/
│   │   ├── features/            # Authentication, users, applications, analytics
│   │   ├── infrastructures/     # Security and JWT infrastructure
│   │   └── shared/              # Shared exceptions and global handling
│   ├── src/main/resources/      # Backend configuration
│   └── src/test/java/           # Backend tests
├── frontend/                    # React frontend
│   └── src/
│       ├── features/            # Home, auth, dashboard, applications, analytics, settings
│       ├── layout/              # App layout and routing
│       └── shared/              # Reusable UI, hooks, models, utilities, context
└── README.md
```

## 🛠️ Tech Stack

**Frontend**

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

**Backend**

- Java 17
- Spring Boot
- Spring MVC
- Spring Security
- Spring Data JPA
- Spring Validation
- JWT authentication
- Lombok

**Data & Infrastructure**

- MySQL
- Redis
- Maven

**Testing**

- JUnit 5
- Mockito
