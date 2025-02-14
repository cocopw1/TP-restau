import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

   login(credentials: { email: string, password: string }) {
    console.log('Envoi des données :', credentials);
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }
  logout() {
    localStorage.removeItem('token'); // Supprime le token
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Retourne true si un token existe
  }
}


