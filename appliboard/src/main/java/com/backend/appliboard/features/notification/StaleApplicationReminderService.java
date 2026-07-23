package com.backend.appliboard.features.notification;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class StaleApplicationReminderService {

    @Scheduled(cron = "0 0 9 * * *")
    public void createReminderNotificationForStaleApplications() {

    }



}
