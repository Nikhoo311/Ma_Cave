import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { InputComponent } from "../input/input.component";

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
    InputComponent
],
})
export class LoginFormComponent {
  loginForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private toastService: ToastService, 
    private transloco: TranslocoService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      this.toastService.warning(this.transloco.translate('AUTH.RULES.FILL_ALL_FIELDS'))
      return;
    }

    this.loading = true;

    const { email, password }: { email: string, password: string } = this.loginForm.value;

    await this.authService.login(email, password)
      .then(() => this.router.navigate(['/home']))
      .catch(err => {
        this.toastService.error(this.transloco.translate(err.message))
      })
      .finally(() => this.loading = false);
  }

  async forgotPassword() {
    const email = this.loginForm.get('email')?.value?.trim();

    if (!email) {
      await this.toastService.error(this.transloco.translate('AUTH.FORGOT_PASSWORD_EMAIL_REQUIRED'));
      return;
    }

    try {
      await this.authService.sendPasswordResetEmail(email);
      await this.toastService.success(this.transloco.translate('AUTH.FORGOT_PASSWORD_SUCCESS'));

    } catch (error) {
      await this.toastService.error(this.transloco.translate('AUTH.FORGOT_PASSWORD_ERROR'));
    }
  }
}