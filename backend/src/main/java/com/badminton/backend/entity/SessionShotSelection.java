package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "session_shot_selections", schema = "public")
public class SessionShotSelection {
    @EmbeddedId
    private SessionShotSelectionId id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", insertable = false, updatable = false)
    private PracticeSession practiceSession;
    @ManyToOne(optional = false)
    @JoinColumn(name = "shot_type_id", insertable = false, updatable = false)
    private ShotType shotType;

    public SessionShotSelection() {}

    public SessionShotSelectionId getId() { return id; }
    public void setId(SessionShotSelectionId id) { this.id = id; }

    public PracticeSession getPracticeSession() { return practiceSession; }
    public void setPracticeSession(PracticeSession practiceSession) { this.practiceSession = practiceSession; }

    public ShotType getShotType() { return shotType; }
    public void setShotType(ShotType shotType) { this.shotType = shotType; }
}
