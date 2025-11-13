import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  items = [
    { title: 'Tâche 1', content: 'Faire la mise à jour du design', tag: 'UI' },
    { title: 'Tâche 2', content: 'Optimiser la base de données', tag: 'Backend' },
    { title: 'Tâche 3', content: 'Tests unitaires à finaliser Tests unitaires à finaliser Tests unitaires à finaliser Tests unitaires à finaliser\nTests unitaires à finaliser', tag: 'QA' },
  ];

  constructor() {}

  truncate(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength).trim() + '…' : text;
  }

  addItem() {
    console.log('Ajouter un nouvel élément');
    // Ici tu pourrais ouvrir un modal ou un formulaire
  }

  openSettings() {
    console.log('Ouvrir les paramètres');
    // Exemple : ouvrir un modal de settings
  }
}