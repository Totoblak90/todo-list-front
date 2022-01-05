import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserNotLoggedGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.getUser()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (!this.authService.getUser()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}
