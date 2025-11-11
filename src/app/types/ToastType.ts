import { PredefinedColors } from "@ionic/core";
import { checkmarkCircleOutline, closeCircleOutline, alertCircleOutline, informationCircleOutline } from 'ionicons/icons'

export interface ToastTypeConfig {
  color: PredefinedColors;
  icon: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export const DEFAULT_TOAST_DURATION = 2500;

export const TOAST_CONFIG: Record<ToastType, ToastTypeConfig> = {
  success: { color: 'success', icon: checkmarkCircleOutline },
  error: { color: 'danger', icon: closeCircleOutline },
  warning: { color: 'warning', icon: alertCircleOutline },
  info: { color: 'primary', icon: informationCircleOutline }
};