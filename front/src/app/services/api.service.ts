import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Posts`);
  }
  
  postPosts(data:any):Observable<any> {
    return this.http.post(`${this.baseUrl}/Posts`, data);
  }

  createItem(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, data);
  }

  // --- AJOUT POUR L'INSCRIPTION ---
  register(data: any): Observable<any> {
    // Le backend attend { username, password, isAdmin }
    return this.http.post(`${this.baseUrl}/register`, data);
  }
}