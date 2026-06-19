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
import { User } from '../models/user.model';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
 
  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      this.currentUserSubject.next(firebaseUser ? this.mapFirebaseUser(firebaseUser) : null);
    });
  }
 
  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? undefined,
      photoURL: firebaseUser.photoURL ?? undefined,
      createdAt: new Date()
    };
  }
 
  // ── Email / Password ──────────────────────────────────────
  async register(email: string, password: string): Promise<User> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = this.mapFirebaseUser(credential.user);
      this.currentUserSubject.next(user);
      this.router.navigate(['home']);
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
      this.router.navigate(['home']);
      return user;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        throw new Error('AUTH.NO_ACCOUNT');
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
 
    const isNewUser = firebaseUser.metadata.creationTime === firebaseUser.metadata.lastSignInTime;
    this.router.navigate([isNewUser ? '/preference' : '/home']);
 
    const user = this.mapFirebaseUser(firebaseUser);
    this.currentUserSubject.next(user);
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