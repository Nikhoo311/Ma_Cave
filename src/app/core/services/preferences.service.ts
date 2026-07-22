import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

export type DarkModeSetting = 'light' | 'dark' | 'system';

export interface AppPreferences {
  darkMode: DarkModeSetting;
  language: string;
  notificationsEnabled: boolean;
}

const DEFAULT_PREFERENCES: AppPreferences = {
  darkMode: 'light',
  language: 'fr',
  notificationsEnabled: false,
};

const KEYS = {
  darkMode: 'darkMode',
  language: 'language',
  notificationsEnabled: 'notificationsEnabled',
} as const;

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private preferencesSubject = new BehaviorSubject<AppPreferences>(DEFAULT_PREFERENCES);
  public preferences$ = this.preferencesSubject.asObservable();

  private systemDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor(private transloco: TranslocoService) {}

  get current(): AppPreferences {
    return this.preferencesSubject.value;
  }

  async init(): Promise<AppPreferences> {
    const [darkMode, language, notificationsEnabled] = await Promise.all([
      Preferences.get({ key: KEYS.darkMode }),
      Preferences.get({ key: KEYS.language }),
      Preferences.get({ key: KEYS.notificationsEnabled }),
    ]);

    const loaded: AppPreferences = {
      darkMode: (darkMode.value as DarkModeSetting) ?? DEFAULT_PREFERENCES.darkMode,
      language: language.value ?? DEFAULT_PREFERENCES.language,
      notificationsEnabled: notificationsEnabled.value != null
        ? notificationsEnabled.value === 'true'
        : DEFAULT_PREFERENCES.notificationsEnabled,
    };

    this.preferencesSubject.next(loaded);
    this.transloco.setActiveLang(loaded.language);
    this.applyDarkMode(loaded.darkMode);

    this.systemDarkMediaQuery.addEventListener('change', () => {
      if (this.current.darkMode === 'system') {
        this.applyDarkMode('system');
      }
    });

    return loaded;
  }

  async setDarkMode(value: DarkModeSetting): Promise<void> {
    await Preferences.set({ key: KEYS.darkMode, value });
    this.preferencesSubject.next({ ...this.current, darkMode: value });
    this.applyDarkMode(value);
  }

  async setLanguage(value: string): Promise<void> {
    await Preferences.set({ key: KEYS.language, value });
    this.preferencesSubject.next({ ...this.current, language: value });
    this.transloco.setActiveLang(value);
  }

  async setNotificationsEnabled(value: boolean): Promise<void> {
    await Preferences.set({ key: KEYS.notificationsEnabled, value: String(value) });
    this.preferencesSubject.next({ ...this.current, notificationsEnabled: value });
  }

  private applyDarkMode(value: DarkModeSetting): void {
    const isDark = value === 'dark' ||
      (value === 'system' && this.systemDarkMediaQuery.matches);
    document.body.classList.toggle('dark', isDark);
  }
}