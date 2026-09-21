import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth.service';
import { AppLanguage, TranslationService } from '../../../core/services/translation.service';
import { TenantService } from '../../../core/tenant/tenant.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-storefront-header',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './storefront-header.html',
  styleUrl: './storefront-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorefrontHeader {
  private readonly auth = inject(AuthService);
  private readonly i18n = inject(TranslationService);
  private readonly tenantService = inject(TenantService);

  readonly notificationClick = output<void>();

  readonly appName = computed(
    () => this.tenantService.tenant()?.name || environment.appName,
  );
  readonly userName = computed(
    () => this.auth.user()?.displayName || this.auth.user()?.username || '',
  );
  readonly currentLang = this.i18n.currentLang;
  readonly languages = this.i18n.languages;

  onNotificationClick(): void {
    this.notificationClick.emit();
  }

  setLanguage(lang: AppLanguage): void {
    if (lang === this.currentLang()) {
      return;
    }
    this.i18n.use(lang).subscribe();
  }

  langLabel(lang: AppLanguage): string {
    return lang === 'eng' ? 'EN' : 'MY';
  }
}
