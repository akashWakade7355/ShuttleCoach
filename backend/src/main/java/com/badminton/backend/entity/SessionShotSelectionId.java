package com.badminton.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class SessionShotSelectionId implements Serializable {
    @Column(name = "session_id", nullable = false)
    private UUID sessionId;
    @Column(name = "shot_type_id", nullable = false)
    private Short shotTypeId;

    public SessionShotSelectionId() {}

    public SessionShotSelectionId(UUID sessionId, Short shotTypeId) {
        this.sessionId = sessionId;
        this.shotTypeId = shotTypeId;
    }

    public UUID getSessionId() { return sessionId; }
    public void setSessionId(UUID sessionId) { this.sessionId = sessionId; }

    public Short getShotTypeId() { return shotTypeId; }
    public void setShotTypeId(Short shotTypeId) { this.shotTypeId = shotTypeId; }

    @Override public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof SessionShotSelectionId that)) return false; return Objects.equals(sessionId, that.sessionId) && Objects.equals(shotTypeId, that.shotTypeId); }
    @Override public int hashCode() { return Objects.hash(sessionId, shotTypeId); }
}
