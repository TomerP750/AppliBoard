# Clean code: SOLID, DRY, naming, small functions

These apply to all code in this repo, backend and frontend. Apply them in proportion: the goal is code that is easy to read and change, not the most classes, interfaces or files. Don't refactor existing code just to follow them. Apply them to the code you write or change, and mention bigger cleanups instead of doing them.

## SOLID

| Principle | In this project |
| --- | --- |
| **Single responsibility** | One reason to change per class, component or function. Controllers handle HTTP only (map the request, call the service, return a DTO). Services hold business logic. Repositories hold data access. Mappers convert. React pages compose; components render; hooks hold logic; services call the API. |
| **Open/closed** | Add behavior by adding code, not by growing `if`/`switch` chains on a type. Prefer a lookup map (`Record<Status, string>`, an `EnumMap`) or a strategy/interface when a third or later case appears. Example: `EmailSender` with `LoggingEmailSender`, so a real sender can be added without changing callers. |
| **Liskov substitution** | Every implementation of an interface (`I*Service`, `EmailSender`) must honor the same contract: same inputs, same meaning of the result, no surprise exceptions. |
| **Interface segregation** | Keep interfaces and component props small and focused. Don't make a component take a big object when it needs two fields, and don't add methods to an interface that only one caller needs. |
| **Dependency inversion** | Depend on interfaces, not implementations: inject `I*Service` / `EmailSender` through constructor injection (`@RequiredArgsConstructor` + `final` fields), never `new` a service or call a concrete class directly. On the frontend, components use the service only through React Query hooks. |

Don't create an interface or abstraction for something that has one implementation and no realistic second one, unless the existing pattern requires it (the `I*Service` + implementation convention does).

## DRY

- When the same logic appears a **third** time (or twice and it's non-trivial), extract it: a shared util, a custom hook, a shared UI primitive, a mapper method or a private helper.
- Put the extracted code at the lowest level that serves all callers: within the file, then the feature, and only then `shared/`.
- Single source of truth: enums, constants, query keys, API base URL, theme colors (`index.css`), and error messages live in one place and are imported, never copied.
- DRY is about knowledge, not similar-looking code. Two pieces of code that look alike but change for different reasons can stay separate. Don't merge them with flags and conditionals.

## Descriptive names

- Names say what something is or does in the domain: `staleApplications`, `markNotificationAsRead`, `findApplicationsNotUpdatedSince`, `CvUploadCard`. Avoid `data`, `item`, `obj`, `tmp`, `handle`, `process`, `doStuff`, `util`.
- Functions and methods are verbs (`calculateResponseRate`, `sendStaleReminder`). Booleans read as questions (`isStale`, `hasUnread`, `canSubmit`). Collections are plural.
- No abbreviations unless they are standard (`id`, `dto`, `url`, `cv`). `jobApplication` instead of `ja` in new code.
- Java: `PascalCase` classes, `camelCase` methods and fields, `UPPER_SNAKE_CASE` constants. TypeScript: see `frontend/AGENTS.md` (components `PascalCase`, hooks `useXxx`, handlers `handleXxx`/`onXxx`).
- Name a value by its meaning and units: `accessExpirationMs`, `maxFileSizeBytes`, not `time` or `size`.

## Small functions

- A function does one thing at one level of abstraction. If you need "and" to describe it, or it has comment headers separating its sections, split it.
- Rough limits (signals, not hard rules): about **20–30 lines** per function or method, about **3 parameters** (beyond that, pass a DTO or options object), and nesting no more than **2 levels deep**.
- Split by extracting well-named private methods or helper functions, so the top-level function reads like a list of steps:

  ```java
  public void sendStaleApplicationReminders() {
      List<JobApplication> staleApplications = findStaleApplications();
      staleApplications.forEach(this::remind);
  }
  ```

- Use guard clauses and early returns instead of deep `if`/`else` nesting.
- Keep side effects visible: a function called `getX`/`findX` doesn't modify state.
- In React, split a large component by extracting sub-components or a custom hook, as described in `.claude/rules/react.md`.

## Before finishing

Check the code you wrote: one responsibility per unit, no copied logic, names that explain themselves without comments, and no function that's hard to read in one screen. Mention anything you left as is on purpose.
