import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import {
  Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithCredential, GoogleAuthProvider, signOut, onAuthStateChanged,
  User as FirebaseUser, sendPasswordResetEmail
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { ERRORS_CODES } from '../types/ErrorsCode';
import { doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { WineType } from '../types/WineType';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private router: Router, private firestore: Firestore) {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        await this.syncUserFromFirestore(firebaseUser);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  // ── Logique centralisée pour Login/Register ────────────────
  private async handleAuthSuccess(firebaseUser: FirebaseUser): Promise<void> {
    const user = await this.syncUserFromFirestore(firebaseUser);
    const isSetupDone = user.caveConfig?.rows > 0;
    this.router.navigate([!isSetupDone ? '/preference' : '/home']);
  }

  private async syncUserFromFirestore(firebaseUser: FirebaseUser): Promise<User> {
    const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
    const snap = await getDoc(userRef);

    const user = snap.exists() ? (snap.data() as User) : this.mapFirebaseUser(firebaseUser);
    
    this.currentUserSubject.next(user);
    return user;
  }

  async register(email: string, password: string): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, email, password);

      const mappedUser = this.mapFirebaseUser(user);
      this.currentUserSubject.next(mappedUser);
      this.router.navigate(['/preference']);
      return mappedUser;
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const { user } = await signInWithEmailAndPassword(this.auth, email, password);
      await this.handleAuthSuccess(user);
    } catch (error: any) {
      this.handleAuthError(error);
    }
  }

  async loginWithGoogle(): Promise<void> {
    const result = await FirebaseAuthentication.signInWithGoogle();
    const credential = GoogleAuthProvider.credential(result.credential?.idToken);
    const { user } = await signInWithCredential(this.auth, credential);
    await this.handleAuthSuccess(user);
  }

  async saveUserPreferences(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.id}`);
    await setDoc(userRef, { ...user, createdAt: user.createdAt.toISOString() }, { merge: true });
    this.currentUserSubject.next(user);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    await FirebaseAuthentication.signOut();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  // ── Utils ─────────────────────────────────────────────────
  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      firstName: '',
      lastName: '',
      favoriteWineType: null,
      provider: firebaseUser.providerData.some(p => p.providerId === 'google.com') ? 'google' : 'password',
      createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
      caveConfig: { rows: 0, cols: 0 },
    };
  }

  private handleAuthError(error: any): never {
    if (error.code === ERRORS_CODES.auth.userNotFound) throw new Error('AUTH.NO_ACCOUNT');
    if (error.code === ERRORS_CODES.auth.tooManyRequests) throw new Error('AUTH.TOO_MANY_ATTEMPTS');
    if (error.code === ERRORS_CODES.auth.invalidCredential) throw new Error('AUTH.INVALID_CREDENTIAL');
    if (error.code === ERRORS_CODES.auth.emailAlreadyInUse) throw new Error('AUTH.RULES.EMAIL_ALREADY_TAKEN');
    throw error;
  }

  get currentUser(): User | null { return this.currentUserSubject.value; }

  async updateFavoriteWine(selectedType: WineType): Promise<void> {
    const user = this.currentUser;
    if (!user || !user.id) throw new Error("Utilisateur non connecté.");

    const userRef = doc(this.firestore, 'users', user.id);
    await updateDoc(userRef, { favoriteWineType: selectedType })
    .then(() => {
      this.currentUserSubject.next({ ...user, favoriteWineType: selectedType });
    }).catch((error) => {
      this.handleAuthError(error);
    });
  }
}