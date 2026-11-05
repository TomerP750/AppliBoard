package com.backend.appliboard.features.cv_helper;

import com.backend.appliboard.features.cv_helper.dto.CvAdjustRequest;
import com.backend.appliboard.shared.exceptions.InvalidInputException;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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
        String originalText = extractCvText(request.cvPdf());
        validateCvText(originalText);

        String layoutInstructions = getLayoutInstructions(request.cvLayout());
        String userMessage = buildAdjustmentMessage(
                layoutInstructions, request.jobListingDescription(), originalText
        );

        return generateAdjustedCv(userMessage);
    }

    private String extractCvText(MultipartFile cvPdf) {
        PagePdfDocumentReader reader =
                new PagePdfDocumentReader(cvPdf.getResource());

        List<Document> documents = reader.get();

        return documents.stream()
                .map(Document::getText)
                .filter(Objects::nonNull)
                .collect(Collectors.joining("\n\n"));
    }

    private void validateCvText(String originalText) throws InvalidInputException {
        if (originalText.isBlank()) {
            throw new InvalidInputException(
                    "No readable text was found. Upload a text-based CV PDF."
            );
        }

        if (originalText.length() > 40_000) {
            throw new InvalidInputException("The CV contains too much text");
        }
    }

    private String getLayoutInstructions(CvLayout requestedLayout) {
        CvLayout layout = requestedLayout == null
                ? CvLayout.SINGLE_COLUMN
                : requestedLayout;

        return switch (layout) {
            case SINGLE_COLUMN ->
                    """
                    Organize the CV for a single-column layout.
                    Use clear headings and concise bullet points.
                    """;

            case SPLIT_COLUMN ->
                    """
                    Organize the CV content for a two-column layout.
                    Identify sidebar content such as contact details and skills,
                    and main content such as summary, experience, and education.
                    """;
        };
    }

    private String buildAdjustmentMessage(
            String layoutInstructions, String jobDescription, String originalText
    ) {
        return """
        Tailor the original CV to the job description below.

        Requested layout:
        %s

        Job description:
        <job_description>
        %s
        </job_description>

        Original CV:
        <original_cv>
        %s
        </original_cv>
        """.formatted(
                layoutInstructions,
                jobDescription,
                originalText
        );
    }

    private String generateAdjustedCv(String userMessage) {
        String adjustedCv = chatClient.prompt()
                .system(CV_ADJUST_PROMPT)
                .user(userMessage)
                .call()
                .content();

        if (adjustedCv == null || adjustedCv.isBlank()) {
            throw new IllegalStateException(
                    "The AI returned an empty CV adjustment"
            );
        }

        return adjustedCv;
    }
}
