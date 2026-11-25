package com.backend.appliboard;

import com.backend.appliboard.features.job_application.JobApplication;
import com.backend.appliboard.features.job_application.JobApplicationSpecifications;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JobApplicationSpecificationsTest {

    @Mock
    private Root<JobApplication> root;

    @Mock
    private CriteriaQuery<?> query;

    @Mock
    private CriteriaBuilder criteriaBuilder;

    @Mock
    private Path<String> namePath;

    @Mock
    private Expression<String> lowerName;

    @BeforeEach
    public void setUp() {
        when(root.<String>get("name")).thenReturn(namePath);
        when(criteriaBuilder.lower(namePath)).thenReturn(lowerName);
    }

    @ParameterizedTest(name = "\"{0}\" -> {1}")
    @CsvSource(delimiter = '|', value = {
            "Google    | %google%",
            "100%      | %100!%%",
            "a_b       | %a!_b%",
            "wow!      | %wow!!%"
    })
    public void nameContains_ShouldEscapeLikeWildcards_SoTheyMatchLiterally(String search, String expectedPattern) {
        JobApplicationSpecifications.nameContains(search).toPredicate(root, query, criteriaBuilder);

        verify(criteriaBuilder).like(lowerName, expectedPattern, '!');
    }
}
