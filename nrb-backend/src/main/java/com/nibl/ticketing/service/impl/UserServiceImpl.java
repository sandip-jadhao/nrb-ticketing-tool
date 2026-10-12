package com.nibl.ticketing.service.impl;

import com.nibl.ticketing.entity.User;
import com.nibl.ticketing.repository.UserRepository;
import com.nibl.ticketing.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        // Broadcast newly created user so admin lists and dashboard counters update live
        messagingTemplate.convertAndSend("/topic/users", savedUser);

        return savedUser;
    }

    @Override
    public User updateUser(Long id, User user) {
        User dbUser = userRepository.findById(id).orElseThrow();

        dbUser.setFirstName(user.getFirstName());
        dbUser.setLastName(user.getLastName());
        dbUser.setMobileNo(user.getMobileNo());

        User updatedUser = userRepository.save(dbUser);

        // Broadcast user update
        messagingTemplate.convertAndSend("/topic/users", updatedUser);

        return updatedUser;
    }

    @Override
    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);

        // 1. Broadcast user deletion to update Users, Engineers, and AdminDashboard
        Map<String, Object> deleteEvent = new HashMap<>();
        deleteEvent.put("deletedUserId", id);
        messagingTemplate.convertAndSend("/topic/users", deleteEvent);

        // 2. Broadcast to /topic/tickets so tickets removed by cascade update tables live
        Map<String, Object> ticketSyncEvent = new HashMap<>();
        ticketSyncEvent.put("userDeleted", true);
        ticketSyncEvent.put("userId", id);
        messagingTemplate.convertAndSend("/topic/tickets", ticketSyncEvent);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getLoggedInUser() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}