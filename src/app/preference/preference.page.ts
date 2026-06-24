import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';
import { InputComponent } from '../components/input/input.component';
import { StepperComponent } from '../components/stepper/stepper.component';
import { CAVE_MAX, WINE_TYPE_CONFIG, WineType } from '../types/WineType';
import { RadioGroupComponent } from "../components/wines-radio-group/wines-radio-group.component";

@Component({
  selector: 'app-preference',
  standalone: true,
  templateUrl: './preference.page.html',
  styleUrls: ['./preference.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TranslocoModule,
    ReactiveFormsModule,
    InputComponent,
    StepperComponent,
    RadioGroupComponent
  ],
})
export class PreferencePage {
  currentStep: number = 0;
  readonly CAVE_MAX: number = CAVE_MAX;

  identityForm: FormGroup = this.fb.group({
    prenom: ['', [Validators.required, Validators.minLength(1)]],
    nom:    ['', [Validators.required, Validators.minLength(1)]],
  });

  wineForm: FormGroup = this.fb.group({
    selectedType: [null as WineType | null, Validators.required],
  });

  caveForm: FormGroup = this.fb.group({
    rows: [5, [Validators.required, Validators.min(1)]],
    cols: [3, [Validators.required, Validators.min(1)]],
  });

  constructor(private fb: FormBuilder, private router: Router) {}

  // ── Getters ────────────────────────────────────────────────

  get rowsControl(): FormControl { return this.caveForm.get('rows') as FormControl; }
  get colsControl(): FormControl { return this.caveForm.get('cols') as FormControl; }

  get rows(): number { return this.rowsControl.value ?? 1; }
  get cols(): number { return this.colsControl.value ?? 1; }

  get prenomValue(): string  { return this.identityForm.get('prenom')?.value ?? ''; }
  get nomValue(): string     { return this.identityForm.get('nom')?.value ?? ''; }
  get selectedType(): WineType | null { return this.wineForm.get('selectedType')?.value ?? null; }
  get typeLabel(): string    { return this.selectedType ? WINE_TYPE_CONFIG[this.selectedType].label : '—'; }

  get step1Valid(): boolean { return this.identityForm.valid; }
  get step2Valid(): boolean { return this.wineForm.valid; }

  // ── La contrainte MAX est gérée ici, pas dans le stepper ─────────────

  get rowsMax(): number { return Math.floor(this.CAVE_MAX / Math.max(this.cols, 1)); }
  get colsMax(): number { return Math.floor(this.CAVE_MAX / Math.max(this.rows, 1)); }

  // ── Navigation ───────────────────────────────────────────────────────

  goToStep(step: number): void { this.currentStep = step; }

  finishOnboarding(): void {
    if (this.identityForm.invalid || this.wineForm.invalid || this.caveForm.invalid) return;
    console.log(this.wineForm.getRawValue(), this.caveForm.getRawValue(), this.identityForm.getRawValue())
    this.goToStep(4);
  }

  goToCave(): void { this.router.navigate(['/tabs/cave']); }
}