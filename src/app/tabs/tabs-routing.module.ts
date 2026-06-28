import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadComponent: () => import("../home/home.module").then(m => m.HomePageModule),
      },
      {
        path: 'cave',
        canActivate: [AuthGuard],
        loadComponent: () => import("../home/home.module").then(m => m.HomePageModule),
      },
      {
        path: 'stats',
        canActivate: [AuthGuard],
        loadComponent: () => import("../home/home.module").then(m => m.HomePageModule),
      },
      {
        path: 'settings',
        canActivate: [AuthGuard],
        loadComponent: () => import("../home/home.module").then(m => m.HomePageModule),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
