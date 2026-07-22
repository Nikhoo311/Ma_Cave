import { Component, OnInit } from '@angular/core';
import { PreferencesService } from './core/services/preferences.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private prefs: PreferencesService) {}

  async ngOnInit() {
    await this.prefs.init();
  }
}
