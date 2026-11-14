package com.badminton.backend.service;

import com.badminton.backend.dto.request.CreatePracticeSessionRequest;
import com.badminton.backend.dto.response.PracticeSessionCreatedResponse;
import com.badminton.backend.entity.CourtPosition;
import com.badminton.backend.entity.PracticeSession;
import com.badminton.backend.entity.PositionPairShotRule;
import com.badminton.backend.entity.Profile;
import com.badminton.backend.entity.SessionPositionSelection;
import com.badminton.backend.entity.SessionPositionSelectionId;
import com.badminton.backend.entity.SessionSequenceStep;
import com.badminton.backend.entity.SessionShotSelection;
import com.badminton.backend.entity.SessionShotSelectionId;
import com.badminton.backend.entity.ShotType;
import com.badminton.backend.repository.CourtPositionRepository;
import com.badminton.backend.repository.PracticeSessionRepository;
import com.badminton.backend.repository.SessionPositionSelectionRepository;
import com.badminton.backend.repository.SessionSequenceStepRepository;
import com.badminton.backend.repository.SessionShotSelectionRepository;
import com.badminton.backend.repository.ShotTypeRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class PracticeSessionServiceImpl implements PracticeSessionService {
    private final PracticeSessionRepository practiceSessionRepository;
    private final CourtPositionRepository courtPositionRepository;
    private final ShotTypeRepository shotTypeRepository;
    private final SessionPositionSelectionRepository sessionPositionSelectionRepository;
    private final SessionShotSelectionRepository sessionShotSelectionRepository;
    private final SessionSequenceStepRepository sessionSequenceStepRepository;
    private final PositionPairShotRuleService positionPairShotRuleService;
    private final ProfileService profileService;

    public PracticeSessionServiceImpl(
            PracticeSessionRepository practiceSessionRepository,
            CourtPositionRepository courtPositionRepository,
            ShotTypeRepository shotTypeRepository,
            SessionPositionSelectionRepository sessionPositionSelectionRepository,
            SessionShotSelectionRepository sessionShotSelectionRepository,
            SessionSequenceStepRepository sessionSequenceStepRepository,
            PositionPairShotRuleService positionPairShotRuleService,
            ProfileService profileService
    ) {
        this.practiceSessionRepository = practiceSessionRepository;
        this.courtPositionRepository = courtPositionRepository;
        this.shotTypeRepository = shotTypeRepository;
        this.sessionPositionSelectionRepository = sessionPositionSelectionRepository;
        this.sessionShotSelectionRepository = sessionShotSelectionRepository;
        this.sessionSequenceStepRepository = sessionSequenceStepRepository;
        this.positionPairShotRuleService = positionPairShotRuleService;
        this.profileService = profileService;
    }

    @Override
    public Optional<PracticeSession> getPracticeSessionById(UUID id) {
        return practiceSessionRepository.findById(id);
    }

    @Override
    @Transactional
    public PracticeSessionCreatedResponse createPracticeSession(
            UUID userId,
            CreatePracticeSessionRequest request
    ) {
        if (userId == null) {
            throw new IllegalArgumentException("userId must not be null");
        }
        if (request == null) {
            throw new IllegalArgumentException("request must not be null");
        }

        List<Short> playerPositionIds = distinctNonEmptyIds(
                request.getPlayerPositionIds(), "playerPositionIds");
        List<Short> opponentPositionIds = distinctNonEmptyIds(
                request.getOpponentPositionIds(), "opponentPositionIds");
        List<Short> shotTypeIds = distinctNonEmptyIds(request.getShotTypeIds(), "shotTypeIds");

        Integer plannedRepetitions = request.getPlannedRepetitions();
        Integer recoveryTimeSeconds = request.getRecoveryTimeSeconds();
        if (plannedRepetitions == null || plannedRepetitions <= 0) {
            throw new IllegalArgumentException("plannedRepetitions must be greater than zero");
        }
        if (recoveryTimeSeconds == null || recoveryTimeSeconds < 0) {
            throw new IllegalArgumentException("recoveryTimeSeconds must be zero or greater");
        }
        Integer repetitionDurationSeconds = request.getRepetitionDurationSeconds();
        if (repetitionDurationSeconds == null || repetitionDurationSeconds <= 0) {
            throw new IllegalArgumentException("repetitionDurationSeconds must be greater than zero");
        }
        Integer preparationTimeSeconds = request.getPreparationTimeSeconds();
        if (preparationTimeSeconds == null || preparationTimeSeconds < 0) {
            throw new IllegalArgumentException("preparationTimeSeconds must be zero or greater");
        }

        LinkedHashSet<Short> allPositionIds = new LinkedHashSet<>(playerPositionIds);
        allPositionIds.addAll(opponentPositionIds);

        Map<Short, CourtPosition> courtPositionsById = new LinkedHashMap<>();
        for (CourtPosition courtPosition : courtPositionRepository.findAllById(allPositionIds)) {
            courtPositionsById.put(courtPosition.getId(), courtPosition);
        }
        requireAllIdsExist(playerPositionIds, courtPositionsById.keySet(), "player position");
        requireAllIdsExist(opponentPositionIds, courtPositionsById.keySet(), "opponent position");

        Map<Short, ShotType> shotTypesById = new LinkedHashMap<>();
        for (ShotType shotType : shotTypeRepository.findAllById(shotTypeIds)) {
            shotTypesById.put(shotType.getId(), shotType);
        }
        requireAllIdsExist(shotTypeIds, shotTypesById.keySet(), "shot type");

        Set<Short> selectedPlayerPositionIds = new LinkedHashSet<>(playerPositionIds);
        Set<Short> selectedOpponentPositionIds = new LinkedHashSet<>(opponentPositionIds);
        Set<Short> selectedShotTypeIds = new LinkedHashSet<>(shotTypeIds);
        Set<ValidCombination> seenCombinations = new LinkedHashSet<>();
        List<ValidCombination> validCombinations = new ArrayList<>();

        for (PositionPairShotRule rule : positionPairShotRuleService.getValidRulesForPositionPairs(
                playerPositionIds, opponentPositionIds)) {
            Short playerPositionId = rule.getPlayerPositionId();
            Short opponentPositionId = rule.getOpponentPositionId();
            Short shotTypeId = rule.getShotTypeId();

            if (selectedPlayerPositionIds.contains(playerPositionId)
                    && selectedOpponentPositionIds.contains(opponentPositionId)
                    && selectedShotTypeIds.contains(shotTypeId)) {
                ValidCombination combination = new ValidCombination(
                        playerPositionId, opponentPositionId, shotTypeId);
                if (seenCombinations.add(combination)) {
                    validCombinations.add(combination);
                }
            }
        }

        if (validCombinations.isEmpty()) {
            throw new IllegalArgumentException(
                    "No valid position-pair and shot-type combinations match the selected IDs");
        }

        Profile profile = profileService.getProfileById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Profile not found for userId: " + userId));

        Collections.shuffle(validCombinations);

        PracticeSession practiceSession = new PracticeSession();
        practiceSession.setId(UUID.randomUUID());
        practiceSession.setUserId(profile.getId());
        practiceSession.setProfile(profile);
        practiceSession.setStatus("CREATED");
        practiceSession.setRecoveryTimeSeconds(recoveryTimeSeconds);
        practiceSession.setRepetitionDurationSeconds(repetitionDurationSeconds);
        practiceSession.setPreparationTimeSeconds(preparationTimeSeconds);
        practiceSession.setPlannedRepetitions(plannedRepetitions);
        practiceSession.setCompletedRepetitions(0);
        practiceSession.setCreatedAt(OffsetDateTime.now());

        PracticeSession savedSession = practiceSessionRepository.save(practiceSession);

        List<SessionPositionSelection> positionSelections = new ArrayList<>(
                playerPositionIds.size() + opponentPositionIds.size());
        addPositionSelections(positionSelections, savedSession, playerPositionIds,
                "PLAYER", courtPositionsById);
        addPositionSelections(positionSelections, savedSession, opponentPositionIds,
                "OPPONENT", courtPositionsById);
        sessionPositionSelectionRepository.saveAll(positionSelections);

        List<SessionShotSelection> shotSelections = new ArrayList<>(shotTypeIds.size());
        for (Short shotTypeId : shotTypeIds) {
            SessionShotSelection selection = new SessionShotSelection();
            selection.setId(new SessionShotSelectionId(savedSession.getId(), shotTypeId));
            selection.setPracticeSession(savedSession);
            selection.setShotType(shotTypesById.get(shotTypeId));
            shotSelections.add(selection);
        }
        sessionShotSelectionRepository.saveAll(shotSelections);

        List<SessionSequenceStep> sequenceSteps = new ArrayList<>(plannedRepetitions);
        for (int index = 0; index < plannedRepetitions; index++) {
            ValidCombination combination = validCombinations.get(index % validCombinations.size());
            SessionSequenceStep step = new SessionSequenceStep();
            step.setId(UUID.randomUUID());
            step.setSessionId(savedSession.getId());
            step.setSequenceNumber(index + 1);
            step.setPlayerPositionId(combination.playerPositionId());
            step.setOpponentPositionId(combination.opponentPositionId());
            step.setShotTypeId(combination.shotTypeId());
            step.setCompleted(false);
            step.setReturnedToCenter(false);
            step.setCompletedAt(null);
            step.setPracticeSession(savedSession);
            step.setPlayerPosition(courtPositionsById.get(combination.playerPositionId()));
            step.setOpponentPosition(courtPositionsById.get(combination.opponentPositionId()));
            step.setShotType(shotTypesById.get(combination.shotTypeId()));
            sequenceSteps.add(step);
        }
        sessionSequenceStepRepository.saveAll(sequenceSteps);

        PracticeSessionCreatedResponse response = new PracticeSessionCreatedResponse();
        response.setId(savedSession.getId());
        response.setStatus(savedSession.getStatus());
        response.setPlannedRepetitions(savedSession.getPlannedRepetitions());
        response.setCompletedRepetitions(savedSession.getCompletedRepetitions());
        response.setRecoveryTimeSeconds(savedSession.getRecoveryTimeSeconds());
        response.setRepetitionDurationSeconds(savedSession.getRepetitionDurationSeconds());
        response.setPreparationTimeSeconds(savedSession.getPreparationTimeSeconds());
        response.setPlayerPositionIds(playerPositionIds);
        response.setOpponentPositionIds(opponentPositionIds);
        response.setShotTypeIds(shotTypeIds);
        response.setSequenceStepCount(sequenceSteps.size());
        response.setCreatedAt(savedSession.getCreatedAt());
        return response;
    }

    private List<Short> distinctNonEmptyIds(List<Short> ids, String fieldName) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " must not be null or empty");
        }

        LinkedHashSet<Short> distinctIds = new LinkedHashSet<>();
        for (Short id : ids) {
            if (id == null) {
                throw new IllegalArgumentException(fieldName + " must not contain null IDs");
            }
            distinctIds.add(id);
        }
        return new ArrayList<>(distinctIds);
    }

    private void requireAllIdsExist(List<Short> requestedIds, Set<Short> existingIds, String idType) {
        List<Short> missingIds = requestedIds.stream()
                .filter(id -> !existingIds.contains(id))
                .toList();
        if (!missingIds.isEmpty()) {
            throw new IllegalArgumentException("Unknown " + idType + " IDs: " + missingIds);
        }
    }

    private void addPositionSelections(
            List<SessionPositionSelection> selections,
            PracticeSession practiceSession,
            List<Short> positionIds,
            String courtSide,
            Map<Short, CourtPosition> courtPositionsById
    ) {
        for (Short positionId : positionIds) {
            SessionPositionSelection selection = new SessionPositionSelection();
            selection.setId(new SessionPositionSelectionId(
                    practiceSession.getId(), courtSide, positionId));
            selection.setPracticeSession(practiceSession);
            selection.setCourtPosition(courtPositionsById.get(positionId));
            selections.add(selection);
        }
    }

    private record ValidCombination(
            Short playerPositionId,
            Short opponentPositionId,
            Short shotTypeId
    ) {}

    @Override
    @Transactional
    public PracticeSession startPracticeSession(UUID id) {
        PracticeSession practiceSession = getLockedSession(id);

        if (!"CREATED".equals(practiceSession.getStatus())) {
            throw new IllegalStateException(
                    "Only CREATED practice sessions can be started; current status is "
                            + practiceSession.getStatus()
            );
        }

        practiceSession.setStatus("IN_PROGRESS");
        practiceSession.setStartedAt(OffsetDateTime.now());
        return practiceSessionRepository.save(practiceSession);
    }

    @Override
    @Transactional
    public PracticeSession pauseSession(UUID sessionId) {
        PracticeSession practiceSession = getLockedSession(sessionId);
        requireStatus(practiceSession, "IN_PROGRESS");

        practiceSession.setStatus("PAUSED");
        practiceSession.setPausedAt(OffsetDateTime.now());
        return practiceSessionRepository.save(practiceSession);
    }

    @Override
    @Transactional
    public PracticeSession resumeSession(UUID sessionId) {
        PracticeSession practiceSession = getLockedSession(sessionId);
        requireStatus(practiceSession, "PAUSED");

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime pausedAt = practiceSession.getPausedAt();
        if (pausedAt == null) {
            throw new IllegalStateException("Paused session has no pausedAt timestamp");
        }

        addPausedSeconds(practiceSession, pausedAt, now);
        practiceSession.setPausedAt(null);
        practiceSession.setStatus("IN_PROGRESS");
        return practiceSessionRepository.save(practiceSession);
    }

    @Override
    @Transactional
    public PracticeSession completeSession(UUID sessionId) {
        PracticeSession practiceSession = getLockedSession(sessionId);
        String status = practiceSession.getStatus();
        if (!"IN_PROGRESS".equals(status) && !"PAUSED".equals(status)) {
            throw new IllegalStateException(
                    "Only IN_PROGRESS or PAUSED practice sessions can be completed; current status is " + status
            );
        }

        OffsetDateTime completedAt = OffsetDateTime.now();
        if ("PAUSED".equals(status)) {
            OffsetDateTime pausedAt = practiceSession.getPausedAt();
            if (pausedAt == null) {
                throw new IllegalStateException("Paused session has no pausedAt timestamp");
            }
            addPausedSeconds(practiceSession, pausedAt, completedAt);
            practiceSession.setPausedAt(null);
        }

        OffsetDateTime startedAt = practiceSession.getStartedAt();
        if (startedAt == null) {
            throw new IllegalStateException("Practice session has no startedAt timestamp");
        }

        long elapsedSeconds = Math.max(0L, Duration.between(startedAt, completedAt).getSeconds());
        int pausedSeconds = practiceSession.getTotalPausedSeconds() == null
                ? 0
                : practiceSession.getTotalPausedSeconds();
        long activeSeconds = Math.max(0L, elapsedSeconds - pausedSeconds);

        practiceSession.setCompletedAt(completedAt);
        practiceSession.setActualDurationSeconds(Math.toIntExact(activeSeconds));
        practiceSession.setStatus("COMPLETED");
        return practiceSessionRepository.save(practiceSession);
    }

    private PracticeSession getLockedSession(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("sessionId must not be null");
        }
        return practiceSessionRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new java.util.NoSuchElementException("Practice session not found: " + id));
    }

    private void requireStatus(PracticeSession practiceSession, String expectedStatus) {
        if (!expectedStatus.equals(practiceSession.getStatus())) {
            throw new IllegalStateException(
                    "Expected practice session status " + expectedStatus
                            + " but was " + practiceSession.getStatus()
            );
        }
    }

    private void addPausedSeconds(PracticeSession practiceSession, OffsetDateTime pausedAt, OffsetDateTime endedAt) {
        long elapsedSeconds = Math.max(0L, Duration.between(pausedAt, endedAt).getSeconds());
        int currentTotal = practiceSession.getTotalPausedSeconds() == null
                ? 0
                : practiceSession.getTotalPausedSeconds();
        practiceSession.setTotalPausedSeconds(Math.toIntExact(Math.addExact(currentTotal, elapsedSeconds)));
    }
}
