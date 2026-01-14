import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../service/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-taskform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './taskform.html',
  styleUrls: ['./taskform.css'],
})
export class Taskform implements OnInit {
  taskForm: FormGroup;

  error: string = '';

  isEdit: boolean = false;

  taskId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: Api,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      priority: ['MEDIUM'],
      completed: [false],
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');

    this.isEdit = !!this.taskId;

    if (this.isEdit && this.taskId) {
      this.fetchTask(this.taskId);
    }
  }

  fetchTask(id: string): void {
    this.apiService.getTaskById(id).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.taskForm.patchValue({
            title: res.data.title,
            description: res.data.description,
            dueDate: this.formatDateForInput(res.data.dueDate),
            priority: res.data.priority,
            completed: res.data.completed,
          });
        } else {
          this.error = res.message || 'Failed to fetch task';
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.error = error.error?.message || error.message || 'Error fetching task';
        this.cdr.detectChanges();
      },
    });
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.error = 'Title is required';
      this.cdr.detectChanges();
      return;
    }

    const formData = this.taskForm.value;

    if (formData.dueDate) {
      formData.dueDate = `${formData.dueDate}T00:00:00`;
    }

    this.error = '';

    if (this.isEdit && this.taskId) {
      formData.id = this.taskId;
      this.apiService.updateTask(formData).subscribe({
        next: (res) => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = error.error?.message || error.message || 'Error updating task';
          this.cdr.detectChanges();
        },
      });
    } else {
      this.apiService.createTask(formData).subscribe({
        next: (res) => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = error.error?.message || error.message || 'Error creating task';
          this.cdr.detectChanges();
        },
      });
    }
  }

  onDelete(): void {
    if (!this.taskId) return;

    const confirmDelete = confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      this.apiService.deleteTask(this.taskId).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = error.error?.message || error.message || 'Error deleting task';
          this.cdr.detectChanges();
        },
      });
    }
  }
}
