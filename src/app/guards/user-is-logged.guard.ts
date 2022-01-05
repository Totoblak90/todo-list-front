import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserIsLoggedGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.getUser()) {
      this.router.navigateByUrl('/dashboard');
      return false;
    }
    return true;
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (this.authService.getUser()) {
      this.router.navigateByUrl('/dashboard');
      return false;
    }
    return true;
  }
}
