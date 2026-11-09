package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "position_pair_shot_rules", schema = "public")
public class PositionPairShotRule {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "player_position_id", nullable = false)
    private Short playerPositionId;
    @Column(name = "opponent_position_id", nullable = false)
    private Short opponentPositionId;
    @Column(name = "shot_type_id", nullable = false)
    private Short shotTypeId;
    @ManyToOne(optional = false)
    @JoinColumn(name = "player_position_id", insertable = false, updatable = false)
    private CourtPosition playerPosition;
    @ManyToOne(optional = false)
    @JoinColumn(name = "opponent_position_id", insertable = false, updatable = false)
    private CourtPosition opponentPosition;
    @ManyToOne(optional = false)
    @JoinColumn(name = "shot_type_id", insertable = false, updatable = false)
    private ShotType shotType;

    public PositionPairShotRule() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Short getPlayerPositionId() { return playerPositionId; }
    public void setPlayerPositionId(Short playerPositionId) { this.playerPositionId = playerPositionId; }

    public Short getOpponentPositionId() { return opponentPositionId; }
    public void setOpponentPositionId(Short opponentPositionId) { this.opponentPositionId = opponentPositionId; }

    public Short getShotTypeId() { return shotTypeId; }
    public void setShotTypeId(Short shotTypeId) { this.shotTypeId = shotTypeId; }

    public CourtPosition getPlayerPosition() { return playerPosition; }
    public void setPlayerPosition(CourtPosition playerPosition) { this.playerPosition = playerPosition; }

    public CourtPosition getOpponentPosition() { return opponentPosition; }
    public void setOpponentPosition(CourtPosition opponentPosition) { this.opponentPosition = opponentPosition; }

    public ShotType getShotType() { return shotType; }
    public void setShotType(ShotType shotType) { this.shotType = shotType; }
}
