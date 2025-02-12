import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://api.example.com'; // Remplace par l'URL de ton backend

  constructor(private http: HttpClient) {}

  // Exemple : Récupérer une liste d'éléments
  getItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/items`);
  }

  // Exemple : Envoyer des données en POST
  createItem(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/items`, data);
  }
}
