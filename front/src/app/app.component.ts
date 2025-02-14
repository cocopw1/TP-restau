import { Component } from '@angular/core';
import { AuthService } from './interceptors/auth.service'; // ✅ Import du service

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone:false
})
export class AppComponent {
  isLoggedIn = false; // ✅ Variable pour gérer l'affichage de la navbar

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if(this.authService.isAuthenticated() == undefined){
      this.isLoggedIn=false;
    }else{
      this.isLoggedIn = this.authService.isAuthenticated(); // ✅ Vérifie si l'utilisateur est connecté
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    window.location.href = '/login'; // ✅ Redirection après déconnexion
  }
}
