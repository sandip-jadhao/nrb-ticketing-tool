package com.nibl.ticketing.controller;

import com.nibl.ticketing.dto.LoginRequest;
import com.nibl.ticketing.dto.LoginResponse;import com.nibl.ticketing.dto.RegisterRequest;
import com.nibl.ticketing.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(
            @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}
