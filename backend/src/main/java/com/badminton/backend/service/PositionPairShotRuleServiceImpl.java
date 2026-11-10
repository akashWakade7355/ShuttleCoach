package com.badminton.backend.service;

import com.badminton.backend.entity.PositionPairShotRule;
import com.badminton.backend.repository.PositionPairShotRuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PositionPairShotRuleServiceImpl implements PositionPairShotRuleService {
    private final PositionPairShotRuleRepository positionPairShotRuleRepository;

    public PositionPairShotRuleServiceImpl(PositionPairShotRuleRepository positionPairShotRuleRepository) {
        this.positionPairShotRuleRepository = positionPairShotRuleRepository;
    }

    @Override
    public List<PositionPairShotRule> getAllPositionPairShotRules() {
        return positionPairShotRuleRepository.findAll();
    }

    @Override
    public List<PositionPairShotRule> getValidRulesForPositionPairs(
            List<Short> playerPositionIds,
            List<Short> opponentPositionIds
    ) {
        return positionPairShotRuleRepository
                .findByPlayerPositionIdInAndOpponentPositionIdIn(playerPositionIds, opponentPositionIds);
    }
}
