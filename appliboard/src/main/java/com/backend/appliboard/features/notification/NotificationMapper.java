package com.backend.appliboard.features.notification;

import com.backend.appliboard.features.notification.dto.NotificationDto;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationDto toDto(Notification entity) {
        return new NotificationDto(
                entity.getId(),
                entity.getMessage(),
                entity.getJobApplicationName(),
                entity.getIsRead(),
                entity.getNotificationType(),
                entity.getCreatedAt()
        );
    }
}
