package com.badminton.backend.repository;

import com.badminton.backend.entity.SessionShotSelection;
import com.badminton.backend.entity.SessionShotSelectionId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionShotSelectionRepository extends JpaRepository<SessionShotSelection, SessionShotSelectionId> {
}
