import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  email: string = '';
  password: string = '';

  constructor(private auth: AuthService, private router: Router, private toastCtrl: ToastController) {}

  async register() {
    try {
      await this.auth.register(this.email, this.password);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error: any) {
      const toast = await this.toastCtrl.create({
        message: error.message,
        duration: 2500,
        color: 'danger'
      });
      toast.present();
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}