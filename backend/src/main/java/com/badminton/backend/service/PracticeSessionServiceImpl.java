package com.badminton.backend.service;

import com.badminton.backend.entity.PracticeSession;
import com.badminton.backend.repository.PracticeSessionRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PracticeSessionServiceImpl implements PracticeSessionService {
    private final PracticeSessionRepository practiceSessionRepository;

    public PracticeSessionServiceImpl(PracticeSessionRepository practiceSessionRepository) {
        this.practiceSessionRepository = practiceSessionRepository;
    }

    @Override
    public Optional<PracticeSession> getPracticeSessionById(UUID id) {
        return practiceSessionRepository.findById(id);
    }

    @Override
    public PracticeSession createPracticeSession(
            UUID userId,
            Integer plannedRepetitions,
            Integer recoveryTimeSeconds
    ) {
        if (userId == null) {
            throw new IllegalArgumentException("userId must not be null");
        }
        if (plannedRepetitions == null || plannedRepetitions <= 0) {
            throw new IllegalArgumentException("plannedRepetitions must be greater than zero");
        }
        if (recoveryTimeSeconds == null || recoveryTimeSeconds < 0) {
            throw new IllegalArgumentException("recoveryTimeSeconds must be zero or greater");
        }

        PracticeSession practiceSession = new PracticeSession();
        practiceSession.setId(UUID.randomUUID());
        practiceSession.setUserId(userId);
        practiceSession.setStatus("CREATED");
        practiceSession.setRecoveryTimeSeconds(recoveryTimeSeconds);
        practiceSession.setPlannedRepetitions(plannedRepetitions);
        practiceSession.setCompletedRepetitions(0);
        practiceSession.setCreatedAt(OffsetDateTime.now());

        return practiceSessionRepository.save(practiceSession);
    }

    @Override
    @Transactional
    public PracticeSession startPracticeSession(UUID id) {
        PracticeSession practiceSession = getLockedSession(id);

        if (!"CREATED".equals(practiceSession.getStatus())) {
            throw new IllegalStateException(
                    "Only CREATED practice sessions can be started; current status is "
                            + practiceSession.getStatus()
            );
        }

        practiceSession.setStatus("IN_PROGRESS");
        practiceSession.setStartedAt(OffsetDateTime.now());
        return practiceSessionRepository.save(practiceSession);
    }

    @Override
    @Transactional
    public PracticeSession pauseSession(UUID sessionId) {
        PracticeSession practiceSession = getLockedSession(sessionId);
        requireStatus(practiceSession, "IN_PROGRESS");

        practiceSession.setStatus("PAUSED");
        practiceSession.setPausedAt(OffsetDateTime.now());
        return practiceSessionRepository.save(practiceSession);
    }

    @Override
    @Transactional
    public PracticeSession resumeSession(UUID sessionId) {
        PracticeSession practiceSession = getLockedSession(sessionId);
        requireStatus(practiceSession, "PAUSED");

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime pausedAt = practiceSession.getPausedAt();
        if (pausedAt == null) {
            throw new IllegalStateException("Paused session has no pausedAt timestamp");
        }

        addPausedSeconds(practiceSession, pausedAt, now);
        practiceSession.setPausedAt(null);
        practiceSession.setStatus("IN_PROGRESS");
        return practiceSessionRepository.save(practiceSession);
    }

    @Override
    @Transactional
    public PracticeSession completeSession(UUID sessionId) {
        PracticeSession practiceSession = getLockedSession(sessionId);
        String status = practiceSession.getStatus();
        if (!"IN_PROGRESS".equals(status) && !"PAUSED".equals(status)) {
            throw new IllegalStateException(
                    "Only IN_PROGRESS or PAUSED practice sessions can be completed; current status is " + status
            );
        }

        OffsetDateTime completedAt = OffsetDateTime.now();
        if ("PAUSED".equals(status)) {
            OffsetDateTime pausedAt = practiceSession.getPausedAt();
            if (pausedAt == null) {
                throw new IllegalStateException("Paused session has no pausedAt timestamp");
            }
            addPausedSeconds(practiceSession, pausedAt, completedAt);
            practiceSession.setPausedAt(null);
        }

        OffsetDateTime startedAt = practiceSession.getStartedAt();
        if (startedAt == null) {
            throw new IllegalStateException("Practice session has no startedAt timestamp");
        }

        long elapsedSeconds = Math.max(0L, Duration.between(startedAt, completedAt).getSeconds());
        int pausedSeconds = practiceSession.getTotalPausedSeconds() == null
                ? 0
                : practiceSession.getTotalPausedSeconds();
        long activeSeconds = Math.max(0L, elapsedSeconds - pausedSeconds);

        practiceSession.setCompletedAt(completedAt);
        practiceSession.setActualDurationSeconds(Math.toIntExact(activeSeconds));
        practiceSession.setStatus("COMPLETED");
        return practiceSessionRepository.save(practiceSession);
    }

    private PracticeSession getLockedSession(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("sessionId must not be null");
        }
        return practiceSessionRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Practice session not found: " + id));
    }

    private void requireStatus(PracticeSession practiceSession, String expectedStatus) {
        if (!expectedStatus.equals(practiceSession.getStatus())) {
            throw new IllegalStateException(
                    "Expected practice session status " + expectedStatus
                            + " but was " + practiceSession.getStatus()
            );
        }
    }

    private void addPausedSeconds(PracticeSession practiceSession, OffsetDateTime pausedAt, OffsetDateTime endedAt) {
        long elapsedSeconds = Math.max(0L, Duration.between(pausedAt, endedAt).getSeconds());
        int currentTotal = practiceSession.getTotalPausedSeconds() == null
                ? 0
                : practiceSession.getTotalPausedSeconds();
        practiceSession.setTotalPausedSeconds(Math.toIntExact(Math.addExact(currentTotal, elapsedSeconds)));
    }
}
