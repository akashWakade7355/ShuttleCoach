package com.badminton.backend.repository;

import com.badminton.backend.entity.SessionSequenceStep;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SessionSequenceStepRepository extends JpaRepository<SessionSequenceStep, UUID> {
    List<SessionSequenceStep> findBySessionIdOrderBySequenceNumberAsc(UUID sessionId);

    Optional<SessionSequenceStep> findByIdAndSessionId(UUID id, UUID sessionId);

    Optional<SessionSequenceStep> findFirstBySessionIdAndCompletedFalseOrderBySequenceNumberAsc(
            UUID sessionId
    );
}
