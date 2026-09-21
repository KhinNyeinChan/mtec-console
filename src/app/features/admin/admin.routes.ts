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
    ],
  },
];
