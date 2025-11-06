import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  templateUrl: './register-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TranslocoModule
  ],
})
export class RegisterFormComponent {
  registerForm!: FormGroup;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private toastCtrl: ToastController, private transloco: TranslocoService) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator(control: AbstractControl) {
    const password: string = control.get('password')?.value;
    const confirmPassword: string = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async register() {
    let message: string = this.transloco.translate('AUTH.RULES.FILL_ALL_FIELDS');
    if (this.registerForm.hasError('passwordMismatch')) {
      message = this.transloco.translate('AUTH.RULES.SAME_PASSWORD');
    }

    if (this.registerForm.invalid) {
      const toast = await this.toastCtrl.create({
        message,
        duration: 2500,
        color: 'warning'
      });
      toast.present();
      return;
    }

    this.loading = true;
    const { email, password } = this.registerForm.value;

    this.authService.register(email, password)
      .then(() => this.router.navigate(['/home']))
      .catch(async err => {
        let errorMessage: string = this.transloco.translate('AUTH.RULES.REGISTER_ERROR', { error: err.message });
        if (err.code === 'auth/email-already-in-use') {
          errorMessage = this.transloco.translate('AUTH.RULES.EMAIL_ALREADY_TAKEN');
        }

        const toast = await this.toastCtrl.create({
          message: errorMessage,
          duration: 2500,
          color: 'danger'
        });
        toast.present();
      })
      .finally(() => this.loading = false);
  }
}