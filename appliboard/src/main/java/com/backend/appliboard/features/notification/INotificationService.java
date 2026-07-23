package com.backend.appliboard.features.notification;

import com.backend.appliboard.features.notification.dto.NotificationDto;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import com.backend.appliboard.shared.exceptions.UnauthorizedException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface INotificationService {

    void createNotification(UUID userId);

    Page<NotificationDto> allNotifications(UUID userId, Pageable pageable);

    long getUnreadNotificationsCount(UUID userId);

    boolean toggleIsRead(UUID userId ,UUID notificationId) throws NotFoundException, UnauthorizedException;
}
