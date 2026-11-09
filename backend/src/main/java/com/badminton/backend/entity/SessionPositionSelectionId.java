package com.badminton.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class SessionPositionSelectionId implements Serializable {
    @Column(name = "session_id", nullable = false)
    private UUID sessionId;
    @Column(name = "court_side", nullable = false, length = 10)
    private String courtSide;
    @Column(name = "position_id", nullable = false)
    private Short positionId;

    public SessionPositionSelectionId() {}

    public SessionPositionSelectionId(UUID sessionId, String courtSide, Short positionId) {
        this.sessionId = sessionId;
        this.courtSide = courtSide;
        this.positionId = positionId;
    }

    public UUID getSessionId() { return sessionId; }
    public void setSessionId(UUID sessionId) { this.sessionId = sessionId; }

    public String getCourtSide() { return courtSide; }
    public void setCourtSide(String courtSide) { this.courtSide = courtSide; }

    public Short getPositionId() { return positionId; }
    public void setPositionId(Short positionId) { this.positionId = positionId; }

    @Override public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof SessionPositionSelectionId that)) return false; return Objects.equals(sessionId, that.sessionId) && Objects.equals(courtSide, that.courtSide) && Objects.equals(positionId, that.positionId); }
    @Override public int hashCode() { return Objects.hash(sessionId, courtSide, positionId); }
}
