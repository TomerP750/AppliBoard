package com.backend.appliboard.features.activity;

import com.backend.appliboard.features.activity.dto.ActivityDto;
import com.backend.appliboard.infrastructures.security.PrincipalUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;


    @GetMapping
    public Page<ActivityDto> allActivities(@AuthenticationPrincipal PrincipalUser user,
                                           @RequestParam(name = "page", defaultValue = "0") int page,
                                           @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        UUID userId = user.getUserId();
        return activityService.allActivities(userId, pageable);
    }


}
