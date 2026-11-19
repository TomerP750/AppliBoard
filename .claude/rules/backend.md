---
paths:
  - "appliboard/**"
---

# Backend rules (Spring Boot, Java 17)

- A feature lives in `features/<feature>/`: controller → `I<Name>Service` interface → `<Name>Service` impl → repository, plus entity, `<Name>Mapper`, and `dto/`.
- Controllers expose DTOs, never entities. Map with the feature's mapper.
- Throw the existing exceptions in `shared/exceptions/` (`NotFoundException`, `InvalidInputException`, `UnauthorizedException`, ...) and let `GlobalExceptionHandler` shape the response. Don't build error responses in controllers.
- Every query for user data must be scoped to the authenticated user (`PrincipalUser`).
- List endpoints are paginated.
- Secrets come from `${ENV_VAR}` placeholders in `application.properties`. Never hardcode or log them.
- Kafka: topics are declared in `infrastructures/config/KafkaTopicConfig.java`; error handling lives in `KafkaErrorHandlingConfig.java`. Consumers must be idempotent and must not block a partition on a bad message.
- Tests: JUnit 5 + Mockito service tests, following `UserServiceTest` and `JobApplicationServiceTest`. Write tests when asked; run them only when asked.
- Don't add or change dependencies in `pom.xml` unless asked.
