import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../service/api';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private readonly apiService: Api, private router: Router) {}

  get isAuthenticated(): boolean {
    return this.apiService.isAuthenticated();
  }
  handleLogout(): void {
    const logoutConfirm = window.confirm('Are you sure you want to logout?');
    if (logoutConfirm) {
      this.apiService.removeToken();
      this.router.navigate(['/login']);
    }
  }
}
