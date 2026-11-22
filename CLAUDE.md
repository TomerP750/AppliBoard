# AppliBoard

Full-stack job application tracker: React 19 + TypeScript SPA (`frontend/`) and a Spring Boot 4 / Java 17 REST API (`appliboard/`) with MySQL, MongoDB and Spring AI.
Product scope, features and roadmap: `docs/PRD.md` (read it when a task touches product behavior).

## Critical rules

**Only reading files and editing code are allowed without asking. Everything else needs my explicit approval first:** running any command or script, tests, builds, lint, servers, git operations, creating or deleting files beyond the code change, network requests, and changes to config, environment or tooling. Ask, wait for a clear yes, then act.

In particular, unless I ask in the current chat:

- **Do not deploy** or push images anywhere.
- **Do not install anything.** No new or upgraded dependencies (`npm`, `pom.xml`, global tools, Docker images). Propose it and wait.
- **Do not run tests or builds.** When you finish, say which checks *could* be run and let me decide.
- Do not commit, push, merge or open PRs. Never commit to `main`; never force-push.
- Do not run Docker or trigger or edit CI workflows.
- Do not delete files or data (DB rows, tables, collections).
- Never read, print, log, commit or hardcode secrets (`.env`, JWT secret, DB passwords, API keys).

These are also enforced in `.claude/settings.json`.

## How to work

- Check `.claude/rules/` and `.claude/skills/` for anything related to the request and follow it.
- Stay in scope: change only what the request needs. Mention unrelated issues instead of fixing them.
- Follow existing patterns in neighboring code before inventing new ones.
- If a request is ambiguous or has several reasonable designs, ask before writing a lot of code.
- Report honestly: what changed, what was checked, and what was not verified.

## Commit suggestion (end of every answer that changed files)

I commit myself. After any answer where you created, edited or deleted files, end with:

1. **Commit now?** Say **"Good point to commit"** when the change is one complete, working logical unit (a feature step, a fix, a refactor, tests for one class, a docs/config change). Say **"Not yet: …"** with the reason when the work is half done, broken, or will be finished in the next step, and say what should be done first.
2. **Suggested message** in Conventional Commits format, in a code block:
   - `type(scope): summary`, where type is one of `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `perf`, `build`, `ci`, `chore`, and scope is an area such as `auth`, `notifications`, `applications`, `cv-helper`, `analytics`, `frontend`, `backend` or `claude`,
   - imperative mood, lowercase after the colon, no period, at most 72 characters,
   - add a short body (why, not how) only for non-obvious changes,
   - one logical change per commit: if the changes mix unrelated things, suggest separate commits and say which files go in each.
3. If some changed files shouldn't be committed (secrets, `.env`, local or scratch files), say so.

Skip this for answers that changed no files. Never run `git add`/`git commit` yourself unless I ask.

## Commands (reference only — run only when I ask)

| Purpose | Command |
| --- | --- |
| Backend tests | `cd appliboard; ./mvnw test` |
| Backend CI subset | `./mvnw -Dtest=UserServiceTest,JobApplicationServiceTest verify` |
| Frontend lint | `cd frontend; npm run lint` |
| Frontend build | `cd frontend; npm run build` |
