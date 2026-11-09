package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "session_position_selections", schema = "public")
public class SessionPositionSelection {
    @EmbeddedId
    private SessionPositionSelectionId id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", insertable = false, updatable = false)
    private PracticeSession practiceSession;
    @ManyToOne(optional = false)
    @JoinColumn(name = "position_id", insertable = false, updatable = false)
    private CourtPosition courtPosition;

    public SessionPositionSelection() {}

    public SessionPositionSelectionId getId() { return id; }
    public void setId(SessionPositionSelectionId id) { this.id = id; }

    public PracticeSession getPracticeSession() { return practiceSession; }
    public void setPracticeSession(PracticeSession practiceSession) { this.practiceSession = practiceSession; }

    public CourtPosition getCourtPosition() { return courtPosition; }
    public void setCourtPosition(CourtPosition courtPosition) { this.courtPosition = courtPosition; }
}
