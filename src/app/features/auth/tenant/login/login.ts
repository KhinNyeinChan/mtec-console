import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { InputText } from '../../../../shared/components/input-text/input-text';

/** `khin-fashion.mtec.com` and `khin-fashion.localhost` both resolve to `khin-fashion`. */
export function tenantIdFromHostname(hostname: string): string {
  const host = hostname.split(':')[0].toLowerCase();

  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return '';
  }

  if (host.endsWith('.localhost')) {
    return host.slice(0, -'.localhost'.length);
  }

  const labels = host.split('.').filter(Boolean);
  if (labels.length < 3 || labels[0] === 'www') {
    return '';
  }

  return labels[0];
}

@Component({
  selector: 'app-tenant-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, InputText],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantLoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly tenantId = signal(tenantIdFromHostname(globalThis.location?.hostname ?? ''));

  readonly form = this.fb.nonNullable.group({
    userId: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    this.errorMessage.set('');
    this.form.markAllAsTouched();

    const tenantId = this.tenantId();
    if (!tenantId) {
      this.errorMessage.set('auth.tenant_missing');
      return;
    }

    if (this.form.invalid || this.submitting()) {
      return;
    }

    const { userId, email, password } = this.form.getRawValue();
    this.submitting.set(true);

    this.auth
      .loginTenant({
        tenantId,
        username: userId.trim(),
        email: email.trim(),
        password,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl(`/store/${tenantId}/dashboard`),
        error: () => this.errorMessage.set('auth.login_failed'),
      });
  }

  fieldError(controlName: 'userId' | 'email' | 'password'): string {
    const control = this.form.controls[controlName];
    if (!control.touched || !control.invalid) {
      return '';
    }

    if (controlName === 'email' && control.hasError('email')) {
      return 'auth.email_invalid';
    }

    const requiredKeys = {
      userId: 'auth.user_id_required',
      email: 'auth.email_required',
      password: 'auth.password_required',
    } as const;
    return requiredKeys[controlName];
  }
}
