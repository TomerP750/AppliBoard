package com.backend.appliboard.features.notification.email;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Mock {@link EmailSender}: <b>no email is actually sent</b>.
 * The email is written to the application log instead, so the flow can be demonstrated
 * without an SMTP server. Replace with a real implementation to deliver mail.
 */
@Component
@Slf4j
public class LoggingEmailSender implements EmailSender {

    @Override
    public void send(String to, String subject, String body) {
        log.info("""
                [MOCK EMAIL]
                To: {}
                Subject: {}

                {}""", to, subject, body);
    }
}
