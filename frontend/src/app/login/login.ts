import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../service/api';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  error: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private apiService: Api,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.error = 'Fill all the fields';
      return;
    }
    this.error = '';
    this.apiService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200) {
          this.apiService.saveToken(res.data);
          this.router.navigate(['/tasks']);
        } else {
          this.error = res.message || 'Login not succesful';
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
