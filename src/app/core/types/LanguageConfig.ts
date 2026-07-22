export interface LanguageInfo {
  code: string;
  flag: string;
  nativeName: string;
  englishName: string;
}

export const LANGUAGE_CONFIG: Record<string, LanguageInfo> = {
  fr: { code: 'fr', flag: 'assets/flags/flag_fr.svg', nativeName: 'Français', englishName: 'French' },
  en: { code: 'en', flag: 'assets/flags/flag_en.svg', nativeName: 'English', englishName: 'English' },
  es: { code: 'es', flag: 'assets/flags/flag_es.svg', nativeName: 'Español', englishName: 'Spanish' },
  it: { code: 'it', flag: 'assets/flags/flag_it.svg', nativeName: 'Italiano', englishName: 'Italian' },
};