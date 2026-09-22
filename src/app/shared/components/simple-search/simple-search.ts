import { booleanAttribute, ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-simple-search',
  standalone: true,
  imports: [TranslatePipe, Button],
  templateUrl: './simple-search.html',
  styleUrl: './simple-search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleSearch {
  readonly value = model('');
  readonly placeholder = input('common.search');
  readonly showAdvanced = input(false, { transform: booleanAttribute });
  readonly showNew = input(false, { transform: booleanAttribute });
  readonly newLabel = input('common.new');

  readonly search = output<string>();
  readonly advancedToggle = output<void>();
  readonly create = output<void>();

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected filterSearch(): void {
    this.search.emit(this.value());
  }

  protected toggleAdvanced(): void {
    this.advancedToggle.emit();
  }

  protected goNew(): void {
    this.create.emit();
  }
}
