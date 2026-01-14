import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../service/api';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  error: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private apiService: Api,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.error = 'Fill all the fields';
      return;
    }
    this.error = '';
    this.apiService.registerUser(this.registerForm.value).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.router.navigate(['/login']);
        } else {
          this.error = res.message || 'Registration not succesful';
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        this.error = error.error?.message || error.message;
        this.cdr.detectChanges();
      },
    });
  }
}
