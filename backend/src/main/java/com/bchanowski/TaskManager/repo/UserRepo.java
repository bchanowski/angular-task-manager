package com.bchanowski.TaskManager.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bchanowski.TaskManager.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
}
