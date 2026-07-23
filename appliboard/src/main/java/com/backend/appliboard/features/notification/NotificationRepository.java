package com.backend.appliboard.features.notification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    long countByUserIdAndIsReadFalse(UUID userId);

    Page<Notification> findByUserId(UUID userId, Pageable pageable);
}
