import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-storefront-dashboard-page',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <h1 class="page-title">{{ 'storefront.dashboard' | translate }}</h1>
  `,
  styles: `
    .page-title {
      margin: 0;
      color: var(--primary-text-color);
      font-size: var(--fs-page-title);
      font-weight: var(--title-font-weight);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorefrontDashboardPage {}
