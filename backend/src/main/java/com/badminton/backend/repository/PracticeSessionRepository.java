package com.badminton.backend.repository;

import java.util.UUID;
import com.badminton.backend.entity.PracticeSession;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface PracticeSessionRepository extends JpaRepository<PracticeSession, UUID> {
    Optional<PracticeSession> findByIdAndUserId(UUID id, UUID userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select ps from PracticeSession ps where ps.id = :id and ps.userId = :userId")
    Optional<PracticeSession> findByIdAndUserIdForUpdate(
            @Param("id") UUID id,
            @Param("userId") UUID userId
    );

    Page<PracticeSession> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    long countByUserId(UUID userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select ps from PracticeSession ps where ps.id = :id")
    Optional<PracticeSession> findByIdForUpdate(@Param("id") UUID id);
}
