package com.nibl.ticketing.service.impl;


import com.nibl.ticketing.entity.Engineer;
import com.nibl.ticketing.repository.EngineerRepository;
import com.nibl.ticketing.service.EngineerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EngineerServiceImpl implements EngineerService {

    private final EngineerRepository engineerRepository;

    @Override
    public Engineer createEngineer(Engineer engineer) {
        return engineerRepository.save(engineer);
    }

    @Override
    public Engineer updateEngineer(Long id, Engineer engineer) {

        Engineer dbEngineer = engineerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Engineer not found"));

        dbEngineer.setEmployeeCode(engineer.getEmployeeCode());
        dbEngineer.setSkillSet(engineer.getSkillSet());
        dbEngineer.setExperienceYears(engineer.getExperienceYears());

        return engineerRepository.save(dbEngineer);
    }

    @Override
    public Engineer getEngineer(Long id) {
        return engineerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Engineer not found"));
    }

    @Override
    public List<Engineer> getAllEngineers() {
        return engineerRepository.findAll();
    }

    @Override
    public void deleteEngineer(Long id) {
        engineerRepository.deleteById(id);
    }
}
