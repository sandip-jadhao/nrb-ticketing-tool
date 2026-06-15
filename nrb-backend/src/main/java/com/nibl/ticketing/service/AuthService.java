package com.nibl.ticketing.service;

import com.nibl.ticketing.dto.LoginRequest;
import com.nibl.ticketing.dto.LoginResponse;
import com.nibl.ticketing.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}