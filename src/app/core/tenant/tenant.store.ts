import { Injectable, signal } from '@angular/core';
import { Tenant } from './tenant.model';

@Injectable({
  providedIn: 'root',
})
export class TenantStore {
  private readonly _tenant = signal<Tenant | null>(null);

  readonly tenant = this._tenant.asReadonly();

  setTenant(tenant: Tenant): void {
    this._tenant.set(tenant);
  }

  clear(): void {
    this._tenant.set(null);
  }
}
