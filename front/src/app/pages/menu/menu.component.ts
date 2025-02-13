import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  Plats: any[] = [];
  Boissons: any[] = [];
  Dessert: any[] = [];
  
  activeTab: string = 'plats'; // Par défaut, l'onglet "Plats" est actif
  constructor(private apiService: ApiService,private cookieService: CookieService) {}

  ngOnInit() {
    this.apiService.getPlats().subscribe(
      (data) => {
        this.Plats = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des données', error);
      }
    );
    this.apiService.getDessert().subscribe(
      (data) => {
        this.Dessert = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des données', error);
      }
    );
    this.apiService.getBoissons().subscribe(
      (data) => {
        this.Boissons = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des données', error);
      }
    );
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  ajouterAuPanier(article: any) {
    let panier = this.cookieService.get('panier');
    let panierArray = panier ? JSON.parse(panier) : [];
    
    panierArray.push(article); // Ajouter l'article au panier

    this.cookieService.set('panier', JSON.stringify(panierArray), 7); // Stocker le panier pour 7 jours
    alert(`${article.nom} ajouté au panier !`);
  }
}