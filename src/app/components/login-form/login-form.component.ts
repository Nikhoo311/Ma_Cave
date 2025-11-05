import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslocoModule
  ],
})
export class LoginFormComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private toastCtrl: ToastController) {}

  async login() {
    this.loading = true;
      this.authService.login(this.email, this.password).then((_) => this.router.navigate(["/home"])).catch(async err => {
        const toast = await this.toastCtrl.create({
          message: err.message,
          duration: 2500,
          color: 'danger'
        });
        toast.present();
        this.loading = false;
      });
  }
}