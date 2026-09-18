import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { TenantService } from '../tenant/tenant.service';

export function initializeApp(): Promise<unknown> {
  const authService = inject(AuthService);
  const tenantService = inject(TenantService);

  tenantService.hydrate();
  return firstValueFrom(authService.hydrate());
}
