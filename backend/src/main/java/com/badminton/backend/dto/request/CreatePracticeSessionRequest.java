package com.badminton.backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;

public class CreatePracticeSessionRequest {
    @NotEmpty
    private List<@NotNull Short> playerPositionIds;

    @NotEmpty
    private List<@NotNull Short> opponentPositionIds;

    @NotEmpty
    private List<@NotNull Short> shotTypeIds;

    @NotNull
    @Positive
    private Integer plannedRepetitions;

    @NotNull
    @PositiveOrZero
    private Integer recoveryTimeSeconds;

    public CreatePracticeSessionRequest() {
    }

    public List<@NotNull Short> getPlayerPositionIds() {
        return playerPositionIds;
    }

    public void setPlayerPositionIds(List<@NotNull Short> playerPositionIds) {
        this.playerPositionIds = playerPositionIds;
    }

    public List<@NotNull Short> getOpponentPositionIds() {
        return opponentPositionIds;
    }

    public void setOpponentPositionIds(List<@NotNull Short> opponentPositionIds) {
        this.opponentPositionIds = opponentPositionIds;
    }

    public List<@NotNull Short> getShotTypeIds() {
        return shotTypeIds;
    }

    public void setShotTypeIds(List<@NotNull Short> shotTypeIds) {
        this.shotTypeIds = shotTypeIds;
    }

    public Integer getPlannedRepetitions() {
        return plannedRepetitions;
    }

    public void setPlannedRepetitions(Integer plannedRepetitions) {
        this.plannedRepetitions = plannedRepetitions;
    }

    public Integer getRecoveryTimeSeconds() {
        return recoveryTimeSeconds;
    }

    public void setRecoveryTimeSeconds(Integer recoveryTimeSeconds) {
        this.recoveryTimeSeconds = recoveryTimeSeconds;
    }
}
