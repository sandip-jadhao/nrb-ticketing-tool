package com.nibl.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String role;
    private String firstName;
    private String lastName;
    private String email;
}