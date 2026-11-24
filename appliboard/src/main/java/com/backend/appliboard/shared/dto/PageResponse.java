package com.backend.appliboard.shared.dto;

import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;

/**
 * A page of results that can be cached as JSON and read back ({@link Page} can't be deserialized).
 * Its JSON matches what {@code PageSerializationMode.VIA_DTO} returns, so API clients see no difference.
 */
public record PageResponse<T>(List<T> content, PageMetadata page) {

    public record PageMetadata(int size, int number, long totalElements, int totalPages) {
    }

    public static <T> PageResponse<T> from(Page<T> page) {
        PageMetadata metadata = new PageMetadata(
                page.getSize(),
                page.getNumber(),
                page.getTotalElements(),
                page.getTotalPages()
        );

        // A mutable ArrayList: JSON type info can't recreate the JDK's immutable lists.
        return new PageResponse<>(new ArrayList<>(page.getContent()), metadata);
    }
}
