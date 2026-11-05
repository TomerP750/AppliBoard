package com.backend.appliboard.features.cv_helper.dto;

import com.backend.appliboard.features.cv_helper.CvLayout;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public record CvAdjustRequest(
        @NotBlank
        @Size(max = 20_000)
        String jobListingDescription,
        @NotNull
        CvLayout cvLayout,
        @NotNull
        MultipartFile cvPdf
) {
}
