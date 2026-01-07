package com.bchanowski.TaskManager.service;

import com.bchanowski.TaskManager.dto.Response;
import com.bchanowski.TaskManager.dto.UserRequest;
import com.bchanowski.TaskManager.entity.User;

public interface UserService {
    Response<?> signUp(UserRequest userRequest);

    Response<?> login(UserRequest userRequest);

    User getCurrentLoggedUser();
}
