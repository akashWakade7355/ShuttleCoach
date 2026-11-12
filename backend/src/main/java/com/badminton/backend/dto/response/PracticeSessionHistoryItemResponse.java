package com.badminton.backend.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public class PracticeSessionHistoryItemResponse {
    private UUID id;
    private String status;
    private Integer plannedRepetitions;
    private Integer completedRepetitions;
    private Integer recoveryTimeSeconds;
    private Integer actualDurationSeconds;
    private OffsetDateTime createdAt;
    private OffsetDateTime startedAt;
    private OffsetDateTime completedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getPlannedRepetitions() { return plannedRepetitions; }
    public void setPlannedRepetitions(Integer plannedRepetitions) { this.plannedRepetitions = plannedRepetitions; }

    public Integer getCompletedRepetitions() { return completedRepetitions; }
    public void setCompletedRepetitions(Integer completedRepetitions) { this.completedRepetitions = completedRepetitions; }

    public Integer getRecoveryTimeSeconds() { return recoveryTimeSeconds; }
    public void setRecoveryTimeSeconds(Integer recoveryTimeSeconds) { this.recoveryTimeSeconds = recoveryTimeSeconds; }

    public Integer getActualDurationSeconds() { return actualDurationSeconds; }
    public void setActualDurationSeconds(Integer actualDurationSeconds) { this.actualDurationSeconds = actualDurationSeconds; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(OffsetDateTime startedAt) { this.startedAt = startedAt; }

    public OffsetDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }
}
