package com.bookstore.service;

import com.bookstore.model.AuthRequest;
import com.bookstore.model.AuthResponse;
import com.bookstore.model.RegisterRequest;
import com.bookstore.model.User;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse registerUser(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse(false, "Email is required.", null, null);
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return new AuthResponse(false, "Password must be at least 6 characters.", null, null);
        }
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            return new AuthResponse(false, "An account with this email already exists!", null, null);
        }

        User newUser = new User(
                request.getName(),
                request.getEmail().trim().toLowerCase(),
                request.getPassword(), // Note: In production use BCryptPasswordEncoder
                request.getFavoriteGenre(),
                "USER"
        );

        User savedUser = userRepository.save(newUser);
        savedUser.setPassword(null); // Never return password in response

        String token = "jwt-token-" + UUID.randomUUID().toString();
        return new AuthResponse(true, "Registration successful!", token, savedUser);
    }

    public AuthResponse loginUser(AuthRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return new AuthResponse(false, "Email and password are required.", null, null);
        }

        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail().trim().toLowerCase());

        if (optionalUser.isEmpty()) {
            return new AuthResponse(false, "Invalid email or password.", null, null);
        }

        User user = optionalUser.get();
        if (!user.getPassword().equals(request.getPassword())) {
            return new AuthResponse(false, "Invalid email or password.", null, null);
        }

        User safeUser = new User();
        safeUser.setId(user.getId());
        safeUser.setName(user.getName());
        safeUser.setEmail(user.getEmail());
        safeUser.setFavoriteGenre(user.getFavoriteGenre());
        safeUser.setRole(user.getRole());
        safeUser.setCreatedAt(user.getCreatedAt());

        String token = "jwt-token-" + UUID.randomUUID().toString();
        return new AuthResponse(true, "Login successful!", token, safeUser);
    }
}
