package com.backend.appliboard.features.weekly_review;

import com.backend.appliboard.features.weekly_review.dto.WeeklyReviewDto;
import com.backend.appliboard.features.weekly_review.dto.WeeklyReviewStatusDto;
import com.backend.appliboard.infrastructures.security.PrincipalUser;
import com.backend.appliboard.shared.exceptions.FoundException;
import com.backend.appliboard.shared.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weekly-review")
@RequiredArgsConstructor
public class WeeklyReviewController {

    private static final int MAX_PAGE_SIZE = 50;

    private final WeeklyReviewService weeklyReviewService;

    @GetMapping("/current")
    public WeeklyReviewStatusDto getCurrentReview(@AuthenticationPrincipal PrincipalUser user) {
        return weeklyReviewService.getCurrentReview(user.getUserId());
    }

    @PostMapping("/generate")
    public WeeklyReviewDto generateReview(@AuthenticationPrincipal PrincipalUser user)
            throws FoundException, NotFoundException {
        return weeklyReviewService.generateReview(user.getUserId());
    }

    @GetMapping("/history")
    public Page<WeeklyReviewDto> getHistory(@AuthenticationPrincipal PrincipalUser user,
                                            @RequestParam(name = "page", defaultValue = "0") int page,
                                            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), MAX_PAGE_SIZE));
        return weeklyReviewService.getHistory(user.getUserId(), pageable);
    }
}
