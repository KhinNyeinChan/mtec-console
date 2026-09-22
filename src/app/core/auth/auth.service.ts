import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, finalize, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { APP_CONSTANTS } from '../constants/app.constants';
import { SKIP_LOADING_HEADER } from '../http/loading.interceptor';
import { ApiResponse } from '../models/api-response.model';
import { StorageService } from '../services/storage.service';
import {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  TenantLoginRequest,
  RefreshRequest,
  RegisterRequest,
  ResetPasswordRequest,
  TenantRegisterRequest,
  TenantResetOtpRequest,
  TenantResetPasswordRequest,
  TenantVerifyResetOtpRequest,
  User,
  VerifyResetOtpRequest,
} from './auth.model';
import { AuthStore } from './auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly storage = inject(StorageService);
  private refreshInFlight$: Observable<string> | null = null;

  readonly user = this.authStore.user;
  readonly isAuthenticated = this.authStore.isAuthenticated;

  hydrate(): Observable<User | null> {
    const accessToken = this.storage.get<string>(APP_CONSTANTS.TOKEN.ACCESS);

    if (!accessToken) {
      return of(null);
    }

    return this.http
      .get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME, {
        headers: new HttpHeaders({ [SKIP_LOADING_HEADER]: 'true' }),
      })
      .pipe(
        tap((response) => this.authStore.setUser(response.data)),
        map((response) => response.data),
        catchError(() => {
          this.clearSession();
          return of(null);
        }),
      );
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, request).pipe(
      tap((response) => this.persistSession(response.data)),
      map((response) => response.data),
    );
  }

  loginTenant(request: TenantLoginRequest): Observable<LoginResponse> {
    return this.http
      .post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.TENANT_LOGIN, request)
      .pipe(
        tap((response) => this.persistSession(response.data)),
        map((response) => response.data),
      );
  }

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.REGISTER, request).pipe(
      map((response) => response.data),
    );
  }

  registerTenant(request: TenantRegisterRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(API_ENDPOINTS.TENANT.REGISTER, request).pipe(
      map((response) => response.data),
    );
  }

  requestResetOtp(request: ForgotPasswordRequest): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, request)
      .pipe(map(() => undefined));
  }

  verifyResetOtp(request: VerifyResetOtpRequest): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(API_ENDPOINTS.AUTH.VERIFY_RESET_OTP, request)
      .pipe(map(() => undefined));
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, request)
      .pipe(map(() => undefined));
  }

  requestTenantResetOtp(request: TenantResetOtpRequest): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(API_ENDPOINTS.AUTH.TENANT_FORGOT_PASSWORD, request)
      .pipe(map(() => undefined));
  }

  verifyTenantResetOtp(request: TenantVerifyResetOtpRequest): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(API_ENDPOINTS.AUTH.TENANT_VERIFY_RESET_OTP, request)
      .pipe(map(() => undefined));
  }

  resetTenantPassword(request: TenantResetPasswordRequest): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(API_ENDPOINTS.AUTH.TENANT_RESET_PASSWORD, request)
      .pipe(map(() => undefined));
  }

  refresh(): Observable<string> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    const refreshToken = this.storage.get<string>(APP_CONSTANTS.TOKEN.REFRESH);

    if (!refreshToken) {
      this.clearSession();
      return throwError(() => new Error('No refresh token'));
    }

    const body: RefreshRequest = { refreshToken };

    this.refreshInFlight$ = this.http
      .post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.REFRESH, body, {
        headers: new HttpHeaders({ [SKIP_LOADING_HEADER]: 'true' }),
      })
      .pipe(
        tap((response) => this.persistSession(response.data)),
        map((response) => response.data.accessToken),
        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        }),
        finalize(() => {
          this.refreshInFlight$ = null;
        }),
        shareReplay(1),
      );

    return this.refreshInFlight$;
  }

  logout(): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.AUTH.LOGOUT, {}).pipe(
      catchError(() => of(undefined)),
      finalize(() => this.clearSession()),
    );
  }

  clearSession(): void {
    this.storage.remove(APP_CONSTANTS.TOKEN.ACCESS);
    this.storage.remove(APP_CONSTANTS.TOKEN.REFRESH);
    this.authStore.clear();
  }

  hasRole(...roles: string[]): boolean {
    return this.authStore.hasRole(...roles);
  }

  private persistSession(data: LoginResponse): void {
    this.storage.set(APP_CONSTANTS.TOKEN.ACCESS, data.accessToken);
    this.storage.set(APP_CONSTANTS.TOKEN.REFRESH, data.refreshToken);
    this.authStore.setUser(data.user);
  }
}
