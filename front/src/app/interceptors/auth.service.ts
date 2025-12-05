import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  private isLoggedInSubject: BehaviorSubject<boolean>; 
  isLoggedIn$: Observable<boolean>;

  // ✅ 1. Ajout du Subject pour isAdmin
  private isAdminSubject: BehaviorSubject<boolean>;
  isAdmin$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const isBrowser = isPlatformBrowser(this.platformId);
    
    // Récupération token
    const hasToken = isBrowser ? !!localStorage.getItem('token') : false;
    
    // ✅ 2. Récupération de l'état admin stocké (si tu le stockes dans le localStorage)
    const isAdmin = isBrowser ? localStorage.getItem('isAdmin') === 'true' : false;

    this.isLoggedInSubject = new BehaviorSubject<boolean>(hasToken);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();

    // ✅ 3. Initialisation du Subject Admin
    this.isAdminSubject = new BehaviorSubject<boolean>(isAdmin);
    this.isAdmin$ = this.isAdminSubject.asObservable();
  }

  // ✅ 4. Modification du login pour récupérer isAdmin depuis le backend
  // NOTE : Ton backend doit renvoyer { token: '...', isAdmin: true }
  login(credentials: { username: string, password: string }) {
    return this.http.post<{ token: string, isAdmin: boolean }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          // On stocke le statut admin
          localStorage.setItem('isAdmin', String(response.isAdmin)); 
        }
        this.isLoggedInSubject.next(true); 
        this.isAdminSubject.next(response.isAdmin || false); // Mise à jour du statut
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin'); // ✅ Nettoyage
    }
    this.isLoggedInSubject.next(false); 
    this.isAdminSubject.next(false); // ✅ Remise à zéro
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }
  
  // ✅ Helper pour savoir si admin (synchrone)
  getIsAdmin(): boolean {
      return this.isAdminSubject.value;
  }
}