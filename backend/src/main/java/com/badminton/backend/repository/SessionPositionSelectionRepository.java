package com.badminton.backend.repository;

import com.badminton.backend.entity.SessionPositionSelection;
import com.badminton.backend.entity.SessionPositionSelectionId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionPositionSelectionRepository extends JpaRepository<SessionPositionSelection, SessionPositionSelectionId> {
}
