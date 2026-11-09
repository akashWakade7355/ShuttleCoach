package com.badminton.backend.service;

import com.badminton.backend.entity.CourtPosition;
import com.badminton.backend.repository.CourtPositionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourtPositionServiceImpl implements CourtPositionService {
    private final CourtPositionRepository courtPositionRepository;

    public CourtPositionServiceImpl(CourtPositionRepository courtPositionRepository) {
        this.courtPositionRepository = courtPositionRepository;
    }

    @Override
    public List<CourtPosition> getAllPositions() {
        return courtPositionRepository.findAll();
    }
}
