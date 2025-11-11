import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { FormErrorComponent } from '../form-error/form-error.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TranslocoModule,
    FormErrorComponent
  ],
})
export class LoginFormComponent {
  loginForm: FormGroup;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private toastCtrl: ToastController, private transloco: TranslocoService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      const toast = await this.toastCtrl.create({
        message: this.transloco.translate('AUTH.RULES.FILL_ALL_FIELDS'),
        duration: 2500,
        color: 'warning'
      });
      toast.present();
      return;
    }

    this.loading = true;

    const { email, password }: { email: string, password: string } = this.loginForm.value;

    this.authService.login(email, password)
      .then((_) => this.router.navigate(['/home']))
      .catch(async err => {
        const toast = await this.toastCtrl.create({
          message: this.transloco.translate('AUTH.RULES.LOGIN_ERROR', { error: err.message }),
          duration: 2500,
          color: 'danger'
        });
        toast.present();
      })
      .finally(() => this.loading = false);
  }
}