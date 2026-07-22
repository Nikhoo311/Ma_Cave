import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PreferencesService } from 'src/app/core/services/preferences.service';
import { LANGUAGE_CONFIG, LanguageInfo } from 'src/app/core/types/LanguageConfig';

@Component({
  selector: 'app-language',
  standalone: true,
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
  imports: [CommonModule, IonicModule, TranslocoModule],
})
export class LanguagePage implements OnInit {
  languages: LanguageInfo[] = [];
  selectedLanguage = '';

  constructor(
    private transloco: TranslocoService,
    private prefs: PreferencesService,
    private location: Location,
  ) {}

  ngOnInit() {
    const availableLangs = this.transloco.getAvailableLangs() as string[];
    this.languages = availableLangs
      .map((code) => LANGUAGE_CONFIG[code])
      .filter((lang): lang is LanguageInfo => !!lang);

    this.selectedLanguage = this.prefs.current.language;
  }

  async selectLanguage(code: string) {
    this.selectedLanguage = code;
    await this.prefs.setLanguage(code);
  }

  goBack() {
    this.location.back();
  }
}