package com.badminton.backend.dto.response;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class PracticeSessionCreatedResponse {
    private UUID id;
    private String status;
    private Integer plannedRepetitions;
    private Integer completedRepetitions;
    private Integer recoveryTimeSeconds;
    private List<Short> playerPositionIds;
    private List<Short> opponentPositionIds;
    private List<Short> shotTypeIds;
    private Integer sequenceStepCount;
    private OffsetDateTime createdAt;

    public PracticeSessionCreatedResponse() {
    }

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

    public List<Short> getPlayerPositionIds() { return playerPositionIds; }
    public void setPlayerPositionIds(List<Short> playerPositionIds) { this.playerPositionIds = playerPositionIds; }

    public List<Short> getOpponentPositionIds() { return opponentPositionIds; }
    public void setOpponentPositionIds(List<Short> opponentPositionIds) { this.opponentPositionIds = opponentPositionIds; }

    public List<Short> getShotTypeIds() { return shotTypeIds; }
    public void setShotTypeIds(List<Short> shotTypeIds) { this.shotTypeIds = shotTypeIds; }

    public Integer getSequenceStepCount() { return sequenceStepCount; }
    public void setSequenceStepCount(Integer sequenceStepCount) { this.sequenceStepCount = sequenceStepCount; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
