package com.backend.appliboard.features.cv_helper.dto;

import com.backend.appliboard.features.cv_helper.CvLayout;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateNewCvRequest(
        @NotBlank @Size(max = 150)
        String name,

        @NotBlank @Size(max = 150)
        String title,

        @Size(max = 50)
        String phoneNumber,

        @NotBlank @Email @Size(max = 254)
        String email,

        @Size(max = 200)
        String location,

        @Size(max = 500)
        String linkedInUrl,

        @Size(max = 500)
        String githubUrl,

        @Size(max = 2_000)
        String professionalBackground,

        @NotNull @Size(max = 100)
        List<@NotBlank @Size(max = 100) String> technologies,

        @NotNull @Size(max = 20)
        List<@NotNull @Valid Experience> experience,

        @NotNull @Size(max = 10)
        List<@NotNull @Valid Education> education,

        @NotNull @Size(max = 20)
        List<@NotNull @Valid Project> projects,

        @Size(max = 20_000)
        String jobListingDescription,

        @NotNull
        CvLayout cvLayout
) {
    public record Experience(
            @NotBlank @Size(max = 150) String jobTitle,
            @NotBlank @Size(max = 150) String company,
            @NotBlank @Size(max = 50) String startDate,
            @Size(max = 50) String endDate,
            @NotBlank @Size(max = 3_000) String responsibilitiesAndAchievements
    ) {}

    public record Education(
            @NotBlank @Size(max = 200) String institution,
            @NotBlank @Size(max = 200) String qualification,
            @Size(max = 50) String startDate,
            @Size(max = 50) String endDate
    ) {}

    public record Project(
            @NotBlank @Size(max = 150) String name,
            @NotBlank @Size(max = 3_000) String description,
            @Size(max = 500) String url
    ) {}
}