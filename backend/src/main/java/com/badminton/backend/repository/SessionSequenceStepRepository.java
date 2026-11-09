package com.badminton.backend.repository;

import java.util.UUID;
import com.badminton.backend.entity.SessionSequenceStep;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionSequenceStepRepository extends JpaRepository<SessionSequenceStep, UUID> {
}
