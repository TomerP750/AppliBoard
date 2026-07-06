package com.backend.appliboard.features.activity;

import com.backend.appliboard.features.activity.dto.ActivityDto;
import com.backend.appliboard.features.job_application.JobApplication;
import com.backend.appliboard.features.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;


public interface IActivityService {

    Page<ActivityDto> allActivities(UUID userId, Pageable pageable);

    void createActivity(User user, String message, ActivityType type);

}
