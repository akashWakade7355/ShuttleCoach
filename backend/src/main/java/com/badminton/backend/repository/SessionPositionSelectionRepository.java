package com.badminton.backend.repository;

import com.badminton.backend.entity.SessionPositionSelection;
import com.badminton.backend.entity.SessionPositionSelectionId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SessionPositionSelectionRepository extends JpaRepository<SessionPositionSelection, SessionPositionSelectionId> {
    List<SessionPositionSelection> findById_SessionId(UUID sessionId);

    List<SessionPositionSelection> findById_SessionIdAndId_CourtSide(
            UUID sessionId,
            String courtSide
    );
}
