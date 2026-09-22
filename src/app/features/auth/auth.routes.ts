import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin/login',
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'admin/register',
    loadComponent: () => import('./admin/register/register').then((m) => m.RegisterPage),
  },
  {
    path: 'admin/forgot-password',
    loadComponent: () =>
      import('./admin/forgot-password/forgot-password').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'tenant/register',
    loadComponent: () =>
      import('./tenant/register/register').then((m) => m.TenantRegisterPage),
  },
  {
    path: 'tenant/login',
    loadComponent: () =>
      import('./tenant/login/login').then((m) => m.TenantLoginPage),
  },
  {
    path: 'tenant/forgot-password',
    loadComponent: () =>
      import('./tenant/forgot-password/forgot-password').then((m) => m.TenantForgotPasswordPage),
  },
];
