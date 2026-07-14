import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DEFAULT_TOAST_DURATION, TOAST_CONFIG, ToastType, ToastTypeConfig } from '../types/ToastType';
import { closeOutline } from 'ionicons/icons';

@Injectable({
  providedIn: 'root'
})

export class ToastService {
  constructor(private toastCtrl: ToastController) {}
  
  private showToast(type: ToastType, message: string, duration: number = DEFAULT_TOAST_DURATION) {
    const cfg: ToastTypeConfig = TOAST_CONFIG[type];
    this.toastCtrl.create({
      message,
      duration: duration,
      color: cfg.color,
      icon: cfg.icon,
      position: 'bottom',
      buttons: [{ icon: closeOutline, role: 'cancel' }]
    }).then(toast => toast.present());
  }

  success(message: string) { this.showToast('success', message); }
  error(message: string) { this.showToast('error', message); }
  warning(message: string) { this.showToast('warning', message); }
  info(message: string) { this.showToast('info', message, 4000); }
}