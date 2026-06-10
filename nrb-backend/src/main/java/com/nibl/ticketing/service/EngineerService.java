package com.nibl.ticketing.service;

import com.nibl.ticketing.entity.Engineer;
import java.util.List;

public interface EngineerService {

    Engineer createEngineer(Engineer engineer);

    Engineer updateEngineer(Long id, Engineer engineer);

    Engineer getEngineer(Long id);

    List<Engineer> getAllEngineers();

    void deleteEngineer(Long id);
}