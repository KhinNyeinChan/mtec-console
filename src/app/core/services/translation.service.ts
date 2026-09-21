import { computed, inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, tap } from 'rxjs';
import { APP_CONSTANTS } from '../constants/app.constants';
import { StorageService } from '../services/storage.service';

export type AppLanguage = 'eng' | 'myan';

export const APP_LANGUAGES: readonly AppLanguage[] = ['eng', 'myan'] as const;

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly translate = inject(TranslateService);
  private readonly storage = inject(StorageService);

  readonly languages = APP_LANGUAGES;
  readonly currentLang = computed<AppLanguage>(
    () => (this.translate.currentLang() as AppLanguage | null) ?? this.defaultLang,
  );
  readonly isLoading = this.translate.isLoading;

  private readonly defaultLang: AppLanguage = 'eng';

  init(): Observable<unknown> {
    this.translate.addLangs([...APP_LANGUAGES]);
    this.translate.setFallbackLang(this.defaultLang);

    const saved = this.storage.get<AppLanguage>(APP_CONSTANTS.I18N.LANGUAGE);
    const lang = this.isSupported(saved) ? saved : this.defaultLang;
    return this.use(lang);
  }

  use(lang: AppLanguage): Observable<unknown> {
    return this.translate.use(lang).pipe(
      tap(() => this.storage.set(APP_CONSTANTS.I18N.LANGUAGE, lang)),
    );
  }

  instant(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(key, params);
  }

  get(key: string, params?: Record<string, unknown>): Observable<string> {
    return this.translate.get(key, params) as Observable<string>;
  }

  stream(key: string, params?: Record<string, unknown>): Observable<string> {
    return this.translate.stream(key, params) as Observable<string>;
  }

  private isSupported(lang: string | null): lang is AppLanguage {
    return !!lang && (APP_LANGUAGES as readonly string[]).includes(lang);
  }
}

//usage
// private readonly i18n = inject(TranslationService);
// this.i18n.use('myan').subscribe();
// this.i18n.instant('COMMON.SAVE');
//
// template:
// {{ 'COMMON.SAVE' | translate }}
// <button (click)="i18n.use('eng')">EN</button>
