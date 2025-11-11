import { Component, Input, OnInit } from '@angular/core';
import { AuthTypeEnum } from '../types/AuthTypeEnum';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  standalone: false
})
export class AuthPage implements OnInit {
  constructor() {}
  
  @Input() mode: string = AuthTypeEnum.LOGIN;
  async ngOnInit() {}
}