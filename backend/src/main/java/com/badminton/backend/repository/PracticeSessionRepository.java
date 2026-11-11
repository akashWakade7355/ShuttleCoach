package com.badminton.backend.repository;

import java.util.UUID;
import com.badminton.backend.entity.PracticeSession;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PracticeSessionRepository extends JpaRepository<PracticeSession, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select ps from PracticeSession ps where ps.id = :id")
    Optional<PracticeSession> findByIdForUpdate(@Param("id") UUID id);
}
