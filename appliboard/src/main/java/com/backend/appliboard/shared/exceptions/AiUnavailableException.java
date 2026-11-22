package com.backend.appliboard.shared.exceptions;

/**
 * Thrown when an AI feature can't produce a result: AI is not configured, the AI provider
 * call failed, or the AI returned an unusable answer. Unchecked because it is an
 * infrastructure failure the caller can't recover from, only report.
 */
public class AiUnavailableException extends RuntimeException {

    public AiUnavailableException(String message) {
        super(message);
    }

    public AiUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
