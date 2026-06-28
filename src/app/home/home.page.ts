import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../core/models/user.model';
import { CaveService } from '../core/services/cave.service';
import { WINE_TYPE_CONFIG, WineType } from '../core/types/WineType';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslocoModule],
})

export class HomePage implements OnInit {
  user!: User | null;
  totalBottles!: number;
  totalValue!: number;
  distributionByType!: Record<WineType, number>;
  readonly WINE_TYPE_CONFIG = WINE_TYPE_CONFIG;

  constructor(
    private authService: AuthService,
    private router: Router,
    private caveService: CaveService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.totalBottles = this.caveService.totalBottles;
    this.totalValue = this.caveService.totalValue;

    const allTypes = Object.keys(WINE_TYPE_CONFIG);
    this.distributionByType = this.caveService.getDistributionBy('type', allTypes);
  }

  distributionEntries(): [WineType, number][] {
    return Object.entries(this.distributionByType) as [WineType, number][];
  }
  
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
