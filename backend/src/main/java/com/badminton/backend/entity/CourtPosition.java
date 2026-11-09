package com.badminton.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "court_positions", schema = "public")
public class CourtPosition {
    @Id
    @Column(name = "id", nullable = false)
    private Short id;
    @Column(name = "position_code", nullable = false, length = 30)
    private String positionCode;
    @Column(name = "position_name", nullable = false, length = 50)
    private String positionName;
    @Column(name = "display_order", nullable = false)
    private Short displayOrder;

    public CourtPosition() {}

    public Short getId() { return id; }
    public void setId(Short id) { this.id = id; }

    public String getPositionCode() { return positionCode; }
    public void setPositionCode(String positionCode) { this.positionCode = positionCode; }

    public String getPositionName() { return positionName; }
    public void setPositionName(String positionName) { this.positionName = positionName; }

    public Short getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Short displayOrder) { this.displayOrder = displayOrder; }
}
