import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { APP_CONSTANTS } from '../constants/app.constants';
import { StorageService } from '../services/storage.service';
import { AuthStore } from './auth.store';

export const authGuard: CanActivateFn = (_route, state) => {
  const authStore = inject(AuthStore);
  const storage = inject(StorageService);
  const router = inject(Router);

  const hasSession =
    authStore.isAuthenticated() || !!storage.get<string>(APP_CONSTANTS.TOKEN.ACCESS);

  if (hasSession) {
    return true;
  }

  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
};
