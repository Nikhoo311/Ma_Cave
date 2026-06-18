import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, SegmentCustomEvent } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';

import { UtilsComponent } from '../components/utils/utils.component';
import { AuthTypeEnum } from '../types/AuthTypeEnum';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TranslocoModule,
    UtilsComponent
  ]
})
export class AuthPage {
  @Input() mode: string = AuthTypeEnum.LOGIN;
  protected readonly AuthTypeEnum = AuthTypeEnum;

  constructor() {}

  switchMode() {
    this.mode =
      this.mode === AuthTypeEnum.LOGIN
        ? AuthTypeEnum.REGISTER
        : AuthTypeEnum.LOGIN;
  }

    onModeChange(event: SegmentCustomEvent) {
    if (event.detail.value) {
      this.mode = event.detail.value as AuthTypeEnum;
    }
  }
}