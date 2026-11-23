---
name: backend-test
description: Write thorough, non-repetitive JUnit 5 + Mockito tests for the AppliBoard Spring Boot backend - services, scheduled jobs, mappers, DTO validation and controllers - following JobApplicationServiceTest. Use when asked to add, extend or improve backend tests, test a feature or class, or raise backend coverage.
---

# Backend tests

Write tests that cover every behavior of the code under test without repeating setup, data or assertions. The reference to copy is `appliboard/src/test/java/com/backend/appliboard/JobApplicationServiceTest.java`: fixed constants, `@BeforeEach` builders, parameterized ownership checks, `ArgumentCaptor`, assertion and DTO factory helpers.

Only write test code. **Don't run tests, builds or Maven** unless the user asks, and don't add dependencies to `pom.xml`. Don't change production code to make it testable without asking. If something can't be tested cleanly, say why and suggest the change.

## 0. Before writing

1. **Read the class under test** completely, plus the DTOs, entities, enums, mappers and exceptions it uses.
2. **Read the existing tests** (`src/test/java/...`). If the class already has a test file, **extend it** instead of creating a second one, and don't duplicate cases that already exist.
3. **Check for shared fixtures** in `src/test/java/com/backend/appliboard/support/` and reuse them (see §3).
4. **List the behaviors** before writing any code: every public method × every branch (see §2). Show the list to the user when it's long.

## 1. What kind of test, for what

The project has no in-memory database or Testcontainers, so stick to tests that run without infrastructure:

| Target | Test type | Setup |
| --- | --- | --- |
| Service (`*Service`) | Unit | `@ExtendWith(MockitoExtension.class)`, `@Mock` dependencies, `@InjectMocks` the real service |
| Mapper (`*Mapper.toDto`) | Pure unit | No mocks; build an entity, assert every DTO field and computed field (e.g. `isStale` on both sides of the 14-day boundary) |
| Request DTO validation | Pure unit | `Validation.buildDefaultValidatorFactory().getValidator()`; one valid case + one per constraint |
| Scheduled job (e.g. `StaleApplicationReminderService`) | Unit | Call the `@Scheduled` method directly; mock the repository and services; verify each item is processed and one failure doesn't stop the rest |
| Controller (only when asked, or for non-trivial request mapping/validation) | `@WebMvcTest(XController.class)` + `MockMvc` (`spring-boot-starter-webmvc-test` is present) | `@MockitoBean` the service; check status codes, JSON body, `@Valid` → 400 |
| Repository JPQL (`@Query`) | **Not possible without a test database.** List these as not covered and suggest H2 or Testcontainers. Don't add them yourself. |

`AppliboardApplicationTests.contextLoads` needs MySQL running, which is why CI runs only the listed unit tests. Don't add more `@SpringBootTest` tests.

## 2. Coverage checklist (per public method)

Cover each item that applies. Each one is its own test or one parameterized case.

- **Happy path:** the returned value (every DTO field via an assertion helper) **and** the side effects (`save`, `deleteById`, `activityService.createActivity(..., ActivityType.X)`, notification created, email sent).
- **Captured arguments:** use `ArgumentCaptor` to check what was saved or sent, field by field. A plain `verify(repo).save(any())` isn't enough.
- **Not found:** each `NotFoundException` path (missing entity, missing user).
- **Ownership:** another user gets `UnauthorizedException` on every method that checks it.
- **No side effects on failure:** after an exception, `verify(repository, never()).save(any())` and nothing is published or recorded in the activity feed.
- **Partial updates:** null or blank fields keep the old values (as in `updateJobApplication_ShouldUpdateOnlyProvidedFields...`).
- **Boundaries:** empty lists/pages, null filters, min/max sizes, both values of a boolean, every enum value that changes behavior, the exact edge of time windows.
- **Idempotency** for consumers and schedulers: a duplicate event creates nothing new; already-notified items are skipped.
- **Error handling:** when a dependency throws, the method rethrows, wraps or swallows it as the code intends.

Then cross-check: every `if`, `else`, `throw`, early `return` and `catch` in the class under test is reached by at least one test. List any branch you couldn't reach.

## 3. No repetition

**Within one test class:**
- Constants for ids and times: `private static final UUID USER_ID = UUID.fromString("1111...")`, `OTHER_USER_ID`, `ENTITY_ID`, `Instant.parse("2026-07-05T09:00:00Z")`. No `UUID.randomUUID()` or `Instant.now()` in assertions.
- One `@BeforeEach` builds the default entities. Tests change only the field they care about (`jobApplication.setIsFavorite(true)`).
- Factory helpers for request DTOs (`createDto()`, `updateDto()`, `emptyFilters()`) and wrappers (`pageOf(entity)`).
- One assertion helper per DTO (`assertMatchesJobApplication(dto)`) instead of repeating ten `assertEquals`.
- **Parameterize repeated scenarios:**
  - the same exception checked across several methods → `@MethodSource` with `named(...)` lambdas and a small `@FunctionalInterface` (the `ownedApplicationCalls` pattern),
  - the same logic with different inputs → `@ValueSource`, `@EnumSource`, `@CsvSource`,
  - validation rules → `@MethodSource` of `(invalid dto, expected field)` pairs.

**Across test classes:**
- When a second test class needs the same entity (e.g. the `User` built in both `UserServiceTest` and `JobApplicationServiceTest`), create or extend `src/test/java/com/backend/appliboard/support/TestFixtures.java`. It holds static builder methods with defaults (`TestFixtures.user(USER_ID)`, `TestFixtures.jobApplication(user)`) that return a `.builder()` or a ready entity, so tests can override fields. Don't change existing test classes to use it unless asked; use it in new ones.
- Don't create a fixture for something only one test class uses.

## 4. Style

- Package and location: `src/test/java/com/backend/appliboard/<ClassUnderTest>Test.java` (flat, like the existing tests). Use a sub-package only if the user asks.
- Test names: `methodName_ShouldExpectedResult_WhenCondition` (e.g. `deleteJobApplication_ShouldThrowUnauthorizedException_WhenUserDoesNotOwnIt`). Parameterized tests use `@ParameterizedTest(name = "...")` so each case reads clearly in reports.
- Structure each test as arrange / act / assert, separated by blank lines, with one behavior per test.
- Name the class under test after what it is (`jobApplicationService`), not `...Mock`, and mocks after their type (`jobApplicationRepository`).
- Stub only what the test needs. `MockitoExtension` is strict, so unused stubs fail the test. Don't use `lenient()` to hide that.
- Prefer exact argument matching (`eq(pageable)`, real values) over `any()`, except for types that can't be compared, such as `Specification`.
- Use `assertThrows` and also check the message when the message matters to the API response.
- **Time:** code that uses `Instant.now()` (mapper `isStale`, `RefreshTokenService`, `StaleApplicationReminderService`) is tested with values far from the boundary (`now ± days`), or by capturing the computed cutoff and asserting it falls in a range. Suggest injecting a `Clock` if exact-boundary tests matter.
- No `Thread.sleep`, no real network, files or DB, and no order dependence between tests.

## 5. Finish

1. Re-read the test file against §2 and §3. Remove any duplicated setup or assertion that slipped in.
2. Report:
   - the behaviors covered (a short checklist per method),
   - branches or classes **not** covered and why (JPQL queries, `@SpringBootTest` needs, untestable `Instant.now()` edges),
   - any fixture added to `support/TestFixtures.java`,
   - production code smells found while testing (large methods, hidden `new`, static time), as suggestions only.
3. CI runs only the classes listed in `.github/workflows/ci.yml` (`-Dtest=UserServiceTest,JobApplicationServiceTest`). Tell the user which new test classes would need to be added there. Don't edit the workflow without approval.
4. Say which command would run the tests, for example:
   `cd appliboard; ./mvnw test -Dtest=<NewTestClass>`
   Run it only if the user asks.
