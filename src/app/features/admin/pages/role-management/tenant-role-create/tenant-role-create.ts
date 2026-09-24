import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Button, ButtonSize, ButtonType, ButtonVariant } from '../../../../../shared/components/button/button';
import { DropdownSelect } from '../../../../../shared/components/dropdown-select/dropdown-select';
import { InputText } from '../../../../../shared/components/input-text/input-text';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tenant-role-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, Button, InputText, DropdownSelect],
  templateUrl: './tenant-role-create.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantRoleCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly i18n = inject(TranslateService);
  private readonly router = inject(Router);

  readonly saved = signal(false);

  readonly actions: {
    text: string;
    variant: ButtonVariant;
    size: ButtonSize;
    type: ButtonType;
    action?: 'new' | 'delete' | 'list';
  }[] = [
      { text: 'common.new', variant: 'primary', size: 'sm', type: 'button', action: 'new' },
      { text: 'common.save', variant: 'primary', size: 'sm', type: 'submit' },
      { text: 'common.delete', variant: 'primary', size: 'sm', type: 'button', action: 'delete' },
      { text: 'common.list', variant: 'primary', size: 'sm', type: 'button', action: 'list' },
    ];

  readonly form = this.fb.nonNullable.group({
    roleId: [{ value: 'TBA', disabled: true }],
    roleName: ['', [Validators.required]],
    status: ['active', [Validators.required]],
  });

  readonly statusOptions = computed(() => {
    this.i18n.currentLang();
    return [
      { value: 'active', label: this.label('admin.status_active') },
      { value: 'inactive', label: this.label('admin.status_inactive') },
    ];
  });

  onAction(action?: 'new' | 'delete' | 'list'): void {
    if (action === 'new') {
      this.onNew();
    }
    if (action === 'delete') {
      this.onDelete();
    }
    if (action === 'list') {
      this.router.navigateByUrl('/admin/tenant-roles');
    }
  }

  onNew(): void {
    this.resetForm();
  }

  onSave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.saved.set(false);
      return;
    }
    this.saved.set(true);
  }

  onDelete(): void {
    this.resetForm();
  }

  fieldError(controlName: 'roleName' | 'status'): string {
    const control = this.form.controls[controlName];
    if (!control.touched || !control.invalid) {
      return '';
    }

    if (control.hasError('required')) {
      const requiredKeys = {
        roleName: 'admin.role_name_required',
        status: 'admin.status',
      } as const;
      return requiredKeys[controlName];
    }

    return '';
  }

  private resetForm(): void {
    this.form.reset({
      roleId: 'TBA',
      roleName: '',
      status: 'active',
    });
    this.form.controls.roleId.disable();
    this.saved.set(false);
  }

  private label(key: string): string {
    const translated = this.i18n.instant(key);
    return typeof translated === 'string' ? translated : key;
  }
}
