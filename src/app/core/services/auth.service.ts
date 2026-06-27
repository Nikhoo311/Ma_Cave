import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { User, AuthProvider } from '../models/user.model'; // <-- Assure-toi que les imports sont corrects
import { ERRORS_CODES } from '../types/ErrorsCode';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private router: Router, private userService: UserService) {
    onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      this.currentUserSubject.next(firebaseUser ? this.mapFirebaseUser(firebaseUser) : null);
    });
  }

  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    const isGoogle = firebaseUser.providerData.some(p => p.providerId === 'google.com');
    const provider: AuthProvider = isGoogle ? 'google' : 'password';

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      firstName: '',
      lastName: '',
      favoriteWineType: null,
      provider: provider,
      createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),

      caveConfig: {
        rows: 0,
        cols: 0,
      },
      cave: []
    };
  }

  // ── Email / Password ──────────────────────────────────────
  async register(email: string, password: string): Promise<User> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = this.mapFirebaseUser(credential.user);
      this.currentUserSubject.next(user);
      this.router.navigate(['/preference']);
      return user;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('AUTH.EMAIL_ALREADY_EXISTS');
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = this.mapFirebaseUser(credential.user);
      this.currentUserSubject.next(user);

      const isSetuped = await this.userService.isUserSetupDone(user.id);
    
      this.router.navigate([!isSetuped ? '/preference' : '/home']);
      return user;
    } catch (error: any) {
      if (error.code === ERRORS_CODES.auth.userNotFound) {
        throw new Error('AUTH.NO_ACCOUNT');
      }
      if (error.code === ERRORS_CODES.auth.tooManyRequests) {
        throw new Error('AUTH.TOO_MANY_ATTEMPTS')
      }
      if (error.code === ERRORS_CODES.auth.invalidCredential) {
        throw new Error('AUTH.INVALID_CREDENTIAL')
      }
      throw error;
    }
  }

  // ── Google Login ──────────────────────────────────────────
  async loginWithGoogle(): Promise<User> {
    const result = await FirebaseAuthentication.signInWithGoogle();
    const credential = GoogleAuthProvider.credential(result.credential?.idToken);
    const firebaseResult = await signInWithCredential(this.auth, credential);
    const firebaseUser = firebaseResult.user;

    const user = this.mapFirebaseUser(firebaseUser);
    this.currentUserSubject.next(user);

    const isSetuped = await this.userService.isUserSetupDone(user.id);
    
    this.router.navigate([!isSetuped ? '/preference' : '/home']);
    return user;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    await FirebaseAuthentication.signOut();
    this.currentUserSubject.next(null);
    this.router.navigate(['auth']);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}