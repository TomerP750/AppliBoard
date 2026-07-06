package com.backend.appliboard.features.activity;

public enum ActivityType {

    CREATED("created"),
    UPDATED("updated"),
    DELETED("deleted");

    private final String action;

    ActivityType(String action) {
        this.action = action;
    }

    public String createMessage(String name) {
        return "You " + action + " the job application: " + name;
    }
}
