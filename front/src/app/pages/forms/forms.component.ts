import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../interceptors/auth.service';

@Component({
  selector: 'app-forms',
  standalone: false,
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent {
  newPostContent =""
  Posts:any = []
  isLoggedIn = false;
  constructor(private apiService: ApiService,private authService: AuthService){};
  ngOnInit() {
    if(this.authService.isAuthenticated() == undefined){
      this.isLoggedIn=false;
    }else{
      this.isLoggedIn = this.authService.isAuthenticated(); // ✅ Vérifie si l'utilisateur est connecté
    }
    this.apiService.getPosts().subscribe(
      (data) => {
        this.Posts = data;
        console.log(this.Posts)
      },
      (error) => {
        console.error('Erreur lors du chargement des données', error);
      }
    );}// ...existing code...
addPost() {
  if (!this.newPostContent) return;

  // CORRECTION ICI : utiliser 'article' pour correspondre au backend
  const dataToSend = { article: this.newPostContent };

  this.apiService.postPosts(dataToSend).subscribe(
    (response) => {
      // Optionnel : afficher un message de succès
      this.newPostContent = "";
      
      // Rafraîchir la liste des posts
      this.apiService.getPosts().subscribe(
        (data) => {
          this.Posts = data;
        },
        (error) => {
          console.error('Erreur lors du rafraîchissement des posts', error);
        }
      );
    },
    (error) => {
      console.error('Erreur lors de l\'ajout du post', error);
    }
  );
}
}
