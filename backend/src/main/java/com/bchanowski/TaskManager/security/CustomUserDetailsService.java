package com.bchanowski.TaskManager.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.bchanowski.TaskManager.entity.User;
import com.bchanowski.TaskManager.exceptions.NotFoundException;
import com.bchanowski.TaskManager.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return AuthUser.builder()
                .user(user)
                .build();
    }
}
