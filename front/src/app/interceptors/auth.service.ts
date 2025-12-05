import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // 1. Nouveaux imports
import { isPlatformBrowser } from '@angular/common'; // 2. Import pour vérifier le navigateur
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  // On déclare les variables sans les initialiser tout de suite avec localStorage
  private isLoggedInSubject: BehaviorSubject<boolean>; 
  isLoggedIn$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // 3. Injection de l'ID de plateforme
  ) {
    // 4. On initialise ICI, en vérifiant si on est dans le navigateur
    const hasToken = isPlatformBrowser(this.platformId) ? !!localStorage.getItem('token') : false;
    
    this.isLoggedInSubject = new BehaviorSubject<boolean>(hasToken);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  login(credentials: { username: string, password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Vérification avant d'écrire
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
        }
        this.isLoggedInSubject.next(true); 
      })
    );
  }

  logout() {
    // Vérification avant de supprimer
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.isLoggedInSubject.next(false); 
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }
}