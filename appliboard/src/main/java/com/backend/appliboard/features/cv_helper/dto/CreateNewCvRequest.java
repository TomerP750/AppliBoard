package com.backend.appliboard.features.cv_helper.dto;

import java.util.Set;

public record CreateNewCvRequest(
        String name,
        String title,
        String phoneNumber,
        String email,
        String linkedInUrl,
        String githubUrl,
        Set<String> technologies,

) {
}
