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
  isAdmin = false;
  constructor(private apiService: ApiService,private authService: AuthService){};
ngOnInit() {
    // Gestion connexion
    if (this.authService.isAuthenticated() == undefined) {
      this.isLoggedIn = false;
    } else {
      this.isLoggedIn = this.authService.isAuthenticated();
    }

    // ✅ Récupération du statut Admin
    this.authService.isAdmin$.subscribe(status => {
        this.isAdmin = status;
    });

    this.loadPosts();
  }

  loadPosts() {
      this.apiService.getPosts().subscribe(
        (data) => {
          this.Posts = data;
        },
        (error) => console.error('Erreur', error)
      );
  }
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
deletePost(post: any) {
    if(!confirm("Voulez-vous vraiment supprimer ce message ?")) return;

    // ATTENTION : Vérifie si ton backend utilise 'id' ou '_id'
    const id = post.id || post._id; 

    this.apiService.deletePost(id).subscribe({
        next: () => {
            // On retire le post de la liste localement pour éviter de recharger tout
            this.Posts = this.Posts.filter((p: any) => (p.id || p._id) !== id);
        },
        error: (err) => console.error("Erreur suppression", err)
    });
  }
}
