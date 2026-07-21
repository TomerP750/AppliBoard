package com.backend.appliboard.features.authentication.refresh_token;

import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "refresh_tokens")
public class RefreshToken {

    @Id
    private String tokenHash;

    private String userId;

    @Indexed(expireAfter = "0s")
    private Instant expiresAt;

    private Boolean revoked;

    private Instant createdAt;
}
