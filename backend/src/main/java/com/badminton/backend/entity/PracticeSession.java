package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "practice_sessions", schema = "public")
public class PracticeSession {
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    @Column(name = "status", nullable = false, length = 20)
    private String status;
    @Column(name = "recovery_time_seconds", nullable = false)
    private Integer recoveryTimeSeconds;
    @Column(name = "planned_repetitions", nullable = true)
    private Integer plannedRepetitions;
    @Column(name = "completed_repetitions", nullable = false)
    private Integer completedRepetitions;
    @Column(name = "actual_duration_seconds", nullable = true)
    private Integer actualDurationSeconds;
    @Column(name = "started_at", nullable = true)
    private OffsetDateTime startedAt;
    @Column(name = "completed_at", nullable = true)
    private OffsetDateTime completedAt;
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private Profile profile;

    public PracticeSession() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRecoveryTimeSeconds() { return recoveryTimeSeconds; }
    public void setRecoveryTimeSeconds(Integer recoveryTimeSeconds) { this.recoveryTimeSeconds = recoveryTimeSeconds; }

    public Integer getPlannedRepetitions() { return plannedRepetitions; }
    public void setPlannedRepetitions(Integer plannedRepetitions) { this.plannedRepetitions = plannedRepetitions; }

    public Integer getCompletedRepetitions() { return completedRepetitions; }
    public void setCompletedRepetitions(Integer completedRepetitions) { this.completedRepetitions = completedRepetitions; }

    public Integer getActualDurationSeconds() { return actualDurationSeconds; }
    public void setActualDurationSeconds(Integer actualDurationSeconds) { this.actualDurationSeconds = actualDurationSeconds; }

    public OffsetDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(OffsetDateTime startedAt) { this.startedAt = startedAt; }

    public OffsetDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }
}
