package com.nibl.ticketing.service;

import com.nibl.ticketing.entity.User;
import java.util.*;

public interface UserService {

    User createUser(User user);

    User updateUser(Long id, User user);

    User getUser(Long id);

    void deleteUser(Long id);

    List<User> getAllUsers();

    User getLoggedInUser();
}
