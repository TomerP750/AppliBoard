---
paths:
  - "appliboard/**"
---

# Backend rules (Spring Boot, Java 17)

- A feature lives in `features/<feature>/`: controller → `I<Name>Service` interface → `<Name>Service` impl → repository, plus entity, `<Name>Mapper`, and `dto/`. To create a new feature, follow the `new-feature` skill.
- Controllers expose DTOs, never entities. Map with the feature's mapper.
- Throw the existing exceptions in `shared/exceptions/` (`NotFoundException`, `InvalidInputException`, `UnauthorizedException`, ...) and let `GlobalExceptionHandler` shape the response. Don't build error responses in controllers.
- Every query for user data must be scoped to the authenticated user (`PrincipalUser`).
- List endpoints are paginated.
- Secrets come from `${ENV_VAR}` placeholders in `application.properties`. Never hardcode or log them.
- Scheduled jobs (`@Scheduled`, e.g. `StaleApplicationReminderService`) must be idempotent across runs, and one failing item must not stop the rest of the run.
- Tests: JUnit 5 + Mockito, following `JobApplicationServiceTest`. To write tests, follow the `backend-test` skill. Write tests when asked; run them only when asked.
- Don't add or change dependencies in `pom.xml` unless asked.
