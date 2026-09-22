import { Routes } from '@angular/router';
import { guestGuard } from './core/auth/guest.guard';
import { tenantResolver } from './core/tenant/tenant.resolver';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/tenant/login/login').then((m) => m.TenantLoginPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/tenant/forgot-password/forgot-password').then(
        (m) => m.TenantForgotPasswordPage,
      ),
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'store/:tenantSlug',
    resolve: { tenant: tenantResolver },
    loadChildren: () =>
      import('./features/storefront/storefront.routes').then((m) => m.STOREFRONT_ROUTES),
  },
  {
    path: 'admin',
    // TODO: re-enable authGuard once login is fully integrated
    // canActivate: [authGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
