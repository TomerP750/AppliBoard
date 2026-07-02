package com.backend.appliboard.features.analytics;

import com.backend.appliboard.features.analytics.dto.AnalyticsDto;
import com.backend.appliboard.features.job_application.Status;

import java.util.Map;
import java.util.UUID;

public interface IAnalyticsService {

    AnalyticsDto getAnalytics(UUID userId);

}
