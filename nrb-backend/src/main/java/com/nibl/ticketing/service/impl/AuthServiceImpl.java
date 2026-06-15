package com.nibl.ticketing.service.impl;

import com.nibl.ticketing.dto.LoginRequest;
import com.nibl.ticketing.dto.LoginResponse;import com.nibl.ticketing.dto.RegisterRequest;
import com.nibl.ticketing.entity.User;
import com.nibl.ticketing.repository.UserRepository;
import com.nibl.ticketing.security.JwtService;
import com.nibl.ticketing.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public String register(RegisterRequest request) {

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .mobileNo(request.getMobileNo())
                .department(request.getDepartment())
                .designation(request.getDesignation())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);

        return "User Registered Successfully";
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid Email"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid Password");
        }

        String token =
                jwtService.generateToken(user);

        return new LoginResponse(
                token,
                user.getRole().name()
        );
    }
}