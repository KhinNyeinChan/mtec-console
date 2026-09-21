import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { StorageService } from '../../../../core/services/storage.service';
import { InputText } from '../../../../shared/components/input-text/input-text';

const REMEMBER_USER_KEY = 'auth_remember_user_id';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, InputText],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);

  readonly submitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    userId: [this.storage.get<string>(REMEMBER_USER_KEY) ?? '', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [!!this.storage.get<string>(REMEMBER_USER_KEY)],
  });

  onSubmit(): void {
    this.errorMessage.set('');
    this.form.markAllAsTouched();

    if (this.form.invalid || this.submitting()) {
      return;
    }

    const { userId, password, rememberMe } = this.form.getRawValue();
    this.submitting.set(true);

    this.auth
      .login({ username: userId.trim(), password })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          if (rememberMe) {
            this.storage.set(REMEMBER_USER_KEY, userId.trim());
          } else {
            this.storage.remove(REMEMBER_USER_KEY);
          }
          void this.router.navigateByUrl('/admin');
        },
        error: () => {
          this.errorMessage.set('auth.login_failed');
        },
      });
  }

  fieldError(controlName: 'userId' | 'password'): string {
    const control = this.form.controls[controlName];
    if (!control.touched || !control.invalid) {
      return '';
    }
    return controlName === 'userId' ? 'auth.user_id_required' : 'auth.password_required';
  }
}
