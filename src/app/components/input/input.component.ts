import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';
import { FormErrorComponent } from '../form-error/form-error.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, TranslocoModule, FormErrorComponent],
  templateUrl: './input.component.html',
})
export class InputComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) control!: AbstractControl | null;

  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() iconName = '';
  @Input() showIcon = false;
}