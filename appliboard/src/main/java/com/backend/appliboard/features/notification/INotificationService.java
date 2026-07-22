package com.backend.appliboard.features.notification;

import org.springframework.data.domain.Page;

import java.util.UUID;

public interface INotificationService {



    long getUnreadNotificationsCount(UUID userId);
}
