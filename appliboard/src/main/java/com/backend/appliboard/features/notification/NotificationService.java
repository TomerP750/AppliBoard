package com.backend.appliboard.features.notification;

import com.backend.appliboard.features.notification.dto.NotificationDto;
import com.backend.appliboard.features.user.UserService;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import com.backend.appliboard.shared.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService implements INotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;
    private final NotificationMapper notificationMapper;

    @Override
    public void createNotification(UUID userId) {

    }

    @Override
    public Page<NotificationDto> allNotifications(UUID userId, Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findByUserId(userId, pageable);
        return notifications.map(notificationMapper::toDto);
    }

    @Override
    public long getUnreadNotificationsCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public boolean toggleIsRead(UUID userId, UUID notificationId) throws NotFoundException, UnauthorizedException {

        Notification notification = fetchNotificationEntity(notificationId);

        if (!userId.equals(notification.getUser().getId())) {
            throw new UnauthorizedException("You are not authorized to toggle");
        }

        boolean isRead = notification.getIsRead();
        notification.setIsRead(!isRead);

        notificationRepository.save(notification);

        return isRead;

    }

    private Notification fetchNotificationEntity(UUID notificationId) throws NotFoundException {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotFoundException("Notification not found"));
    }


}
