package com.backend.appliboard.features.weekly_review;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewNote {

    @Column(length = 500)
    private String content;

    @Enumerated(EnumType.STRING)
    private ReviewNoteType type;
}
