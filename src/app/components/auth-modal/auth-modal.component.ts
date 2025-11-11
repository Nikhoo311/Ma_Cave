import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../login-form/login-form.component';
import { RegisterFormComponent } from '../register-form/register-form.component';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthTypeEnum } from 'src/app/types/AuthTypeEnum';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  templateUrl: './auth-modal.component.html',
  imports: [
    CommonModule,
    IonicModule,
    TranslocoModule,
    LoginFormComponent,
    RegisterFormComponent
  ],
})
export class AuthModalComponent {
  @Input() mode: string = AuthTypeEnum.LOGIN;
  AuthTypeEnum = AuthTypeEnum;
  
  constructor() {}

  switchMode() {
    this.mode = this.mode === AuthTypeEnum.LOGIN ? AuthTypeEnum.REGISTER : AuthTypeEnum.LOGIN;
  }
}