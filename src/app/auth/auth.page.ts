import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, SegmentCustomEvent } from '@ionic/angular';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { UtilsComponent } from '../components/utils/utils.component';
import { AuthTypeEnum } from '../types/AuthTypeEnum';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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
  loading: boolean = false;
  constructor(
    private transloco: TranslocoService,
    private toastService: ToastService, 
    private authService: AuthService,
    private router: Router
  ) {}

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

  async loginWithGoogle() {
    this.loading = true;

    if (this.mode === AuthTypeEnum.LOGIN) {
      await this.authService.loginWithGoogle()
        .then(() => this.router.navigate(['/home']))
        .catch(err => {
          this.toastService.error(this.transloco.translate(err.message ?? 'AUTH.GOOGLE_ERROR'));
        })
        .finally(() => this.loading = false);
    } else {
      await this.authService.registerWithGoogle()
        .then(() => this.router.navigate(['/home']))
        .catch(err => {
          this.toastService.error(this.transloco.translate(err.message ?? 'AUTH.GOOGLE_ERROR'));
        })
        .finally(() => this.loading = false);
    }
  }
}