package com.badminton.backend.dto.response;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class PracticeSessionDetailResponse {
    private UUID id;
    private String status;
    private Integer plannedRepetitions;
    private Integer completedRepetitions;
    private Integer recoveryTimeSeconds;
    private Integer actualDurationSeconds;
    private Integer totalPausedSeconds;
    private OffsetDateTime createdAt;
    private OffsetDateTime startedAt;
    private OffsetDateTime pausedAt;
    private OffsetDateTime completedAt;
    private List<Short> playerPositionIds;
    private List<Short> opponentPositionIds;
    private List<Short> shotTypeIds;
    private List<SessionSequenceStepResponse> sequenceSteps;

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

    public Integer getTotalPausedSeconds() { return totalPausedSeconds; }
    public void setTotalPausedSeconds(Integer totalPausedSeconds) { this.totalPausedSeconds = totalPausedSeconds; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(OffsetDateTime startedAt) { this.startedAt = startedAt; }

    public OffsetDateTime getPausedAt() { return pausedAt; }
    public void setPausedAt(OffsetDateTime pausedAt) { this.pausedAt = pausedAt; }

    public OffsetDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }

    public List<Short> getPlayerPositionIds() { return playerPositionIds; }
    public void setPlayerPositionIds(List<Short> playerPositionIds) { this.playerPositionIds = playerPositionIds; }

    public List<Short> getOpponentPositionIds() { return opponentPositionIds; }
    public void setOpponentPositionIds(List<Short> opponentPositionIds) { this.opponentPositionIds = opponentPositionIds; }

    public List<Short> getShotTypeIds() { return shotTypeIds; }
    public void setShotTypeIds(List<Short> shotTypeIds) { this.shotTypeIds = shotTypeIds; }

    public List<SessionSequenceStepResponse> getSequenceSteps() { return sequenceSteps; }
    public void setSequenceSteps(List<SessionSequenceStepResponse> sequenceSteps) { this.sequenceSteps = sequenceSteps; }
}
