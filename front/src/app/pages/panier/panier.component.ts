import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css'],
  standalone:false
})
export class PanierComponent {
  panier: any[] = [];

  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    let panierCookie = this.cookieService.get('panier');
    this.panier = panierCookie ? JSON.parse(panierCookie) : [];
  }

  viderPanier() {
    this.cookieService.delete('panier');
    this.panier = [];
  }
  
  Commander(){
    console.log(this.panier);
    window.location.href = '/commande'; // ✅ Redirection APRÈS la réponse
  }

}
