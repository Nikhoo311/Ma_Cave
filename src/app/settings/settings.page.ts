import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../core/services/auth.service';
import { WINE_TYPE_CONFIG } from '../core/types/WineType';
import { DarkModeSetting, PreferencesService } from '../core/services/preferences.service';
import { Observable, map } from 'rxjs';

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
  isDarkMode$!: Observable<boolean>;

  constructor(private router: Router, private auth: AuthService, private prefs: PreferencesService) { }
  get user() {
    return this.auth.currentUser;
  }

  get favoriteWineLabelKey(): string {
    const type = this.user?.favoriteWineType;
    return type ? WINE_TYPE_CONFIG[type]?.label ?? '' : '';
  }

  ngOnInit() {
    this.isDarkMode$ = this.prefs.preferences$.pipe(
      map((p) => p.darkMode === 'dark')
    );
  }

  goToInfoPerso() {
    this.router.navigate(['/settings/personal-information']);
  }

  goToVinPrefere() {
    this.router.navigate(['/settings/favorite-wine'], { state: { favoriteWine: this.auth.currentUser?.favoriteWineType } });
  }

  async onDarkModeToggle(event: CustomEvent): Promise<void> {
    const isDark = event.detail.checked as boolean;
    const value: DarkModeSetting = isDark ? 'dark' : 'light';
    await this.prefs.setDarkMode(value);
  }

}
