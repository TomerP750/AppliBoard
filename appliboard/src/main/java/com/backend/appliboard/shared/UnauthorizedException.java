package com.backend.appliboard.shared;

public class UnauthorizedException extends Exception {
    public UnauthorizedException(String message) {
        super(message);
    }
}
