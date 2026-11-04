package com.backend.appliboard.features.my_cv_helper.dto;

import com.backend.appliboard.features.my_cv_helper.CvLayout;

public record CvAdjustRequest(
        String jobListingDescription,
        CvLayout cvLayout,
        Object cvPdf
) {
}
