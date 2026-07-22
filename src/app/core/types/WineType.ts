export type WineType = 'white' | 'red' | 'rose' | 'champagne';

type GradientColor = "base" | "accent";

export interface WineTypeConfig {
  icon: string;
  label: string;
  gradientColor: GradientColor;
}

export const WINE_TYPE_CONFIG: Record<WineType, WineTypeConfig> = {
  red: {
    icon: 'assets/bottle_red.svg',
    label: 'WINE.TYPE.RED',
    gradientColor: "accent",
  },
  white: {
    icon: 'assets/bottle_white.svg',
    label: 'WINE.TYPE.WHITE',
    gradientColor: "accent",
  },
  rose: {
    icon: 'assets/bottle_rose.svg',
    label: 'WINE.TYPE.ROSE',
    gradientColor: "accent",
  },
  champagne: {
    icon: 'assets/bottle_champagne.svg',
    label: 'WINE.TYPE.CHAMPAGNE',
    gradientColor: "base",
  },
};

export const CAVE_MAX = 24;
export const CAVE_MAX_PRENIUM = 240;