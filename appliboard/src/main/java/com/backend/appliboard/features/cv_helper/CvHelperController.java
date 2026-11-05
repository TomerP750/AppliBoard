package com.backend.appliboard.features.cv_helper;

import com.backend.appliboard.features.cv_helper.dto.CvAdjustRequest;
import com.backend.appliboard.shared.exceptions.InvalidInputException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cv-helper")
public class CvHelperController {

    private final CvHelperService cvHelperService;


    @PostMapping(
            value = "/adjust",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.TEXT_PLAIN_VALUE
    )
    public String adjustCv(
            @Valid @ModelAttribute CvAdjustRequest request
    ) throws InvalidInputException {
        return cvHelperService.adjustCv(request);
    }
}
