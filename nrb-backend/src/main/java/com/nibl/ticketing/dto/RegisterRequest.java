package com.nibl.ticketing.dto;

import com.nibl.ticketing.enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String mobileNo;
    private String password;
    private String department;
    private String designation;
    private Role role;
}
