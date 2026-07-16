package com.backend.appliboard.features.analytics;

import com.backend.appliboard.features.analytics.dto.AnalyticsDto;

import java.util.UUID;

public interface IAnalyticsService {

    AnalyticsDto getAnalytics(UUID userId);

}
