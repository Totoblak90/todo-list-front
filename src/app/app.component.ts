import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/User';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public get user(): User {
    return this.authService.getUser();
  }

  constructor(private authService: AuthService, private router: Router) {}

  public logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login')
  }
}
