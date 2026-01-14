import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { Tasks } from './tasks/tasks';
import { Taskform } from './taskform/taskform';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'tasks', component: Tasks },
  { path: 'tasks/add', component: Taskform },
  { path: 'tasks/edit/:id', component: Taskform },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: '**', redirectTo: '/tasks', pathMatch: 'full' },
];
