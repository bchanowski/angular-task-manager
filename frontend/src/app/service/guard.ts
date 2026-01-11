import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Api } from './api';

@Injectable({
  providedIn: 'root',
})
export class Guard implements CanActivate {
  constructor(private apiService: Api, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.apiService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['./login'], { queryParams: { returnUrl: state.url } });
    }
    return false;
  }
}
