---
name: code-reviewer
description: Self-review AppliBoard code changes for readability, naming, maintainability, modularity, correctness and edge cases, fix what falls short, and report the result. Use after every code change (backend or frontend) before telling the user the work is done, or when asked to "review", "code review" or "check the code quality".
---

# Code reviewer

Review the code you just wrote or changed, as a strict senior reviewer would, fix what you find, then report.

**Scope:** only the files changed in the current task, and only the lines you touched plus what they directly affect. Don't review or refactor untouched code; mention bigger issues you notice there instead (see "How to work" in `CLAUDE.md`).

**Tools:** read the files with Read and Grep. Don't run `git diff`, tests, builds or lint: those need the user's approval (`CLAUDE.md`). If you can't remember exactly what you changed, re-read the changed files in full.

The standards themselves live in `.claude/rules/` (`clean-code.md`, `backend.md`, `frontend.md`, `react.md`). This skill is the checklist for applying them; it doesn't repeat them.

## 1. Read like a newcomer

Read each changed file top to bottom once, as someone who has never seen it. Note every place where you had to stop and think, scroll back, or read a comment to understand the code. Those are the findings that matter most.

## 2. Checklist

### Naming

| # | Check |
| --- | --- |
| N1 | Every name says what the thing is or does in the domain (`staleApplications`, `refreshSession`), not how it's built (`data`, `item`, `handle`, `result`, `tmp`). |
| N2 | Functions are verbs, booleans read as questions (`isStale`, `hasRetriedAfterRefresh`), collections are plural. |
| N3 | Values with units carry them (`refreshTokenTtl`, `maxFileSizeBytes`). No unexplained abbreviations. |
| N4 | The same concept has the same name everywhere it appears (backend, DTOs, frontend models). |

### Readability

| # | Check |
| --- | --- |
| R1 | Each function does one thing at one level of abstraction; the top-level function reads like a list of steps. |
| R2 | Size signals from `clean-code.md`: ~20–30 lines per function, ~3 parameters, nesting ≤ 2 levels. Use guard clauses and early returns. |
| R3 | No magic numbers or strings: they're named constants, defined once. |
| R4 | Comments explain **why** (a race, a security reason, a backend contract), not what the code already says. No commented-out code, no stale comments left from before the change. |
| R5 | The code follows the patterns of neighboring code (service class shape, hook style, exception style) instead of inventing a new one. |

### Maintainability

| # | Check |
| --- | --- |
| M1 | No copied logic: the third repetition (or the second non-trivial one) is extracted at the lowest level that serves all callers. |
| M2 | Single source of truth: enums, constants, query keys, URLs, colors and messages are imported, not duplicated. |
| M3 | Side effects are visible: a `get`/`find`/`is` function doesn't change state. |
| M4 | Errors are handled on purpose: nothing is silently swallowed, the backend throws the existing exceptions from `shared/exceptions/`, the frontend shows loading, empty and error states. |
| M5 | Types are precise: no `any`, no needless casts or `!`, nullable values are handled. Java: `final` fields, no raw types. |
| M6 | Nothing left over: unused imports, variables, files, parameters or dead branches from the old code. |

### Modularity

| # | Check |
| --- | --- |
| D1 | Each unit has one reason to change: controllers do HTTP only, services hold logic, repositories hold data access, mappers convert; pages compose, components render, hooks hold logic, `api/` modules call the server. |
| D2 | Code lives in the right place: in its feature folder, and in `shared/` only when two or more features use it. |
| D3 | Dependencies point the right way: no feature reaching into another feature's internals, Spring constructor injection of the concrete `*Service`, components reaching the API only through hooks. |
| D4 | Interfaces and props are small: callers get what they need, not a big object. No abstraction with one implementation and no realistic second one (except the `I*Service` convention). |

### Correctness and safety

| # | Check |
| --- | --- |
| C1 | Every edge case in the next section that applies to the change is handled, or consciously left out and reported. |
| C2 | Every query for user data is scoped to the authenticated user; input is validated on the server. |
| C3 | No secrets in code or logs, and no personal data in logs or URLs. |
| C4 | Callers of anything whose signature or behavior changed were found (Grep) and updated. |

### Edge cases

For each changed function, ask "what happens if…?" for the cases below that apply. Trace the code by hand for each one: don't assume. Skip groups that don't fit the change.

| # | Group | What happens if… |
| --- | --- | --- |
| E1 | **Input** | the value is `null`, `undefined`, empty (`""`, `[]`, no file), only whitespace, or at the limits (0, negative, max length, max file size, a huge page number)? It has unexpected characters (`%`, `_`, quotes, emoji, HTML)? |
| E2 | **Collections** | the list is empty, has one item, or is very long? The item is the first or the last one? There are duplicates? |
| E3 | **Ownership** | the id doesn't exist, was deleted a moment ago, or belongs to another user? |
| E4 | **Time** | it runs at midnight, at a month or year boundary, across a DST change, or in another time zone? A token or session expires halfway through? |
| E5 | **Concurrency** | the same action runs twice at once (double click, two requests, two tabs, two scheduler runs)? Two users or tabs edit the same record? A response arrives after a newer one? |
| E6 | **Failure** | the database, Redis, the AI API or the network fails or is slow? It fails halfway: is the data left half-written, or is the transaction rolled back? Is the step retried, and is a retry safe (idempotent)? |
| E7 | **Auth state** | the user is logged out, the access token expired, the refresh token was revoked, or the account was deleted while the page was open? |
| E8 | **UI states** | the data is loading, empty, or failed? The user navigates away mid-request, submits twice, or reloads the page? Very long text or a small mobile screen? Keyboard only? |
| E9 | **Backward compatibility** | old data in the database, old values in the browser (localStorage, cookies), or an old frontend talking to the new API? |

When an edge case isn't handled:
- If the fix is small and inside the task, fix it.
- Otherwise list it under **Left as is** with what would happen to the user, so they can decide.

## 3. Fix, then re-check

- Fix every finding that is inside the scope of the current task, then re-read the changed code once more.
- Don't fix findings that would mean changing unrelated code, adding dependencies, or a large redesign. List them for the user instead.
- When two reasonable designs exist and the choice is the user's, ask instead of picking silently.

## 4. Report

Add a short **Code review** section to the final answer:

- **Fixed:** what the review changed, one line each.
- **Edge cases:** the ones that mattered for this change and how each is handled, one line each.
- **Left as is:** findings you didn't fix, with `file:line` and why (out of scope, needs a decision, on purpose).
- **Not verified:** what reading code can't prove: it compiled, tests pass, lint is clean, the app behaves correctly at runtime. Name the checks that could be run (`CLAUDE.md` → Commands) and let the user decide.

Keep it short. If everything passed, say so in one line instead of listing every check.
