package com.nibl.ticketing.controller;

import com.nibl.ticketing.entity.Engineer;
import com.nibl.ticketing.service.EngineerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/engineers")
@RequiredArgsConstructor
public class IT_EngineerController {
    private final EngineerService engineerService;

    @PostMapping
    public Engineer createEngineer(
            @RequestBody Engineer engineer) {
        return engineerService.createEngineer(engineer);
    }

    @GetMapping
    public List<Engineer> getAllEngineers() {
        return engineerService.getAllEngineers();
    }

    @GetMapping("/{id}")
    public Engineer getEngineer(
            @PathVariable Long id) {
        return engineerService.getEngineer(id);
    }

    @PutMapping("/{id}")
    public Engineer updateEngineer(
            @PathVariable Long id,
            @RequestBody Engineer engineer) {
        return engineerService.updateEngineer(id, engineer);
    }

    @DeleteMapping("/{id}")
    public void deleteEngineer(
            @PathVariable Long id) {
        engineerService.deleteEngineer(id);
    }
}
