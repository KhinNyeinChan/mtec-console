import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { InputText } from '../../../../shared/components/input-text/input-text';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  if (!password || !confirmPassword) {
    return null;
  }
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, InputText],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group(
    {
      userName: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  onSubmit(): void {
    this.errorMessage.set('');
    this.form.markAllAsTouched();

    if (this.form.invalid || this.submitting()) {
      return;
    }

    const { userName, userId, email, phone, password } = this.form.getRawValue();
    this.submitting.set(true);

    this.auth
      .register({
        displayName: userName.trim(),
        username: userId.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/auth/login'),
        error: () => this.errorMessage.set('auth.register_failed'),
      });
  }

  fieldError(
    controlName: 'userName' | 'userId' | 'email' | 'phone' | 'password' | 'confirmPassword',
  ): string {
    const control = this.form.controls[controlName];
    if (!control.touched || !control.invalid) {
      if (
        controlName === 'confirmPassword' &&
        control.touched &&
        this.form.hasError('passwordMismatch')
      ) {
        return 'auth.password_mismatch';
      }
      return '';
    }

    if (control.hasError('required')) {
      const requiredKeys = {
        userName: 'auth.user_name_required',
        userId: 'auth.user_id_required',
        email: 'auth.email_required',
        phone: 'auth.phone_required',
        password: 'auth.password_required',
        confirmPassword: 'auth.confirm_password_required',
      } as const;
      return requiredKeys[controlName];
    }

    if (controlName === 'email' && control.hasError('email')) {
      return 'auth.email_invalid';
    }

    if (controlName === 'password' && control.hasError('minlength')) {
      return 'auth.password_min_length';
    }

    return '';
  }
}
