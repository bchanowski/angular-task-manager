package com.bchanowski.TaskManager.service.implementation;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bchanowski.TaskManager.dto.Response;
import com.bchanowski.TaskManager.dto.TaskRequest;
import com.bchanowski.TaskManager.entity.Task;
import com.bchanowski.TaskManager.entity.User;
import com.bchanowski.TaskManager.enums.Priority;
import com.bchanowski.TaskManager.exceptions.NotFoundException;
import com.bchanowski.TaskManager.repo.TaskRepo;
import com.bchanowski.TaskManager.service.TaskService;
import com.bchanowski.TaskManager.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskServiceImpl implements TaskService {
    private final TaskRepo taskRepository;
    private final UserService userService;

    @Override
    public Response<Task> createTask(TaskRequest taskRequest) {

        User user = userService.getCurrentLoggedUser();

        Task taskToSave = Task.builder()
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .completed(taskRequest.getCompleted())
                .priority(taskRequest.getPriority())
                .dueDate(taskRequest.getDueDate())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .user(user)
                .build();

        Task savedTask = taskRepository.save(taskToSave);

        return Response.<Task>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Task created successfully")
                .data(savedTask)
                .build();

    }

    @Override
    @Transactional
    public Response<List<Task>> getAllMyTasks() {
        User currentUser = userService.getCurrentLoggedUser();

        List<Task> tasks = taskRepository.findByUser(currentUser, Sort.by(Sort.Direction.DESC, "id"));

        return Response.<List<Task>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Tasks retrieved successfully")
                .data(tasks)
                .build();
    }

    @Override
    public Response<Task> getTaskById(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        return Response.<Task>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Task retrieved successfully")
                .data(task)
                .build();
    }

    @Override
    public Response<Task> updateTask(TaskRequest taskRequest) {

        Task task = taskRepository.findById(taskRequest.getId())
                .orElseThrow(() -> new NotFoundException("Task not found"));

        if (taskRequest.getTitle() != null)
            task.setTitle(taskRequest.getTitle());
        if (taskRequest.getDescription() != null)
            task.setDescription(taskRequest.getDescription());
        if (taskRequest.getCompleted() != null)
            task.setCompleted(taskRequest.getCompleted());
        if (taskRequest.getPriority() != null)
            task.setPriority(taskRequest.getPriority());
        if (taskRequest.getDueDate() != null)
            task.setDueDate(taskRequest.getDueDate());
        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);

        return Response.<Task>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Task updated successfully")
                .data(updatedTask)
                .build();

    }

    @Override
    public Response<Void> deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new NotFoundException("Task does not exists");
        }
        taskRepository.deleteById(id);

        return Response.<Void>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Task deleted successfully")
                .build();
    }

    @Override
    @Transactional
    public Response<List<Task>> getMyTasksByCompletionStatus(boolean completed) {

        User currentUser = userService.getCurrentLoggedUser();

        List<Task> tasks = taskRepository.findByCompletedAndUser(completed, currentUser);

        return Response.<List<Task>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Tasks filtered by completion status for user")
                .data(tasks)
                .build();

    }

    @Override
    public Response<List<Task>> getMyTasksByPriority(String priority) {

        User currentUser = userService.getCurrentLoggedUser();

        Priority priorityEnum = Priority.valueOf(priority.toUpperCase());

        List<Task> tasks = taskRepository.findByPriorityAndUser(priorityEnum, currentUser,
                Sort.by(Sort.Direction.DESC, "id"));

        return Response.<List<Task>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Tasks filtered by priority for user")
                .data(tasks)
                .build();

    }
}
