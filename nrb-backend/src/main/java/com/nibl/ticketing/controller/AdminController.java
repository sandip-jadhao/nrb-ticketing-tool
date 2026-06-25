package com.nibl.ticketing.controller;

import com.nibl.ticketing.entity.User;
import com.nibl.ticketing.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
}
