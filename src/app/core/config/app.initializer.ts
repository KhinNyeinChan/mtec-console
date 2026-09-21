import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { TranslationService } from '../services/translation.service';
import { TenantService } from '../tenant/tenant.service';

export function initializeApp(): Promise<unknown> {
  const authService = inject(AuthService);
  const tenantService = inject(TenantService);
  const translationService = inject(TranslationService);

  tenantService.hydrate();

  return Promise.all([
    firstValueFrom(translationService.init()),
    firstValueFrom(authService.hydrate()),
  ]);
}
