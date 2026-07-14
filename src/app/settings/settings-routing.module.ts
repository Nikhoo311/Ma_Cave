import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';
import { FavoriteWinePage } from './favorite-wine/favorite-wine.page';
import { PersonalInformationPage } from './personal-information/personal-information.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'favorite-wine',
    component: FavoriteWinePage
  },
  {
    path: 'personal-information',
    component: PersonalInformationPage
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
