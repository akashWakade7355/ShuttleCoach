package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "session_sequence_steps", schema = "public")
public class SessionSequenceStep {
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;
    @Column(name = "session_id", nullable = false)
    private UUID sessionId;
    @Column(name = "sequence_number", nullable = false)
    private Integer sequenceNumber;
    @Column(name = "completed", nullable = false)
    private Boolean completed;
    @Column(name = "returned_to_center", nullable = false)
    private Boolean returnedToCenter;
    @Column(name = "completed_at", nullable = true)
    private OffsetDateTime completedAt;
    @Column(name = "player_position_id", nullable = true)
    private Short playerPositionId;
    @Column(name = "opponent_position_id", nullable = true)
    private Short opponentPositionId;
    @Column(name = "shot_type_id", nullable = true)
    private Short shotTypeId;
    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", insertable = false, updatable = false)
    private PracticeSession practiceSession;
    @ManyToOne(optional = true)
    @JoinColumn(name = "player_position_id", insertable = false, updatable = false)
    private CourtPosition playerPosition;
    @ManyToOne(optional = true)
    @JoinColumn(name = "opponent_position_id", insertable = false, updatable = false)
    private CourtPosition opponentPosition;
    @ManyToOne(optional = true)
    @JoinColumn(name = "shot_type_id", insertable = false, updatable = false)
    private ShotType shotType;

    public SessionSequenceStep() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getSessionId() { return sessionId; }
    public void setSessionId(UUID sessionId) { this.sessionId = sessionId; }

    public Integer getSequenceNumber() { return sequenceNumber; }
    public void setSequenceNumber(Integer sequenceNumber) { this.sequenceNumber = sequenceNumber; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public Boolean getReturnedToCenter() { return returnedToCenter; }
    public void setReturnedToCenter(Boolean returnedToCenter) { this.returnedToCenter = returnedToCenter; }

    public OffsetDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }

    public Short getPlayerPositionId() { return playerPositionId; }
    public void setPlayerPositionId(Short playerPositionId) { this.playerPositionId = playerPositionId; }

    public Short getOpponentPositionId() { return opponentPositionId; }
    public void setOpponentPositionId(Short opponentPositionId) { this.opponentPositionId = opponentPositionId; }

    public Short getShotTypeId() { return shotTypeId; }
    public void setShotTypeId(Short shotTypeId) { this.shotTypeId = shotTypeId; }

    public PracticeSession getPracticeSession() { return practiceSession; }
    public void setPracticeSession(PracticeSession practiceSession) { this.practiceSession = practiceSession; }

    public CourtPosition getPlayerPosition() { return playerPosition; }
    public void setPlayerPosition(CourtPosition playerPosition) { this.playerPosition = playerPosition; }

    public CourtPosition getOpponentPosition() { return opponentPosition; }
    public void setOpponentPosition(CourtPosition opponentPosition) { this.opponentPosition = opponentPosition; }

    public ShotType getShotType() { return shotType; }
    public void setShotType(ShotType shotType) { this.shotType = shotType; }
}
