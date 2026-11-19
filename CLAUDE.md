# AppliBoard

Full-stack job application tracker: React 19 + TypeScript SPA (`frontend/`) and a Spring Boot 4 / Java 17 REST API (`appliboard/`) with MySQL, MongoDB, Kafka and Spring AI.
Product scope, features and roadmap: `docs/PRD.md` (read it when a task touches product behavior).

## Critical rules

**Only reading files and editing code are allowed without asking. Everything else needs my explicit approval first:** running any command or script, tests, builds, lint, servers, git operations, creating or deleting files beyond the code change, network requests, and changes to config, environment or tooling. Ask, wait for a clear yes, then act.

In particular, unless I ask in the current chat:

- **Do not deploy** or push images anywhere.
- **Do not install anything.** No new or upgraded dependencies (`npm`, `pom.xml`, global tools, Docker images). Propose it and wait.
- **Do not run tests or builds.** When you finish, say which checks *could* be run and let me decide.
- Do not commit, push, merge or open PRs. Never commit to `main`; never force-push.
- Do not run Docker or trigger or edit CI workflows.
- Do not delete files or data (DB rows, tables, Kafka topics).
- Never read, print, log, commit or hardcode secrets (`.env`, JWT secret, DB passwords, API keys).

These are also enforced in `.claude/settings.json`.

## How to work

- Check `.claude/rules/` and `.claude/skills/` for anything related to the request and follow it.
- Stay in scope: change only what the request needs. Mention unrelated issues instead of fixing them.
- Follow existing patterns in neighboring code before inventing new ones.
- If a request is ambiguous or has several reasonable designs, ask before writing a lot of code.
- Report honestly: what changed, what was checked, and what was not verified.

## Commands (reference only — run only when I ask)

| Purpose | Command |
| --- | --- |
| Backend tests | `cd appliboard; ./mvnw test` |
| Backend CI subset | `./mvnw -Dtest=UserServiceTest,JobApplicationServiceTest verify` |
| Frontend lint | `cd frontend; npm run lint` |
| Frontend build | `cd frontend; npm run build` |
