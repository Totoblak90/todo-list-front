import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserNotLoggedGuard } from './guards/user-not-logged.guard';
import { UserIsLoggedGuard } from './guards/user-is-logged.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [UserIsLoggedGuard],
    canLoad: [UserIsLoggedGuard],
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    canActivate: [UserIsLoggedGuard],
    canLoad: [UserIsLoggedGuard],
    loadChildren: () =>
      import('./pages/register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'dashboard',
    canActivate: [UserNotLoggedGuard],
    canLoad: [UserNotLoggedGuard],
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
