package com.nibl.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfileResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNo;
    private String department;
    private String designation;
    private String role;
}