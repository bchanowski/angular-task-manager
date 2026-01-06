package com.bchanowski.TaskManager.dto;

import java.time.LocalDateTime;

import com.bchanowski.TaskManager.enums.Priority;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskRequest {

    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title muse be less than 200 characters")
    private String title;

    @Size(max = 500, message = "Description muse be less than 500 characters")
    private String description;

    @NotNull(message = "Status is required")
    private Boolean completed;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @FutureOrPresent(message = "Due date must be today in the future")
    private LocalDateTime dueDate;
}
