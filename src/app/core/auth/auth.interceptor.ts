import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { APP_CONSTANTS } from '../constants/app.constants';
import { StorageService } from '../services/storage.service';
import { AuthService } from './auth.service';

const AUTH_SKIP_URLS = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REFRESH,
] as const;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const skipAuth = AUTH_SKIP_URLS.some((url) => req.url.includes(url));

  if (skipAuth) {
    return next(req);
  }

  const token = storage.get<string>(APP_CONSTANTS.TOKEN.ACCESS);
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || req.url.includes(API_ENDPOINTS.AUTH.REFRESH)) {
        return throwError(() => error);
      }

      return authService.refresh().pipe(
        switchMap((accessToken) =>
          next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${accessToken}` },
            }),
          ),
        ),
        catchError((refreshError) => {
          authService.clearSession();
          void router.navigate(['/auth/login']);
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
