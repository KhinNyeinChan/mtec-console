import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

export interface DropdownOption {
  value: string;
  label: string;
}

export type DropdownOptionInput = string | DropdownOption;

let nextId = 0;

@Component({
  selector: 'app-dropdown-select',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './dropdown-select.html',
  styleUrl: './dropdown-select.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownSelect),
      multi: true,
    },
  ],
})
export class DropdownSelect implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly options = input<DropdownOptionInput[]>([]);
  readonly label = input<string>('');
  readonly placeholder = input<string>('common.select');
  readonly searchPlaceholder = input<string>('common.search');
  readonly helperText = input<string>('');
  readonly error = input<string>('');
  readonly name = input<string>('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly inputId = `dropdown-select-${++nextId}`;
  protected readonly listId = `${this.inputId}-list`;
  protected readonly helperId = `${this.inputId}-helper`;
  protected readonly errorId = `${this.inputId}-error`;
  protected readonly cvaDisabled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly searchQuery = signal('');

  private readonly host = inject(ElementRef<HTMLElement>);

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

  protected readonly normalizedOptions = computed<DropdownOption[]>(() =>
    this.options().map((option) =>
      typeof option === 'string' ? { value: option, label: option } : option,
    ),
  );

  protected readonly showSearch = computed(() => this.normalizedOptions().length > 5);

  protected readonly filteredOptions = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const options = this.normalizedOptions();
    if (!query) {
      return options;
    }
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query),
    );
  });

  protected readonly selectedLabel = computed(() => {
    const current = this.value();
    return this.normalizedOptions().find((option) => option.value === current)?.label ?? '';
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

  protected toggleMenu(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) {
      return;
    }
    this.menuOpen.update((open) => !open);
    if (!this.menuOpen()) {
      this.closeMenu();
    } else {
      this.searchQuery.set('');
    }
  }

  protected selectOption(option: DropdownOption): void {
    this.value.set(option.value);
    this.onChange(option.value);
    this.closeMenu();
  }

  protected onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeMenu();
  }

  private closeMenu(): void {
    if (this.menuOpen()) {
      this.onTouched();
    }
    this.menuOpen.set(false);
    this.searchQuery.set('');
  }
}

//usage
// <app-dropdown-select
//   label="City"
//   placeholder="Select a city"
//   [options]="cities"
//   [(value)]="city"
// />
//
// <app-dropdown-select
//   formControlName="city"
//   label="City"
//   [options]="cities"
// />
