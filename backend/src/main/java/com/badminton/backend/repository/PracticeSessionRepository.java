package com.badminton.backend.repository;

import java.util.UUID;
import com.badminton.backend.entity.PracticeSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PracticeSessionRepository extends JpaRepository<PracticeSession, UUID> {
}
