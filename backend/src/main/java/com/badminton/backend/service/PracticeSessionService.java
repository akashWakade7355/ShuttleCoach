package com.badminton.backend.service;

import com.badminton.backend.dto.request.CreatePracticeSessionRequest;
import com.badminton.backend.dto.response.PracticeSessionCreatedResponse;
import com.badminton.backend.entity.PracticeSession;
import java.util.Optional;
import java.util.UUID;

public interface PracticeSessionService {
    Optional<PracticeSession> getPracticeSessionById(UUID id);

    PracticeSessionCreatedResponse createPracticeSession(
            UUID userId,
            CreatePracticeSessionRequest request
    );

    PracticeSession startPracticeSession(UUID id);

    PracticeSession pauseSession(UUID sessionId);

    PracticeSession resumeSession(UUID sessionId);

    PracticeSession completeSession(UUID sessionId);
}
