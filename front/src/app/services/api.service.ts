import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; // Remplace par l'URL de ton backend

  constructor(private http: HttpClient) {}

  // Exemple : Récupérer une liste d'éléments
  getPlats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Plats`);
  }
  getBoissons(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Boissons`);
  }
  getDessert(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Desserts`);
  }
  Commande(info:any): Observable<any>{
    console.log(info)
    return this.http.post(`${this.baseUrl}/commande`, info);
  }
  // Exemple : Envoyer des données en POST
  createItem(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, data);
  }
}
