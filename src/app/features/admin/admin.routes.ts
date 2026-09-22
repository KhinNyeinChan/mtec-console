import { Routes } from '@angular/router';
import { AdminShell } from '../../layouts/admin/admin-shell/admin-shell';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminShell,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.AdminDashboardPage),
      },
      {
        path: 'tenants/new',
        loadComponent: () =>
          import('./pages/tenant-management/tenant-create/tenant-create').then(
            (m) => m.TenantCreatePage,
          ),
      },
      {
        path: 'tenants',
        loadComponent: () =>
          import('./pages/tenant-management/tenant-list/tenant-list').then((m) => m.TenantListPage),
      },
    ],
  },
];
