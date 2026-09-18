import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { TenantService } from '../tenant/tenant.service';
import { APP_CONSTANTS } from '../constants/app.constants';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantService = inject(TenantService);

  const tenantId = tenantService.getTenantId();

  if (!tenantId) {
    return next(req);
  }

  const clonedRequest = req.clone({
    setHeaders: {
      [APP_CONSTANTS.HTTP.TENANT_HEADER]: tenantId,
    },
  });

  return next(clonedRequest);
};
