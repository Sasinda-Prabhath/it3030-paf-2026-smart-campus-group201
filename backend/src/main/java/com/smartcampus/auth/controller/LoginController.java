package com.smartcampus.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @GetMapping("/login")
    public ResponseEntity<Void> login() {
        return ResponseEntity.status(302)
            .header("Location", "/oauth2/authorization/google")
            .build();
    }
}
