// custom-modal.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class CustomModalComponent {
  @Input() isOpen = false;
  @Input() initialBreakpoint: number = 0.95;
  @Input() breakpoints: number[] = [0, 0.5, 0.7, 0.95];
  @Input() background: string | null = null;
  @Input() showCloseButton = true;

  @Output() didDismiss = new EventEmitter<void>();

  handleDidDismiss(): void {
    this.isOpen = false;
    this.didDismiss.emit();
  }
}