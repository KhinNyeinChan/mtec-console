import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, provideAppInitializer } from '@angular/core';
import { authInterceptor } from '../auth/auth.interceptor';
import { apiInterceptor } from '../http/api.interceptor';
import { errorInterceptor } from '../http/error.interceptor';
import { loadingInterceptor } from '../http/loading.interceptor';
import { tenantInterceptor } from '../http/tenant.interceptor';
import { initializeApp } from './app.initializer';

export function provideCore(): EnvironmentProviders[] {
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
    provideAppInitializer(initializeApp),
  ];
}
