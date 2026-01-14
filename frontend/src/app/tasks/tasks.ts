import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../service/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css'],
})
export class Tasks implements OnInit {
  tasks: any[] = [];

  filteredTasks: any[] = [];

  error: string = '';

  priorityFilter: string = 'ALL';

  completionFilter: string = 'ALL';

  constructor(private apiService: Api, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.apiService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.fetchTasks();
  }

  fetchTasks(): void {
    this.apiService.getAllMyTasks().subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.tasks = res.data;
          console.log('Fetched tasks:', this.tasks);
          this.filteredTasks = [...this.tasks];
          this.applyFilters();
          this.cdr.detectChanges();
        } else {
          this.error = res.message || 'Failed to fetch tasks';
        }
      },
      error: (error) => {
        this.error = error.error?.message || error.message || 'Error fetching tasks';
      },
    });
  }

  applyFilters(): void {
    let result = [...this.tasks];
    console.log('Applying filters to:', this.tasks);
    if (this.completionFilter !== 'ALL') {
      const isCompleted = this.completionFilter === 'COMPLETED';
      result = result.filter((task) => task.completed === isCompleted);
    }

    if (this.priorityFilter !== 'ALL') {
      result = result.filter((task) => task.priority === this.priorityFilter);
    }

    this.filteredTasks = result;
  }

  toggleComplete(task: any): void {
    this.apiService
      .updateTask({
        id: task.id,
        completed: !task.completed,
      })
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.tasks = this.tasks.map((t) =>
              t.id === task.id ? { ...t, completed: !t.completed } : t
            );
            this.applyFilters();
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          this.error = error.error?.message || error.message || 'Error updating task';
        },
      });
  }

  resetFilters(): void {
    this.priorityFilter = 'ALL';
    this.completionFilter = 'ALL';
    this.applyFilters();
  }
}
