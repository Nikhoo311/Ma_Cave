import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreferencePageRoutingModule } from './preference-routing.module';
import { TranslocoModule } from '@jsverse/transloco';
import { PreferencePage } from './preference.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreferencePageRoutingModule,
    TranslocoModule,
    PreferencePage,
  ],
})
export class PreferencePageModule {}
