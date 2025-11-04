import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    if (this.auth.currentUser) {
      console.log(this.auth.currentUser);
      
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}