import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-stepper',
  standalone: true,
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class StepperComponent implements OnInit {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) label!: string;
  @Input() min: number = 1;
  @Input() max: number = 999;
  @Input() step: number = 1;

  value = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.value = this.control.value ?? this.min;

    this.control.valueChanges.subscribe(v => {
      this.value = v ?? this.min;
      this.cdr.markForCheck();
    });
  }

  decrement(): void {
    if (this.value - this.step < this.min) return;
    this.control.setValue(this.value - this.step);
    this.control.markAsDirty();
  }

  increment(): void {
    if (this.value + this.step > this.max) return;
    this.control.setValue(this.value + this.step);
    this.control.markAsDirty();
  }
}