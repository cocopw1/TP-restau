import { Component, OnInit } from '@angular/core'; // N'oublie pas OnInit
import { AuthService } from './interceptors/auth.service';
import { Router } from '@angular/router'; // Pour la redirection propre

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  constructor(
    private authService: AuthService,
    private router: Router // Injection du router
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    // ✅ On écoute si c'est un admin
    this.authService.isAdmin$.subscribe((status) => {
      this.isAdmin = status;
    });
  }

  logout() {
    this.authService.logout();
    // Plus besoin de window.location.href (mauvaise pratique en Angular)
    // Le subscribe ci-dessus passera isLoggedIn à false tout seul.
    this.router.navigate(['/login']); 
  }
}