import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'lg' | 'sm';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly text = input<string>('');
  readonly variant = input<ButtonVariant>('primary');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<ButtonSize>('lg');
  readonly type = input<ButtonType>('button');

  protected readonly buttonClass = computed(
    () => `btn btn-${this.size()} btn-${this.variant()}`,
  );
}

//useage
// <app-button text="Submit" variant="primary" />
// <app-button text="Cancel" variant="secondary" />
// <app-button [text]="label" [variant]="style" [disabled]="isDisabled" />
