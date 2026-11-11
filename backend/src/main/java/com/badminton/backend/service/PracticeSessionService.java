package com.badminton.backend.service;

import com.badminton.backend.entity.PracticeSession;
import java.util.Optional;
import java.util.UUID;

public interface PracticeSessionService {
    Optional<PracticeSession> getPracticeSessionById(UUID id);

    PracticeSession createPracticeSession(
            UUID userId,
            Integer plannedRepetitions,
            Integer recoveryTimeSeconds
    );

    PracticeSession startPracticeSession(UUID id);

    PracticeSession pauseSession(UUID sessionId);

    PracticeSession resumeSession(UUID sessionId);

    PracticeSession completeSession(UUID sessionId);
}
