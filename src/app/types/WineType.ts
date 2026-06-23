export type WineType = 'white' | 'red' | 'rosé' | 'champagne';

export interface WineTypeConfig {
  icon: string;
  label: string;
}

export const WINE_TYPE_CONFIG: Record<WineType, WineTypeConfig> = {
  red: {
    icon: 'assets/bottle_red.svg',
    label: 'WINE.TYPE.RED',
  },
  white: {
    icon: 'assets/bottle_white.svg',
    label: 'WINE.TYPE.WHITE',
  },
  'rosé': {
    icon: 'assets/bottle_rose.svg',
    label: 'WINE.TYPE.ROSE',
  },
  champagne: {
    icon: 'assets/bottle_champagne.svg',
    label: 'WINE.TYPE.CHAMPAGNE',
  },
};