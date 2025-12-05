import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Pour la redirection propre
import { ApiService } from '../../services/api.service'; // On utilise ton ApiService

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'] // Correction: 'styleUrls' au pluriel
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      // Ton backend attend 'username', pas 'email'
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      // Préparation des données (on force isAdmin à false pour un utilisateur lambda)
      const userData = {
        ...this.signupForm.value,
        isAdmin: false
      };

      this.apiService.register(userData).subscribe({
        next: (response) => {
          console.log('Inscription réussie !', response);
          
          // Stocker le token (Auto-login)
          if (response.token) {
            localStorage.setItem('token', response.token);
          }

          // Redirection vers la page d'accueil ou de login
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Erreur inscription :', err);
          if (err.status === 409) {
            this.errorMessage = "Ce nom d'utilisateur est déjà pris.";
          } else {
            this.errorMessage = "Une erreur est survenue lors de l'inscription.";
          }
        }
      });
    }
  }
}