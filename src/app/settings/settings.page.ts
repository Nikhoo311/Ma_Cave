import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../core/services/auth.service';
import { WINE_TYPE_CONFIG } from '../core/types/WineType';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TranslocoModule
  ],
})
export class SettingsPage implements OnInit {
  readonly WINE_TYPE_CONFIG = WINE_TYPE_CONFIG;

  constructor(private router: Router, private auth: AuthService) { }
  get user() {
    return this.auth.currentUser;
  }

  get favoriteWineLabelKey(): string {
    const type = this.user?.favoriteWineType;
    return type ? WINE_TYPE_CONFIG[type]?.label ?? '' : '';
  }

  ngOnInit() {
  }

  goToInfoPerso() {
    this.router.navigate(['/settings/informations-personnelles']);
  }

  goToVinPrefere() {
    this.router.navigate(['/settings/favorite-wine'], { state: { favoriteWine: this.auth.currentUser?.favoriteWineType } });
  }

}
