import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { AuthPageRoutingModule } from './auth-routing.module';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthPage } from './auth.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    TranslocoModule,
    AuthPage
  ]
})
export class AuthPageModule {}
