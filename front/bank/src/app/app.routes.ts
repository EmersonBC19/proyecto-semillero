import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard } from './core/gaurds/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component'),
    children: [
      {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./auth/login/login.component'),
      },
      {
        path: 'register',
        title: 'Register',
        loadComponent: () => import('./auth/register/register.component'),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'user',
    loadComponent: () => import('./user/user.component'),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        title: 'Perfil',
        loadComponent: () => import('./user/profile/profile.component'),
      },
      {
        path: 'transactions',
        title: 'Transferencias',
        loadComponent: () =>
          import('./user/transactions/transactions.component'),
      },
      {
        path: 'withdrawls',
        title: 'Retiros',
        loadComponent: () => import('./user/retiros/retiros.component'),
      },
      {
        path: 'deposits',
        title: 'Depositos',
        loadComponent: () => import('./user/depositos/depositos.component'),
      },

      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component'),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'auditoria',
        title: 'Auditoria',
        loadComponent: () => import('./admin/auditoria/auditoria.component'),
      },
      {
        path: 'usuarios',
        title: 'Usuarios',
        loadComponent: () => import('./admin/usuarios/usuarios.component'),
      },
    ],
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
];
