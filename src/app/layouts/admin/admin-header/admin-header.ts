import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { AppLanguage, TranslationService } from '../../../core/services/translation.service';
import { environment } from '../../../../environments/environment';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHeader {
  private readonly auth = inject(AuthService);
  private readonly i18n = inject(TranslationService);

  readonly notificationClick = output<void>();

  readonly appName = environment.appName;
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
