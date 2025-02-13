import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  items: any[] = [];
  
  activeTab: string = 'plats'; // Par défaut, l'onglet "Plats" est actif
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getItems().subscribe(
      (data) => {
        this.items = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des données', error);
      }
    );
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}