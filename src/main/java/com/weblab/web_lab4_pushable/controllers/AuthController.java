package com.weblab.web_lab4_pushable.controllers;

import com.weblab.web_lab4_pushable.database.LoginEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/api")
public class AuthController {

    @PostMapping("/login")
    @PreAuthorize("hasRole('client_user')")
    public ResponseEntity<?> login(@RequestBody LoginEntity credentials) {
        return ResponseEntity.ok(Collections.singletonMap("message", "User authenticated"));
    }

}
