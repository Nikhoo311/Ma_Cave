import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-preference',
  standalone: true,
  templateUrl: './preference.page.html',
  styleUrls: ['./preference.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TranslocoModule,
  ]
})
export class PreferencePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
