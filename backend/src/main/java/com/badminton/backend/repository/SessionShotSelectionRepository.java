package com.badminton.backend.repository;

import com.badminton.backend.entity.SessionShotSelection;
import com.badminton.backend.entity.SessionShotSelectionId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SessionShotSelectionRepository extends JpaRepository<SessionShotSelection, SessionShotSelectionId> {
    List<SessionShotSelection> findById_SessionId(UUID sessionId);

    List<SessionShotSelection> findById_SessionIdAndId_ShotTypeId(
            UUID sessionId,
            Short shotTypeId
    );
}
