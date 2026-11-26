package com.backend.appliboard.support;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.mysql.MySQLContainer;

/**
 * Base class for integration tests: starts the whole Spring app against real MySQL and Redis running in Docker.
 * <p>
 * The containers start once, in the static block, and are shared by every test class that extends this one.
 * They are not managed with {@code @Testcontainers}/{@code @Container}: that would stop them after each class,
 * while Spring keeps reusing its cached app context, so the next class would talk to stopped containers.
 * Testcontainers removes them when the test run (the JVM) ends.
 * <p>
 * {@link ServiceConnection} points Spring at the containers, so no datasource or Redis URL is configured by hand.
 * Requires Docker to be running.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        // Fake values for the environment variables in application.properties. Not real secrets.
        "jwt.secret=integration-test-secret-at-least-32-bytes-long",
        "DB_USERNAME=unused-the-container-provides-it",
        "DB_PASSWORD=unused-the-container-provides-it",
        "ANTHROPIC_API_KEY=integration-test-no-ai-calls"
})
public abstract class IntegrationTestBase {

    @ServiceConnection
    static final MySQLContainer MYSQL = new MySQLContainer("mysql:8.4");

    @ServiceConnection(name = "redis")
    static final GenericContainer<?> REDIS = new GenericContainer<>("redis:7-alpine").withExposedPorts(6379);

    static {
        MYSQL.start();
        REDIS.start();
    }

    @Autowired
    protected MockMvc mockMvc;
}
