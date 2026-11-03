package com.backend.appliboard.features.my_cv_helper;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cv-helper")
public class CvHelperController {

    private final CvHelperService cvHelperService;
}
