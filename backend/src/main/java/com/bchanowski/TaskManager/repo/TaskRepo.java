package com.bchanowski.TaskManager.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bchanowski.TaskManager.entity.Task;
import com.bchanowski.TaskManager.entity.User;
import com.bchanowski.TaskManager.enums.Priority;
import org.springframework.data.domain.Sort;

public interface TaskRepo extends JpaRepository<Task, Long> {

    List<Task> findByUser(User user, Sort sort);

    List<Task> findByCompletedAndUser(boolean completed, User user);

    List<Task> findByPriorityAndUser(Priority priority, User user, Sort sort);
}
