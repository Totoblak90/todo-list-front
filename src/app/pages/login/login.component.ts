import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { LoginRes } from '../../interfaces/auth.interface';
import { noConectionAlert } from '../../helpers/alerts';
import { UserRes } from '../../interfaces/general.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  public loginForm: FormGroup;
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  private destroy$: Subject<boolean> = new Subject();

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.createForm();
  }

  private createForm(): void {
    this.loginForm = this.fb.group(
      {
        email: [
          '',
          [Validators.required, Validators.pattern(this.emailPattern)],
        ],
        password: ['', [Validators.required]],
      },
      { validators: this.validateStrongPassword }
    );
  }

  public login(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: LoginRes) => this.setLoggedUser(res?.data?.user),
          error: (err) => noConectionAlert(),
        });
    }
  }

  private setLoggedUser(user: UserRes): void {
    const u = new User(
      user.id,
      user.email,
      user.created_at,
      user.updated_at,
      user.Folders,
      user.Todos
    );

    this.authService.setUser(u);
  }

  private validateStrongPassword(form: FormGroup): void {
    const password = form.get('password');
    if (password.touched) {
      if (!/\d/.test(password.value)) {
        password.setErrors({ notDigits: true });
      } else if (!/[a-z]/.test(password.value)) {
        password.setErrors({ noLowercase: true });
      } else if (!/[A-Z]/.test(password.value)) {
        password.setErrors({ noUppercase: true });
      } else if (!/[*._%+-]/.test(password.value)) {
        password.setErrors({ notSymbols: true });
      } else if (password.value.length < 8) {
        password.setErrors({ minlength: true });
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
