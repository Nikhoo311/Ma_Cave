import { Component, Input } from '@angular/core';
import { AuthTypeEnum } from '../types/AuthTypeEnum';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { RegisterFormComponent } from '../components/register-form/register-form.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.page.html',
  imports: [
    CommonModule,
    IonicModule,
    TranslocoModule,
    LoginFormComponent,
    RegisterFormComponent
  ]
})
export class AuthPage {
  @Input() mode: string = AuthTypeEnum.LOGIN;
  AuthTypeEnum = AuthTypeEnum;

  constructor() {}

  switchMode() {
    this.mode = this.mode === AuthTypeEnum.LOGIN
      ? AuthTypeEnum.REGISTER
      : AuthTypeEnum.LOGIN;
  }
}