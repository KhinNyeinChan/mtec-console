import { Routes } from '@angular/router';
import { StorefrontShell } from '../../layouts/storefront/storefront-shell/storefront-shell';

export const STOREFRONT_ROUTES: Routes = [
  {
    path: '',
    component: StorefrontShell,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.StorefrontDashboardPage),
      },
    ],
  },
];
