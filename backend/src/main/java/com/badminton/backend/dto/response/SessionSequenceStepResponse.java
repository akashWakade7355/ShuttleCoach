package com.badminton.backend.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public class SessionSequenceStepResponse {
    private UUID id;
    private Integer sequenceNumber;
    private Short playerPositionId;
    private Short opponentPositionId;
    private Short shotTypeId;
    private Boolean completed;
    private Boolean returnedToCenter;
    private OffsetDateTime completedAt;

    public SessionSequenceStepResponse() {
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Integer getSequenceNumber() { return sequenceNumber; }
    public void setSequenceNumber(Integer sequenceNumber) { this.sequenceNumber = sequenceNumber; }

    public Short getPlayerPositionId() { return playerPositionId; }
    public void setPlayerPositionId(Short playerPositionId) { this.playerPositionId = playerPositionId; }

    public Short getOpponentPositionId() { return opponentPositionId; }
    public void setOpponentPositionId(Short opponentPositionId) { this.opponentPositionId = opponentPositionId; }

    public Short getShotTypeId() { return shotTypeId; }
    public void setShotTypeId(Short shotTypeId) { this.shotTypeId = shotTypeId; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public Boolean getReturnedToCenter() { return returnedToCenter; }
    public void setReturnedToCenter(Boolean returnedToCenter) { this.returnedToCenter = returnedToCenter; }

    public OffsetDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }
}
