import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
  UserRegisterResponse,
  UserRes,
} from 'src/app/interfaces/general.interface';
import { User } from 'src/app/models/User';
import { AuthService } from '../../services/auth.service';
import { RegisterRes } from '../../interfaces/auth.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  public registerForm: FormGroup;
  private emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.registerForm = this.fb.group(
      {
        email: [
          '',
          [Validators.required, Validators.pattern(this.emailPattern)],
        ],
        password: ['', [Validators.required]],
        passwordRepeat: [''],
      },
      {
        validators: [this.validateStrongPassword, this.passwordMatch],
      }
    );
  }

  private loginRegisteredUser(user: UserRegisterResponse): void {
    const u: User = new User(
      user?.id,
      user?.email,
      user?.created_at,
      user?.updated_at,
      [],
      []
    );

    this.authService.setUser(u);
    this.authService.getUser() ? this.router.navigateByUrl('/dashboard') : null;
  }

  private validateStrongPassword(form: FormGroup): void {
    const password = form.get('password');
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

  public showStrongPasswordErrorMsgs(): boolean {
    return (
      this.registerForm.controls.password.touched &&
      (this.registerForm.controls.password.errors?.notDigits ||
        this.registerForm.controls.password.errors?.noLowercase ||
        this.registerForm.controls.password.errors?.noUppercase ||
        this.registerForm.controls.password.errors?.notSymbols ||
        this.registerForm.controls.password.errors?.minlength)
    );
  }

  private passwordMatch(form: FormGroup): void {
    const pass1 = form.get('password');
    const pass2 = form.get('passwordRepeat');

    if (pass1.value !== pass2.value) {
      pass2.setErrors({ notMatch: true });
    }
  }

  public register(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.authService
        .register(this.registerForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: RegisterRes) => this.loginRegisteredUser(res?.data?.user),
          error: (err) => console.log(err),
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
