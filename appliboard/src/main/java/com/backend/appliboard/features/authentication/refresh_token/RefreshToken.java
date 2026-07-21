package com.backend.appliboard.features.authentication.refresh_token;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "refresh_tokens")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    private String tokenHash;

    private String userId;

    @Indexed(expireAfter = "0s")
    private Instant expiresAt;

    private Boolean revoked;

    private Instant createdAt;
}
