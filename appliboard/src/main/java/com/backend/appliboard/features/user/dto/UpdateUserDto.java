package com.backend.appliboard.features.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateUserDto(

        @Pattern(regexp = "^$|.{2,10}", message = "First name must be between 2 and 10 characters")
        String firstName,

        @Pattern(regexp = "^$|.{2,10}", message = "Last name must be between 2 and 10 characters")
        String lastName,

        @Email(message = "Email must be valid")
        @Size(max = 255, message = "Email must not exceed 255 characters")
        String email,

        @Size(max = 2048, message = "Avatar URL must not exceed 2048 characters")
        String avatarUrl
) {
}
