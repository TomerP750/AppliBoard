package com.backend.appliboard.features.notification;

import com.backend.appliboard.features.notification.dto.NotificationDto;
import com.backend.appliboard.infrastructures.security.PrincipalUser;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import com.backend.appliboard.shared.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/all")
    public Page<NotificationDto> allNotifications(@AuthenticationPrincipal PrincipalUser user,
                                                  @RequestParam(name = "page", defaultValue = "0") int page,
                                                  @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        UUID userId = user.getUserId();

        return notificationService.allNotifications(userId, pageable);

    }

    @GetMapping("count")
    public long getUnreadNotificationsCount(@AuthenticationPrincipal PrincipalUser user) {
        UUID userId = user.getUserId();
        return notificationService.getUnreadNotificationsCount(userId);
    }

    @PatchMapping("/toggle-isRead/{notificationId}")
    public boolean toggleIsRead(@AuthenticationPrincipal PrincipalUser user, @PathVariable UUID notificationId) throws UnauthorizedException, NotFoundException {
        UUID userId = user.getUserId();
        return notificationService.toggleIsRead(userId, notificationId);
    }




}
