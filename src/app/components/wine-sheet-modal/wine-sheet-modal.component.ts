import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';
import { UserWine } from '../../core/models/wine.model';
import { WINE_TYPE_CONFIG } from '../../core/types/WineType';
import { CaveService } from 'src/app/core/services/cave.service';

@Component({
  selector: 'app-wine-sheet-modal',
  templateUrl: './wine-sheet-modal.component.html',
  styleUrls: ['./wine-sheet-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslocoModule]
})
export class WineSheetModalComponent {
  @Input({ required: true }) canRemoveBottle: boolean = false;
  @Input({ required: true }) wine: UserWine | null = null;
  @Input() isOpen = false;
  @Input() coords: { row: number; col: number } | null = null;
  @Output() isOpenChange = new EventEmitter<boolean>();

  readonly WINE_TYPE_CONFIG = WINE_TYPE_CONFIG;

  constructor(private caveService: CaveService) {}

  get formattedPlacements(): string[] {
    if (!this.wine?.placements) return [];
    return this.wine.placements.map(placement => this.caveService.formatPlacementCoords(placement)).sort();
  }

  closeModal() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  async removeBottle(cords: { row: number; col: number }) {
    if (!this.wine || !this.wine.id) return;

    await this.caveService.removeBottle(this.wine.id, cords);

    this.closeModal();
  }
}