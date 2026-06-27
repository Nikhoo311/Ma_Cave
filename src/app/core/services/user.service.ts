import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  async saveUserPreferences(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.id}`);
    await setDoc(userRef, {
      ...user,
      createdAt: user.createdAt.toISOString()
    }, { merge: true });
  }

  async isUserSetupDone(id: string): Promise<boolean> {
    const userRef = doc(this.firestore, `users/${id}`);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return false;

    const userData = userSnap.data() as User;
    return userData.caveConfig?.rows > 0;
  }
}