package com.backend.appliboard.features.job_application;

import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.UUID;

public final class JobApplicationSpecifications {

    private JobApplicationSpecifications() {
    }

    public static Specification<JobApplication> belongsToUser(UUID userId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("user").get("id"), userId);
    }

    public static Specification<JobApplication> nameContains(String name) {
        return (root, query, criteriaBuilder) -> {
            if (name == null || name.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("name")),
                    "%" + name.trim().toLowerCase() + "%"
            );
        };
    }

    public static Specification<JobApplication> hasStatuses(List<Status> statuses) {
        return (root, query, criteriaBuilder) -> {
            if (statuses == null || statuses.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            return root.get("status").in(statuses);
        };
    }

    public static Specification<JobApplication> hasPositions(List<Position> positions) {
        return (root, query, criteriaBuilder) -> {
            if (positions == null || positions.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            return root.get("position").in(positions);
        };
    }

    public static Specification<JobApplication> hasFavorite(Boolean isFavorite) {
        return (root, query, criteriaBuilder) -> {
            if (isFavorite == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(root.get("isFavorite"), isFavorite);
        };
    }
}
