package com.nibl.ticketing.config;

import com.nibl.ticketing.entity.User;
import com.nibl.ticketing.enums.Role;
import com.nibl.ticketing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        String adminEmail = "admin@nibl.in";

        if (!userRepository.existsByEmail(adminEmail)) {

            User admin = new User();

            admin.setEmail(adminEmail);
            admin.setPassword(
                    passwordEncoder.encode("Admin@123")
            );

            admin.setFirstName("System");
            admin.setLastName("Admin");
            admin.setDepartment("IT");
            admin.setDesignation("Administrator");
            admin.setMobileNo("0000000000");

            // Role is an enum
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("==========================================");
            System.out.println("DEFAULT ADMIN USER CREATED");
            System.out.println("Email    : admin@nibl.in");
            System.out.println("Password : Admin@123");
            System.out.println("Role     : ADMIN");
            System.out.println("==========================================");

        } else {

            System.out.println(
                    "Admin user already exists: " + adminEmail
            );
        }
    }
}