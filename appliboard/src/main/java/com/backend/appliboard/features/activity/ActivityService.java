package com.backend.appliboard.features.activity;

import com.backend.appliboard.features.activity.dto.ActivityDto;
import com.backend.appliboard.features.job_application.JobApplication;
import com.backend.appliboard.features.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityService implements IActivityService {

    private final ActivityRepository activityRepository;


    @Override
    public Page<ActivityDto> allActivities(UUID userId, Pageable pageable) {
        Page<Activity> activities = activityRepository.findByUserId(userId, pageable);

        return activities.map(ActivityMapper::toDto);
    }

    @Override
    public void createActivity(User user, String message, ActivityType type) {
        Activity activity = Activity.builder()
                .message(message)
                .activityType(type)
                .user(user)
                .build();
        activityRepository.save(activity);
    }

}
