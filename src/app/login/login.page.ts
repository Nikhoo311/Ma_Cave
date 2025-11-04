import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private auth: AuthService, private router: Router, private toastCtrl: ToastController) {}

  async login() {
    try {
      await this.auth.login(this.email, this.password);
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

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}