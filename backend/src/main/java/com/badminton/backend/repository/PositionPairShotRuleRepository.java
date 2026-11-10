package com.badminton.backend.repository;

import com.badminton.backend.entity.PositionPairShotRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PositionPairShotRuleRepository extends JpaRepository<PositionPairShotRule, Long> {
    List<PositionPairShotRule> findByPlayerPositionIdInAndOpponentPositionIdIn(
            List<Short> playerPositionIds,
            List<Short> opponentPositionIds
    );
}
