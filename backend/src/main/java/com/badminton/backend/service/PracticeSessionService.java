package com.badminton.backend.service;

import com.badminton.backend.dto.request.CreatePracticeSessionRequest;
import com.badminton.backend.dto.response.PracticeSessionCreatedResponse;
import com.badminton.backend.dto.response.PracticeSessionDetailResponse;
import com.badminton.backend.dto.response.PracticeSessionHistoryItemResponse;
import com.badminton.backend.dto.response.PracticeSessionProgressResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PracticeSessionService {

    PracticeSessionCreatedResponse createPracticeSession(
            UUID userId,
            CreatePracticeSessionRequest request
    );

    PracticeSessionDetailResponse getSessionDetails(
            UUID userId,
            UUID sessionId
    );

    Page<PracticeSessionHistoryItemResponse> getSessionHistory(
            UUID userId,
            Pageable pageable
    );

    PracticeSessionProgressResponse getSessionProgress(
            UUID userId,
            UUID sessionId
    );

    PracticeSessionProgressResponse completeCurrentRepetition(
            UUID userId,
            UUID sessionId
    );

    PracticeSessionDetailResponse startPracticeSession(
            UUID userId,
            UUID sessionId
    );

    PracticeSessionDetailResponse pauseSession(
            UUID userId,
            UUID sessionId
    );

    PracticeSessionDetailResponse resumeSession(
            UUID userId,
            UUID sessionId
    );

    PracticeSessionDetailResponse completeSession(
            UUID userId,
            UUID sessionId
    );

    PracticeSessionDetailResponse abandonSession(
            UUID userId,
            UUID sessionId
    );
}
