---
name: new-feature
description: Create a new AppliBoard feature (backend, frontend or both) by copying the folder structure and conventions of an existing feature. Use when the user asks to add a new feature, module, entity, page or section, e.g. "add interviews", "create a contacts feature", "new dashboard page".
---

# New feature

Build the feature the way existing features are built. Before writing anything, **look up the closest existing feature folder and use it as the template**. Copy its structure, naming and layering, not its business logic.

Only read and edit code. Don't run builds, tests, servers, migrations or git unless the user asks. Also follow `.claude/rules/clean-code.md`, `backend.md`, `frontend.md` and `react.md`.

## 0. Plan before writing

1. Confirm the scope: backend, frontend or both? Which operations (list, get one, create, update, delete, custom actions)? Paginated? Owned by the user?
2. Choose the **reference feature** and read every file in it:

   | New feature looks like… | Backend reference | Frontend reference |
   | --- | --- | --- |
   | User-owned records with CRUD, filters, paging | `features/job_application/` | `features/dashboard/applications/` |
   | Read-only stats or aggregates | `features/analytics/` | `features/dashboard/analytics/` |
   | Feed or list of events | `features/activity/` | `features/dashboard/index/` |
   | Async or event-driven (Kafka) | `features/notification/` | `features/dashboard/layout/dashboard_header/notifications/` |
   | AI / file upload | `features/cv_helper/` | `features/cv_helper/` |

3. If anything is unclear (the domain fields, relations, whether it needs a dashboard page or a sidebar entry), ask before creating files.
4. Show the user the list of files you plan to create, then write them.

## 1. Backend: `appliboard/src/main/java/com/backend/appliboard/features/<feature_name>/`

Package names use `snake_case` (`job_application`); classes use `PascalCase`.

```text
features/<feature_name>/
├── <Entity>.java                 # JPA entity
├── <Entity>Repository.java       # Spring Data repository
├── I<Entity>Service.java         # service interface, with Javadoc
├── <Entity>Service.java          # implementation
├── <Entity>Controller.java       # REST controller
├── <Entity>Mapper.java           # entity → DTO
├── <Entity>Specifications.java   # only if it has dynamic filters
├── <Enum>.java                   # domain enums (e.g. Status), next to the entity
└── dto/
    ├── <Entity>Dto.java          # response
    ├── Create<Entity>Dto.java    # request, with validation
    ├── Update<Entity>Dto.java
    └── <Entity>FilterDto.java    # only if it has filters
```

Conventions (from `job_application`):

- **Entity:** `@Entity`, `@Table(name = "<plural_snake>")`, Lombok `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder`, `UUID` id with `@GeneratedValue(strategy = GenerationType.UUID)` and `@Setter(AccessLevel.NONE)`, `@Enumerated(EnumType.STRING)` for enums, `@ManyToOne User user` for user-owned data, `@EntityListeners(AuditingEntityListener.class)` with `@CreatedDate`/`@LastModifiedDate` `Instant` fields. Add `@Index`es for the columns you filter or sort on.
- **Repository:** `extends JpaRepository<Entity, UUID>` (+ `JpaSpecificationExecutor<Entity>` if filtered). Derived queries scoped by `userId`; JPQL `@Query` with text blocks and `@Param` for anything bigger.
- **DTOs:** Java `record`s in `dto/`. Requests get Jakarta validation (`@NotBlank`, `@NotNull`, `@Size`) with readable messages.
- **Mapper:** `@Component` class with `public static <Entity>Dto toDto(<Entity> entity)`. Computed fields are private static helpers.
- **Service interface:** `I<Entity>Service` with Javadoc on each method (params, return, `@throws`).
- **Service:** `@Service @Slf4j @RequiredArgsConstructor`, `implements I<Entity>Service`, `private final` dependencies.
  - Every method takes `UUID userId` and checks ownership, throwing `UnauthorizedException` (as in `oneJobApplication`).
  - A `fetch<Entity>Entity(id)` helper throws `NotFoundException`. To get the user, call `userService.fetchUserEntity(userId)`.
  - `@Transactional` on writes, `log.info` on important actions, and `activityService.createActivity(...)` when the action should appear in the activity feed.
  - Build entities with `.builder()`.
- **Controller:** `@RestController`, `@RequestMapping("/api/<short-feature-path>")`, `@RequiredArgsConstructor`.
  - Endpoints follow the existing verbs: `GET /all` (paged: `page`, `size`, `sort` params → `Pageable`), `GET /{id}`, `POST /create`, `PUT /update/{id}`, `DELETE /delete/{id}`, `PATCH /<action>/{id}`.
  - Get the user with `@AuthenticationPrincipal PrincipalUser user` → `user.getUserId()`. Request bodies use `@Valid @RequestBody`. Return DTOs or `Page<Dto>`, never entities.
  - No business logic in the controller.
  - Inject the service by its **interface** (`I<Entity>Service`), per `clean-code.md`. Some existing controllers inject the concrete class. Don't change those unless asked.
- **Exceptions:** use `shared/exceptions/` (`NotFoundException`, `UnauthorizedException`, `InvalidInputException`, `FoundException`). Add a new one only if none fits, and register it in `GlobalExceptionHandler`.
- **Security:** if the new path must be public, it needs a change in `SecurityConfig`. Ask first.
- **Tests (only if asked):** `src/test/java/com/backend/appliboard/<Entity>ServiceTest.java`, JUnit 5 + Mockito, in the style of `JobApplicationServiceTest`.

## 2. Frontend: `frontend/src/features/...`

Dashboard sections go in `features/dashboard/<feature_name>/`. Standalone areas (own layout or route outside the dashboard) go in `features/<feature_name>/`. Folder names use `snake_case`, like the existing ones.

```text
features/dashboard/<feature_name>/
├── api/<feature>Service.ts       # class service (see the api-integration skill)
├── models/                       # <Entity>Dto.ts, Create<Entity>Dto.ts, <Enum>.ts, one per Java DTO/enum
├── hooks/                        # use<Something>.ts, only when logic is reused or heavy
├── components/                   # feature components, PascalCase.tsx
├── pages/<Feature>Page.tsx       # default export (lazy-loaded)
└── utils/                        # pure helpers, only if needed
```

Create only the folders the feature needs. Don't add empty `hooks/` or `utils/`.

Conventions:

- **API, models, queries, UI states:** follow the **`api-integration`** skill (class service, `return (await axios.x(...)).data`, `const xService = new XService(); export default xService;`).
- **Page:** `export default function <Feature>Page()`. It composes components and owns page state. One `h1`.
- **Components:** named exports (`export function ApplicationCard`), explicit props interface. Reuse `shared/ui/` (`Button`, `Input`, `Modal`, `Badge`, `Pagination`, `SearchInput`, ...) before writing new primitives. CRUD dialogs go in `components/crud_modals/` (`CreateModal`, `UpdateModal`, `DeleteModal`), like `applications`.
- **Routing:** add a `lazy(() => import(...))` import and a `<Route>` wrapped in `<SuspenseWrapper>` in `src/layout/Routing.tsx`, inside the protected `/dashboard` route for dashboard features.
- **Navigation:** if it needs a sidebar entry, add it to `features/dashboard/layout/sidebar/navItems.ts`.
- **Styling:** theme tokens from `src/index.css`, light and dark mode, following `frontend/AGENTS.md`.

## 3. Wire the two sides together

- TypeScript models match the Java DTOs and enums exactly (field names, enum values, `UUID` → `string`, `Instant` → `string`).
- Service URLs match the controller paths.
- Query invalidation covers other features the action affects (activity feed, analytics).

## 4. Finish

1. If the feature has UI, run the `ui-validator` skill on the new components.
2. Check your code against `clean-code.md`: single responsibility, no copied logic, descriptive names, small functions.
3. Report:
   - the reference feature you followed,
   - a tree of the files created and the existing files changed (`Routing.tsx`, `navItems.ts`, `SecurityConfig`, ...),
   - the endpoints added,
   - anything left out or unclear,
   - which checks could be run (`./mvnw test`, `npm run lint`, `npm run build`, trying it in the app). Run none of them without the user's approval.
