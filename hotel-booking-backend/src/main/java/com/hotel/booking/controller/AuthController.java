package com.hotel.booking.controller;

import com.hotel.booking.model.User;
import com.hotel.booking.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String role = body.getOrDefault("role", "CUSTOMER").toUpperCase();
        return ResponseEntity.ok(authService.register(
                body.get("name"),
                body.get("email"),
                body.get("password"),
                User.Role.valueOf(role)
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.login(body.get("email"), body.get("password")));
    }
}
