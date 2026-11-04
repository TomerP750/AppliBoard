package com.backend.appliboard.features.my_cv_helper;

import com.backend.appliboard.features.my_cv_helper.dto.CreateNewCvRequest;
import com.backend.appliboard.features.my_cv_helper.dto.CvAdjustRequest;
import com.backend.appliboard.shared.exceptions.InvalidInputException;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class CvHelperService {

    private final ChatClient chatClient;

    private static final String CV_ADJUST_PROMPT = loadAdjustPrompt();

    private static String loadAdjustPrompt() {
        try {
            return new ClassPathResource("prompts/adjustCvPrompt.txt")
                    .getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException exception) {
            throw new UncheckedIOException("Failed to load the CV adjustment prompt", exception);
        }
    }


    public String adjustCv(CvAdjustRequest request) throws InvalidInputException {

        return "";

    }

//    public void createNewCv(CreateNewCvRequest request) {
//
//    }




}
