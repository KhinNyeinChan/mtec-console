import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, Provider, provideAppInitializer } from '@angular/core';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { authInterceptor } from '../auth/auth.interceptor';
import { apiInterceptor } from '../http/api.interceptor';
import { errorInterceptor } from '../http/error.interceptor';
import { loadingInterceptor } from '../http/loading.interceptor';
import { tenantInterceptor } from '../http/tenant.interceptor';
import { AppTranslateLoader } from '../i18n/app-translate.loader';
import { initializeApp } from './app.initializer';

export function provideCore(): Array<EnvironmentProviders | Provider> {
  return [
    provideHttpClient(
      withInterceptors([
        apiInterceptor,
        authInterceptor,
        tenantInterceptor,
        loadingInterceptor,
        errorInterceptor,
      ]),
    ),
    ...provideTranslateService({
      fallbackLang: 'eng',
      lang: 'eng',
      loader: provideTranslateLoader(AppTranslateLoader),
    }),
    provideAppInitializer(initializeApp),
  ];
}
