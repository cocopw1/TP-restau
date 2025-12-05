import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../interceptors/auth.service';
import { Router } from '@angular/router'; // Ajout du Router pour une redirection propre

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router // Injection du router
  ) {
    this.loginForm = this.fb.group({
      // Modification ici : 'username' au lieu de 'email'
      username: ['', [Validators.required, Validators.minLength(3)]], 
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  // ... imports

onSubmit() {
  if (this.loginForm.valid) {
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        console.log('Connexion réussie !');
        // Le service a déjà mis à jour le Subject et le localStorage grâce au 'tap'
        this.router.navigate(['/home']); 
      },
      error: (err) => {
        console.error('Erreur', err);
        this.errorMessage = "Identifiants incorrects";
      }
    });
  }
}
}