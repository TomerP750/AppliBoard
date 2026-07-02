package com.backend.appliboard.features.analytics;

import com.backend.appliboard.features.analytics.dto.AnalyticsDto;
import com.backend.appliboard.infrastructures.security.PrincipalUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/get")
    public AnalyticsDto getAnalytics(@AuthenticationPrincipal PrincipalUser principalUser) {
        UUID userId = principalUser.getUserId();
        return analyticsService.getAnalytics(userId);
    }

}
