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
      {
        path: 'roles/new',
        loadComponent: () =>
          import('./pages/role-management/user-role-create/user-role-create').then(
            (m) => m.UserRoleCreatePage,
          ),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./pages/role-management/user-role-list/user-role-list').then(
            (m) => m.UserRoleListPage,
          ),
      },
      {
        path: 'tenant-roles/new',
        loadComponent: () =>
          import('./pages/role-management/tenant-role-create/tenant-role-create').then(
            (m) => m.TenantRoleCreatePage,
          ),
      },
      {
        path: 'tenant-roles',
        loadComponent: () =>
          import('./pages/role-management/tenant-role-list/tenant-role-list').then(
            (m) => m.TenantRoleListPage,
          ),
      },
    ],
  },
];
