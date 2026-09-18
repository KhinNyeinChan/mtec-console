import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { APP_CONSTANTS } from '../constants/app.constants';
import { SKIP_LOADING_HEADER } from '../http/loading.interceptor';
import { ApiResponse } from '../models/api-response.model';
import { StorageService } from '../services/storage.service';
import { ThemeService } from '../services/theme.service';
import { Tenant } from './tenant.model';
import { TenantStore } from './tenant.store';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private readonly http = inject(HttpClient);
  private readonly tenantStore = inject(TenantStore);
  private readonly storage = inject(StorageService);
  private readonly theme = inject(ThemeService);

  readonly tenant = this.tenantStore.tenant;

  hydrate(): void {
    const stored = this.storage.get<Tenant>(APP_CONSTANTS.TENANT.CURRENT);

    if (stored) {
      this.applyTenant(stored);
    }
  }

  loadBySlug(slug: string): Observable<Tenant> {
    return this.http
      .get<ApiResponse<Tenant>>(API_ENDPOINTS.TENANT.BY_SLUG(slug), {
        headers: new HttpHeaders({ [SKIP_LOADING_HEADER]: 'true' }),
      })
      .pipe(
        tap((response) => this.applyTenant(response.data)),
        map((response) => response.data),
      );
  }

  loadCurrent(): Observable<Tenant> {
    return this.http.get<ApiResponse<Tenant>>(API_ENDPOINTS.TENANT.CURRENT).pipe(
      tap((response) => this.applyTenant(response.data)),
      map((response) => response.data),
    );
  }

  setTenant(tenant: Tenant): void {
    this.applyTenant(tenant);
  }

  getTenant(): Tenant | null {
    return this.tenantStore.tenant();
  }

  getTenantId(): string | null {
    return this.tenantStore.tenant()?.id ?? null;
  }

  clearTenant(): void {
    this.tenantStore.clear();
    this.storage.remove(APP_CONSTANTS.TENANT.CURRENT);
    this.theme.reset();
  }

  private applyTenant(tenant: Tenant): void {
    this.tenantStore.setTenant(tenant);
    this.storage.set(APP_CONSTANTS.TENANT.CURRENT, tenant);
    this.theme.apply(tenant);
  }
}
