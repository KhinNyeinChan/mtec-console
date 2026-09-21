import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  model,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Button, ButtonVariant } from '../button/button';

export type ConfirmDialogTone = 'danger' | 'warning' | 'info' | 'primary';

let nextId = 0;

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [Button, TranslatePipe],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  readonly open = model(false);
  readonly title = input<string>('common.are_you_sure');
  readonly description = input<string>('common.confirm_description');
  readonly cancelText = input<string>('common.cancel');
  readonly confirmText = input<string>('common.confirm');
  readonly icon = input<string>('');
  readonly tone = input<ConfirmDialogTone>('danger');
  readonly closeOnOverlay = input(true, { transform: booleanAttribute });

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected readonly titleId = `confirm-title-${++nextId}`;
  protected readonly confirmVariant = computed<ButtonVariant>(() =>
    this.tone() === 'danger' ? 'danger' : 'primary',
  );

  protected onOverlayClick(): void {
    if (this.closeOnOverlay()) {
      this.cancel();
    }
  }

  protected cancel(): void {
    this.open.set(false);
    this.cancelled.emit();
  }

  protected confirm(): void {
    this.open.set(false);
    this.confirmed.emit();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.cancel();
    }
  }
}

//usage
// <app-confirm-dialog
//   [(open)]="isOpen"
//   title="common.are_you_sure"
//   description="common.confirm_description"
//   cancelText="common.cancel"
//   confirmText="common.confirm"
//   (confirmed)="onDelete()"
// />
