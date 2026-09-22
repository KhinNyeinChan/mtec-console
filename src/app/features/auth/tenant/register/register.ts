import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

function toStoreSlug(businessName: string): string {
  return businessName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Component({
  selector: 'app-tenant-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, InputText],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantRegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group(
    {
      businessName: ['', [Validators.required]],
      storeSlug: [{ value: '', disabled: true }],
      adminName: ['', [Validators.required]],
      adminId: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  constructor() {
    this.form.controls.businessName.valueChanges.pipe(takeUntilDestroyed()).subscribe((name) => {
      this.form.controls.storeSlug.setValue(toStoreSlug(name));
    });
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.form.markAllAsTouched();

    if (this.form.invalid || this.submitting()) {
      return;
    }

    const { businessName, storeSlug, adminName, adminId, email, phone, password } =
      this.form.getRawValue();

    if (!storeSlug) {
      this.errorMessage.set('auth.store_slug_required');
      return;
    }

    this.submitting.set(true);

    this.auth
      .registerTenant({
        businessName: businessName.trim(),
        storeSlug,
        adminName: adminName.trim(),
        adminId: adminId.trim(),
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
    controlName:
      | 'businessName'
      | 'storeSlug'
      | 'adminName'
      | 'adminId'
      | 'email'
      | 'phone'
      | 'password'
      | 'confirmPassword',
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
        businessName: 'auth.business_name_required',
        storeSlug: 'auth.store_slug_required',
        adminName: 'auth.admin_name_required',
        adminId: 'auth.admin_id_required',
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
