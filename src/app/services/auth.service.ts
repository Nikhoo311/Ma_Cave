import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {
    // Listen to Firebase auth state changes
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

  // Register a new user with email and password
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

  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await signInWithPopup(this.auth, provider);
    const firebaseUser = credential.user;

    // Vérifie que c'est un compte existant (pas une première connexion)
    const isNewUser = credential.user.metadata.creationTime === credential.user.metadata.lastSignInTime;
    if (isNewUser) {
      await signOut(this.auth);
      throw new Error('AUTH.GOOGLE_NO_ACCOUNT');
    }

    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? undefined,
      photoURL: firebaseUser.photoURL ?? undefined,
      createdAt: new Date()
    };
    this.currentUserSubject.next(user);
    return user;
  }


  async registerWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await signInWithPopup(this.auth, provider);
    const firebaseUser = credential.user;

    // Vérifie que c'est bien une première connexion
    const isNewUser = credential.user.metadata.creationTime === credential.user.metadata.lastSignInTime;
    if (!isNewUser) {
      await signOut(this.auth);
      throw new Error('AUTH.GOOGLE_ALREADY_EXISTS');
    }

    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? undefined,
      photoURL: firebaseUser.photoURL ?? undefined,
      createdAt: new Date()
    };
    this.currentUserSubject.next(user);
    return user;
  }

  async logout() {
    await signOut(this.auth);
    this.currentUserSubject.next(null);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}