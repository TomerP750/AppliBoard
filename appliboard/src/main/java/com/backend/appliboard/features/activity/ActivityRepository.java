package com.backend.appliboard.features.activity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    Page<Activity> findByUserId(UUID userId, Pageable pageable);
}
