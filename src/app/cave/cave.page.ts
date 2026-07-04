import { Component, OnInit } from '@angular/core';
import { CaveService } from '../core/services/cave.service';
import { UserWine } from '../core/models/wine.model';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/models/user.model';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-cave',
  templateUrl: './cave.page.html',
  styleUrls: ['./cave.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslocoModule],
})
export class CavePage implements OnInit {

  user!: User | null;

  constructor(private caveService: CaveService, private authService: AuthService,) { }

  ngOnInit() {
    this.user = this.authService.currentUser;
  }

  addWine() {
    const wine = {
    name: "Exception",
    domain: "Domaine Jean-Louis Chave",
    region: "Rhône",
    appellation: "Tavel",
    type: "white",
    grapeVariety: "Roussanne",
    vintage: 2013,
    description:"Robe jaune or aux reflets dorés. Bouquet complexe de fruits à chair blanche, de miel et de pain grillé. Bouche riche et ample, belle longueur.",

    foodPairing: [
        "Carpaccio de saint-jacques",
        "Huîtres",
        "Sushi"
      ],
      isCustom: true,
      rating: 1.2,
      unitPrice: 15,
      ownerId: this.user?.id,
      placements: [ {col: 2, row: 1}]
  } as UserWine;
    this.caveService.addWine(wine)
  }
}
