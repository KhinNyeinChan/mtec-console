import { Injectable } from '@angular/core';
import { Tenant } from '../tenant/tenant.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  apply(tenant: Tenant): void {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', tenant.primaryColor);
    root.setAttribute('data-tenant', tenant.slug);
  }

  reset(): void {
    const root = document.documentElement;
    root.style.removeProperty('--primary-color');
    root.removeAttribute('data-tenant');
  }
}
