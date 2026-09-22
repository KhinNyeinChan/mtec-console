import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Button, ButtonSize, ButtonType, ButtonVariant } from '../../../../../shared/components/button/button';
import { DropdownSelect } from '../../../../../shared/components/dropdown-select/dropdown-select';
import { InputText } from '../../../../../shared/components/input-text/input-text';

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
  selector: 'app-tenant-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, Button, InputText, DropdownSelect],
  templateUrl: './tenant-create.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly i18n = inject(TranslateService);

  readonly saved = signal(false);

  readonly actions: {
    text: string;
    variant: ButtonVariant;
    size: ButtonSize;
    type: ButtonType;
    action?: 'new' | 'delete';
  }[] = [
    { text: 'common.new', variant: 'primary', size: 'sm', type: 'button', action: 'new' },
    { text: 'common.save', variant: 'primary', size: 'sm', type: 'submit' },
    { text: 'common.delete', variant: 'primary', size: 'sm', type: 'button', action: 'delete' },
  ];

  readonly form = this.fb.nonNullable.group(
    {
      businessName: ['', [Validators.required]],
      storeSlug: [{ value: '', disabled: true }],
      adminName: ['', [Validators.required]],
      adminId: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      status: ['active', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  readonly statusOptions = computed(() => {
    this.i18n.currentLang();
    return [
      { value: 'active', label: this.label('admin.status_active') },
      { value: 'inactive', label: this.label('admin.status_inactive') },
    ];
  });

  constructor() {
    this.form.controls.businessName.valueChanges.pipe(takeUntilDestroyed()).subscribe((name) => {
      this.form.controls.storeSlug.setValue(toStoreSlug(name));
      this.saved.set(false);
    });
  }

  onAction(action?: 'new' | 'delete'): void {
    if (action === 'new') {
      this.onNew();
    }
    if (action === 'delete') {
      this.onDelete();
    }
  }

  onNew(): void {
    this.resetForm();
  }

  onSave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.form.getRawValue().storeSlug) {
      this.saved.set(false);
      return;
    }
    this.saved.set(true);
  }

  onDelete(): void {
    this.resetForm();
  }

  fieldError(
    controlName:
      | 'businessName'
      | 'storeSlug'
      | 'adminName'
      | 'adminId'
      | 'email'
      | 'phone'
      | 'status'
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
        status: 'admin.status',
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

  private resetForm(): void {
    this.form.reset({
      businessName: '',
      storeSlug: '',
      adminName: '',
      adminId: '',
      email: '',
      phone: '',
      status: 'active',
      password: '',
      confirmPassword: '',
    });
    this.saved.set(false);
  }

  private label(key: string): string {
    const translated = this.i18n.instant(key);
    return typeof translated === 'string' ? translated : key;
  }
}
