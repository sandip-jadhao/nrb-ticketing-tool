package com.nibl.ticketing.service.impl;


import com.nibl.ticketing.repository.UserRepository;
import com.nibl.ticketing.service.UserService;
import com.nibl.ticketing.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User user) {

        User dbUser =
                userRepository.findById(id)
                        .orElseThrow();

        dbUser.setFirstName(user.getFirstName());
        dbUser.setLastName(user.getLastName());
        dbUser.setMobileNo(user.getMobileNo());

        return userRepository.save(dbUser);
    }

    @Override
    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow();
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
