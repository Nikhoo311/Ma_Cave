import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../core/services/auth.service';
import { WINE_TYPE_CONFIG } from '../core/types/WineType';
import { DarkModeSetting, PreferencesService } from '../core/services/preferences.service';
import { Observable, map } from 'rxjs';
import { LANGUAGE_CONFIG } from '../core/types/LanguageConfig';
import { CaveView } from '../core/models/user.model';

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

  selectedView: CaveView = 'grid';
  notificationsEnabled$!: Observable<boolean>;

  constructor(private router: Router, private auth: AuthService, private prefs: PreferencesService) { }
  get user() {
    return this.auth.currentUser;
  }

  get caveConfig() {
    return this.user?.caveConfig;
  }

  get maxSlots(): number {
    return (this.caveConfig?.cols ?? 0) * (this.caveConfig?.rows ?? 0);
  }

  get favoriteWineLabelKey(): string {
    const type = this.user?.favoriteWineType;
    return type ? WINE_TYPE_CONFIG[type]?.label ?? '' : '';
  }

  get selectedLangague(): string {
    return LANGUAGE_CONFIG[this.prefs.current.language].nativeName;
  }

  ngOnInit() {
    this.isDarkMode$ = this.prefs.preferences$.pipe(map((p) => p.darkMode === 'dark'));
    this.notificationsEnabled$ = this.prefs.preferences$.pipe(map((p) => p.notificationsEnabled));
    this.selectedView = this.auth.currentUser?.caveConfig?.viewMode ?? 'grid';
  }


  openDispositionSheet() {
    // ouverture de l'ion-modal / bottom sheet de disposition (stepper rangées/colonnes)
  }

  onViewChange(event: CustomEvent) {
    this.selectedView = event.detail.value as CaveView;
    // persister le choix (Firestore ou @capacitor/preferences selon ce que tu veux)
  }

  onNotificationsToggle(event: CustomEvent) {
    const isEnabled = event.detail.checked as boolean;
    this.prefs.setNotificationsEnabled(isEnabled);
  }

  goToInfoPerso() {
    this.router.navigate(['/settings/personal-information']);
  }

  goToVinPrefere() {
    this.router.navigate(['/settings/favorite-wine'], { state: { favoriteWine: this.auth.currentUser?.favoriteWineType } });
  }
  
  goToLanguage() {
    this.router.navigate(['/settings/language']);
  }

  async onDarkModeToggle(event: CustomEvent): Promise<void> {
    const isDark = event.detail.checked as boolean;
    const value: DarkModeSetting = isDark ? 'dark' : 'light';
    await this.prefs.setDarkMode(value);
  }

}
