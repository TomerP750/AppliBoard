package com.backend.appliboard.features.notification;

import com.backend.appliboard.features.user.UserRepository;
import com.backend.appliboard.features.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService implements INotificationService {

    private final UserRepository userRepository;
    private final UserService userService;

    @Override
    public long getUnreadNotificationsCount(UUID userId) {
        return 0;
    }



}
