package com.backend.appliboard.features.analytics.dto;

import com.backend.appliboard.features.job_application.Status;

import java.util.Map;

public record AnalyticsDto(
        Long totalApplicationsSent,
        Long weeklyApplicationsSent,
        Map<Status, Long> countByStatus
) {
}
