import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  readonly title = input<string>('common.no_records');
  readonly description = input<string>('');
}

//usage
// <app-empty-state />
// <app-empty-state title="common.no_records" description="Orders will appear here." />
