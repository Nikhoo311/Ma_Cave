import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserWine } from '../models/wine.model';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CaveService {

  constructor(private authService: AuthService, private firestore: Firestore) {}

	async updateCave(userId: string, newCave: UserWine[]): Promise<void> {
		try {
			const userRef = doc(this.firestore, 'users', userId);
			await updateDoc(userRef, {
				cave: newCave
			});
		} catch (error) {
			console.error("Erreur lors de la mise à jour de la cave :", error);
			throw error;
		}
	}

  get cave(): UserWine[] {
    return this.authService.currentUser?.cave || [];
  }

  get caveConfig() {
    return this.authService.currentUser?.caveConfig || { rows: 0, cols: 0 };
  }

  get totalBottles(): number {
    return this.cave.reduce((total, wine) => total + wine.placements.length, 0);
  }

	getDistributionBy(property: keyof UserWine, possibleValues: string[] = []): Record<string, number> {
		const initialDist: Record<string, number> = possibleValues.reduce((acc, val) => {
			acc[val] = 0;
			return acc;
		}, {} as Record<string, number>);

		if (!this.cave || this.cave.length === 0) return initialDist;

		return this.cave.reduce((dist, wine) => {
			const val = wine[property];
			const key = (val != null) ? val.toString() : 'Inconnue';
			
			// Si la clé n'est pas dans la liste initiale, on l'ajoute quand même
			dist[key] = (dist[key] || 0) + (wine.placements?.length || 0);
			return dist;
		}, initialDist);
	}

  get totalValue(): number {
    return this.cave.reduce((total, wine) => {
      return total + (wine.unitPrice * wine.placements.length);
    }, 0);
  }

  get uniqueRegionsCount(): number {
    const regions = new Set(
      this.cave
        .map(wine => wine.region)
        .filter(region => !!region)
    );
    return regions.size;
  }

  get averageRating(): number {
    const ratedWines = this.cave.filter(wine => wine.rating !== undefined && wine.rating !== null);
    
    if (ratedWines.length === 0) return 0;
    
    const totalRating = ratedWines.reduce((sum, wine) => sum + wine.rating!, 0);
    return Math.round((totalRating / ratedWines.length) * 10) / 10; 
  }

  get winesSortedByRatingDesc(): UserWine[] {
    return [...this.cave]
      .filter(wine => wine.rating !== undefined && wine.rating !== null)
      .sort((a, b) => b.rating! - a.rating!);
  }
}