package com.backend.appliboard.features.notification.email;

/**
 * Sends a plain-text email.
 * <p>
 * The app depends only on this interface, so the delivery mechanism can be swapped
 * (e.g. an SMTP implementation using {@code JavaMailSender}) without touching any caller.
 *
 * @see LoggingEmailSender the current mock implementation
 */
public interface EmailSender {

    /**
     * @param to      recipient email address
     * @param subject email subject line
     * @param body    plain-text email body
     */
    void send(String to, String subject, String body);
}
