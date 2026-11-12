package com.badminton.backend.dto.response;

import java.util.UUID;

public class PracticeSessionProgressResponse {
    private UUID sessionId;
    private String status;
    private Integer plannedRepetitions;
    private Integer completedRepetitions;
    private SessionSequenceStepResponse currentStep;
    private SessionSequenceStepResponse nextStep;
    private Integer recoveryTimeSeconds;
    private Boolean sessionComplete;

    public UUID getSessionId() { return sessionId; }
    public void setSessionId(UUID sessionId) { this.sessionId = sessionId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getPlannedRepetitions() { return plannedRepetitions; }
    public void setPlannedRepetitions(Integer plannedRepetitions) { this.plannedRepetitions = plannedRepetitions; }

    public Integer getCompletedRepetitions() { return completedRepetitions; }
    public void setCompletedRepetitions(Integer completedRepetitions) { this.completedRepetitions = completedRepetitions; }

    public SessionSequenceStepResponse getCurrentStep() { return currentStep; }
    public void setCurrentStep(SessionSequenceStepResponse currentStep) { this.currentStep = currentStep; }

    public SessionSequenceStepResponse getNextStep() { return nextStep; }
    public void setNextStep(SessionSequenceStepResponse nextStep) { this.nextStep = nextStep; }

    public Integer getRecoveryTimeSeconds() { return recoveryTimeSeconds; }
    public void setRecoveryTimeSeconds(Integer recoveryTimeSeconds) { this.recoveryTimeSeconds = recoveryTimeSeconds; }

    public Boolean getSessionComplete() { return sessionComplete; }
    public void setSessionComplete(Boolean sessionComplete) { this.sessionComplete = sessionComplete; }
}
