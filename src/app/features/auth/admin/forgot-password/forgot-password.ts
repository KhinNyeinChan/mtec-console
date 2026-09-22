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
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, InputText],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly step = signal<'email' | 'otp' | 'password'>('email');
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly email = signal('');
  readonly verifiedOtp = signal('');

  readonly emailForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly otpForm = this.fb.nonNullable.group({
    d0: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    d1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    d2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    d3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
  });

  readonly passwordForm = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  readonly otpDigits = ['d0', 'd1', 'd2', 'd3'] as const;

  onEmailSubmit(): void {
    this.errorMessage.set('');
    this.emailForm.markAllAsTouched();

    if (this.emailForm.invalid || this.submitting()) {
      return;
    }

    const email = this.emailForm.getRawValue().email.trim();
    this.submitting.set(true);

    this.auth
      .requestResetOtp({ email })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.email.set(email);
          this.step.set('otp');
        },
        error: () => this.errorMessage.set('auth.otp_send_failed'),
      });
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);
    const key = this.otpDigits[index];
    this.otpForm.controls[key].setValue(value);
    input.value = value;

    if (value && index < this.otpDigits.length - 1) {
      const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      next?.focus();
    }
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    const key = this.otpDigits[index];
    if (event.key === 'Backspace' && !this.otpForm.controls[key].value && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      prev?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 4) ?? '';
    text.split('').forEach((digit, i) => {
      this.otpForm.controls[this.otpDigits[i]].setValue(digit);
      const el = document.getElementById(`otp-${i}`) as HTMLInputElement | null;
      if (el) {
        el.value = digit;
      }
    });
    const focusIndex = Math.min(text.length, 3);
    (document.getElementById(`otp-${focusIndex}`) as HTMLInputElement | null)?.focus();
  }

  onOtpSubmit(): void {
    this.errorMessage.set('');
    this.otpForm.markAllAsTouched();

    if (this.otpForm.invalid || this.submitting()) {
      return;
    }

    const otp = this.otpDigits.map((key) => this.otpForm.controls[key].value).join('');
    this.submitting.set(true);

    this.auth
      .verifyResetOtp({ email: this.email(), otp })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.verifiedOtp.set(otp);
          this.step.set('password');
        },
        error: () => this.errorMessage.set('auth.otp_invalid'),
      });
  }

  onPasswordSubmit(): void {
    this.errorMessage.set('');
    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.invalid || this.submitting()) {
      return;
    }

    const { password } = this.passwordForm.getRawValue();
    this.submitting.set(true);

    this.auth
      .resetPassword({ email: this.email(), otp: this.verifiedOtp(), password })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/auth/admin/login'),
        error: () => this.errorMessage.set('auth.reset_failed'),
      });
  }

  emailError(): string {
    const control = this.emailForm.controls.email;
    if (!control.touched || !control.invalid) {
      return '';
    }
    if (control.hasError('email')) {
      return 'auth.email_invalid';
    }
    return 'auth.email_required';
  }

  passwordFieldError(controlName: 'password' | 'confirmPassword'): string {
    const control = this.passwordForm.controls[controlName];
    if (!control.touched || !control.invalid) {
      if (
        controlName === 'confirmPassword' &&
        control.touched &&
        this.passwordForm.hasError('passwordMismatch')
      ) {
        return 'auth.password_mismatch';
      }
      return '';
    }

    if (control.hasError('required')) {
      return controlName === 'password'
        ? 'auth.password_required'
        : 'auth.confirm_password_required';
    }

    if (controlName === 'password' && control.hasError('minlength')) {
      return 'auth.password_min_length';
    }

    return '';
  }

  otpHasError(): boolean {
    return this.otpForm.touched && this.otpForm.invalid;
  }
}
