import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {
    // Écoute les changements d’état d’auth Firebase
    onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          displayName: firebaseUser.displayName ?? undefined,
          photoURL: firebaseUser.photoURL ?? undefined,
          createdAt: new Date()
        };
        this.currentUserSubject.next(user);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  /** Inscription d’un nouvel utilisateur avec email et mot de passe */
  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password).then(credential => {
      const firebaseUser = credential.user;
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName: firebaseUser.displayName ?? undefined,
        photoURL: firebaseUser.photoURL ?? undefined,
        createdAt: new Date()
      };
      this.currentUserSubject.next(user);
      return user;
    });
  }

  /** Connexion */
  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password).then(credential => {
      const firebaseUser = credential.user;
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName: firebaseUser.displayName ?? undefined,
        photoURL: firebaseUser.photoURL ?? undefined,
        createdAt: new Date()
      };
      this.currentUserSubject.next(user);
      return user;
    });
  }

  /** Déconnexion */
  async logout() {
    await signOut(this.auth);
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}