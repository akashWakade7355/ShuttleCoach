package com.badminton.backend.service;

import com.badminton.backend.entity.PositionPairShotRule;
import java.util.List;

public interface PositionPairShotRuleService {
    List<PositionPairShotRule> getAllPositionPairShotRules();

    List<PositionPairShotRule> getValidRulesForPositionPairs(
            List<Short> playerPositionIds,
            List<Short> opponentPositionIds
    );
}
