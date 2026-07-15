export interface LanguageInfo {
  code: string;
  flag: string;
  nativeName: string;
  englishName: string;
}

export const LANGUAGE_CONFIG: Record<string, LanguageInfo> = {
  fr: { code: 'fr', flag: '🇫🇷', nativeName: 'Français', englishName: 'French' },
  en: { code: 'en', flag: '🇬🇧', nativeName: 'English', englishName: 'English' },
  es: { code: 'es', flag: '🇪🇸', nativeName: 'Español', englishName: 'Spanish' },
  it: { code: 'it', flag: '🇮🇹', nativeName: 'Italiano', englishName: 'Italian' },
};