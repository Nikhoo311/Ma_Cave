import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';

import { AuthTypeEnum } from '../../core/types/AuthTypeEnum';
import { LoginFormComponent } from '../login-form/login-form.component';
import { RegisterFormComponent } from '../register-form/register-form.component';

@Component({
  selector: 'app-utils',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TranslocoModule,
    LoginFormComponent,
    RegisterFormComponent
  ],
  templateUrl: './utils.component.html'
})
export class UtilsComponent {
  @Input() mode: string = AuthTypeEnum.LOGIN;

  AuthTypeEnum = AuthTypeEnum;

  switchMode() {
    this.mode =
      this.mode === AuthTypeEnum.LOGIN
        ? AuthTypeEnum.REGISTER
        : AuthTypeEnum.LOGIN;
  }
}