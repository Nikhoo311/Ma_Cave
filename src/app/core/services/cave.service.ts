import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserWine } from '../models/wine.model';
import { Firestore, collection, doc, setDoc, updateDoc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CaveService {
  private caveSubject = new BehaviorSubject<UserWine[]>([]);
  private firestoreSubscription?: Subscription;

  constructor(
    private authService: AuthService, 
    private firestore: Firestore,
    private fbAuth: Auth
  ) {
    onAuthStateChanged(this.fbAuth, (firebaseUser) => {
      if (firebaseUser) {
        const wineCollectionRef = collection(this.firestore, 'users', firebaseUser.uid, 'wine');

        this.firestoreSubscription?.unsubscribe();

        this.firestoreSubscription = collectionData(wineCollectionRef, { idField: 'id' }).subscribe((wines) => {
          this.caveSubject.next(wines as UserWine[]);
        });
      } else {

        this.firestoreSubscription?.unsubscribe();
        this.caveSubject.next([]);
      }
    });
  }

  getWines(): Observable<UserWine[]> {
    const user = this.authService.currentUser;
    if (!user || !user.id) {
      return of([]);
    }

    // Ciblage direct de la sous-collection du user connecté
    const wineCollection = collection(this.firestore, 'users', user.id, 'wine');

    return collectionData(wineCollection, { idField: 'id' }).pipe(
      map((wines: any[]) => 
        // Tri par ordre alphabétique du nom du vin (A-Z)
        wines.sort((a, b) => a.name.localeCompare(b.name))
      )
    ) as Observable<UserWine[]>;
  }

  async addWine(wine: Omit<UserWine, 'id'>): Promise<void> {
    const user = this.authService.currentUser;
    if (!user || !user.id) throw new Error("Utilisateur non connecté.");

    const wineCollectionRef = collection(this.firestore, 'users', user.id, 'wine');
    const newDocRef = doc(wineCollectionRef); // Génère un document vide avec un ID Firebase unique

    const wineWithId: UserWine = {
      ...wine,
      id: newDocRef.id 
    } as UserWine;

    await setDoc(newDocRef, wineWithId);
  }

  async updateWine(wine: UserWine): Promise<void> {
    const user = this.authService.currentUser;
    if (!user || !user.id) throw new Error("Utilisateur non connecté.");
    if (!wine.id) throw new Error("L'ID du vin est manquant pour la mise à jour.");

    const wineRef = doc(this.firestore, 'users', user.id, 'wine', wine.id);
    await updateDoc(wineRef, { ...wine });
  }

  async deleteWine(wineId: string): Promise<void> {
    const user = this.authService.currentUser;
    if (!user || !user.id) throw new Error("Utilisateur non connecté.");
    if (!wineId) throw new Error("L'ID du vin est manquant pour la suppression.");

    const wineRef = doc(this.firestore, 'users', user.id, 'wine', wineId);
    await deleteDoc(wineRef);
  }

  async removeBottle(wineId: string, placementToRemove: { row: number; col: number }): Promise<void> {
    const user = this.authService.currentUser;
    if (!user || !user.id) throw new Error("Utilisateur non connecté.");
    if (!wineId) throw new Error("L'ID du vin est manquant pour la suppression de placement.");

    const wineRef = doc(this.firestore, 'users', user.id, 'wine', wineId);
    const currentWine = this.cave.find(wine => wine.id === wineId);
    if (!currentWine) throw new Error("Vin non trouvé.");
    if (!currentWine.placements) throw new Error("Aucun placement trouvé pour ce vin.");

    const updatedPlacements = currentWine.placements.filter(placement => 
      !(placement.row === placementToRemove.row && placement.col === placementToRemove.col)
    );

    await updateDoc(wineRef, { placements: updatedPlacements });
  }

  get cave(): UserWine[] {
    return this.caveSubject.value;
  }

  get caveConfig() {
    return this.authService.currentUser?.caveConfig || { rows: 0, cols: 0 };
  }

  get totalBottles(): number {
    return this.cave.reduce((total, wine) => total + wine.placements.length, 0);
  }

  get starWine(): UserWine {
    return this.cave.filter(wine => wine.unitPrice).sort((a, b) => b.unitPrice! - a.unitPrice!)[0];
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
      
      dist[key] = (dist[key] || 0) + (wine.placements?.length || 0);
      return dist;
    }, initialDist);
  }

  formatPlacementCoords(placement: { row: number, col: number }): string {
    if (!placement) return '';
    
    // 65 is the ASCII code for the letter 'A'
    const letter = String.fromCharCode(65 + placement.row); 
    const colNumber = placement.col + 1;
    
    return `${letter}${colNumber}`;
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