import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { FormErrorComponent } from '../form-error/form-error.component';
import { ToastService } from 'src/app/services/toast.service';

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

  login() {
    if (this.loginForm.invalid) {
      this.toastService.warning(this.transloco.translate('AUTH.RULES.FILL_ALL_FIELDS'))
      return;
    }

    this.loading = true;

    const { email, password }: { email: string, password: string } = this.loginForm.value;

    this.authService.login(email, password)
      .then(() => this.router.navigate(['/home']))
      .catch(err => {
        this.toastService.error(this.transloco.translate('AUTH.RULES.LOGIN_ERROR', { error: err.message }))
      })
      .finally(() => this.loading = false);
  }
}