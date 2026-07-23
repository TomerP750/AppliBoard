package com.backend.appliboard.features.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaleApplicationReminderService {

    private final NotificationRepository notificationRepository;

    @Scheduled(cron = "0 0 9 * * *")
    public void createReminderNotificationForStaleApplications() {

    }



}
