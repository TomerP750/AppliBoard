package com.backend.appliboard.features.activity;

import com.backend.appliboard.features.activity.dto.ActivityDto;
import org.springframework.stereotype.Component;

@Component
public class ActivityMapper {


    private ActivityMapper() {
    }

    public static ActivityDto toDto(Activity entity) {
        return new ActivityDto(
                entity.getId(),
                entity.getMessage(),
                entity.getActivityType(),
                entity.getCreatedAt()
        );
    }
}
