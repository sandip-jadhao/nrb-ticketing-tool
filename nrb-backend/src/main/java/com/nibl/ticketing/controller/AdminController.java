package com.nibl.ticketing.controller;

import com.nibl.ticketing.entity.User;
import com.nibl.ticketing.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.nibl.ticketing.dto.ProfileResponse;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @PostMapping("/users")
    public User createUser(
            @RequestBody User user) {
        System.out.println("========== ADMIN CONTROLLER HIT ==========");
        System.out.println(user.getEmail());

        return userService.createUser(user);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);
    }

     @GetMapping("/profile")
    public ProfileResponse getProfile() {

        User user = userService.getLoggedInUser();

        return new ProfileResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getMobileNo(),
                user.getDepartment(),
                user.getDesignation(),
                user.getRole().name()
        );
    }
}
