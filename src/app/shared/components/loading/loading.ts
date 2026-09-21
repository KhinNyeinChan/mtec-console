import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loading {
  readonly label = input<string>('common.loading');

  protected readonly bars = [0.58, 0.78, 0.96, 1, 0.82, 0.66];
}

//usage
// <app-loading />
// <app-loading label="common.loading" />
