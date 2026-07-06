import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';
import { FavoriteWinePage } from './favorite-wine/favorite-wine.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'favorite-wine',
    component: FavoriteWinePage
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
