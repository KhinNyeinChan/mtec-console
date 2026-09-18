import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Tenant } from './tenant.model';
import { TenantService } from './tenant.service';

export const tenantResolver: ResolveFn<Tenant | RedirectCommand> = (route) => {
  const slug = route.paramMap.get('tenantSlug');
  const tenantService = inject(TenantService);
  const router = inject(Router);
  const loginUrl = router.parseUrl('/auth/login');

  if (!slug) {
    return new RedirectCommand(loginUrl);
  }

  return tenantService
    .loadBySlug(slug)
    .pipe(catchError(() => of(new RedirectCommand(loginUrl))));
};
