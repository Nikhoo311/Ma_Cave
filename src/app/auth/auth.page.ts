import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  standalone: false
})
export class AuthPage implements OnInit {
  constructor() {}
  
  @Input() mode: 'login' | 'register' = 'login';
  async ngOnInit() {}
}