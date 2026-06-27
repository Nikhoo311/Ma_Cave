import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';
import { WINE_TYPE_CONFIG } from 'src/app/core/types/WineType';

export interface RadioOption {
  value: string;
  label: string;
  icon?: string;
  bubbles?: boolean;
  backgroundColor?: string;
}

@Component({
  selector: 'app-wines-radio-group',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TranslocoModule,
],
  templateUrl: './wines-radio-group.component.html',
  styleUrls: ['./wines-radio-group.component.scss']
})
export class RadioGroupComponent {

  @Input({ required: true }) control!: AbstractControl | null;

  readonly options: RadioOption[] = Object.entries(WINE_TYPE_CONFIG).map(
    ([value, config]) => ({
      value,
      label: config.label,
      icon: config.icon,
      backgroundColor: `color-mix(in srgb, var(--wine-${value}) 60%, transparent)`
    })
  );

  constructor () {}

  select(value: string): void {
    this.control?.setValue(value);
    this.control?.markAsTouched();
  }

  isSelected(value: string): boolean {
    return this.control?.value === value;
  }
}