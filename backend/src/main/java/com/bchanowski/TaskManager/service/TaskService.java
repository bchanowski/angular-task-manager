package com.bchanowski.TaskManager.service;

import java.util.List;

import com.bchanowski.TaskManager.dto.Response;
import com.bchanowski.TaskManager.dto.TaskRequest;
import com.bchanowski.TaskManager.entity.Task;

public interface TaskService {
    Response<Task> createTask(TaskRequest taskRequest);

    Response<List<Task>> getAllMyTasks();

    Response<Task> getTaskById(Long id);

    Response<Task> updateTask(TaskRequest taskRequest);

    Response<Void> deleteTask(Long id);

    Response<List<Task>> getMyTasksByCompletionStatus(boolean completed);

    Response<List<Task>> getMyTasksByPriority(String priority);
}
