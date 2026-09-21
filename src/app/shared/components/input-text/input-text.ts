import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

export type InputTextType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'url';

let nextId = 0;

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './input-text.html',
  styleUrl: './input-text.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputText),
      multi: true,
    },
  ],
})
export class InputText implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly helperText = input<string>('');
  readonly error = input<string>('');
  readonly type = input<InputTextType>('text');
  readonly name = input<string>('');
  readonly autocomplete = input<string>('off');
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly inputId = `input-text-${++nextId}`;
  protected readonly helperId = `${this.inputId}-helper`;
  protected readonly errorId = `${this.inputId}-error`;
  protected readonly cvaDisabled = signal(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected readonly hasError = computed(() => this.error().trim().length > 0);
  protected readonly describedBy = computed(() => {
    if (this.hasError()) {
      return this.errorId;
    }
    if (this.helperText()) {
      return this.helperId;
    }
    return null;
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}

//usage
// <app-input-text
//   label="Label"
//   placeholder="Placeholder"
//   helperText="Helper text"
//   required
//   [(value)]="email"
// />

// <app-input-text
//   label="Label"
//   placeholder="Placeholder"
//   helperText="Helper text"
//   [error]="emailError"
//   [(value)]="email"
// />

// <input-text
//   formControlName="email"
//   label="Email"
//   placeholder="Placeholder"
// />