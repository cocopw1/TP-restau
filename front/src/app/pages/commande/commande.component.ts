import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-commande',
  standalone: false,
  templateUrl: './commande.component.html',
  styleUrl: './commande.component.css'
})
export class CommandeComponent {

  adresseForm: FormGroup;
  constructor(private apiService: ApiService,private cookieService: CookieService) {
    this.adresseForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zip: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}$')])
    });
  }
  

  panier: any[] = [];
  ngOnInit() {
    let panierCookie = this.cookieService.get('panier');
    this.panier = panierCookie ? JSON.parse(panierCookie) : [];
  }

  validate(){
  }
  onSubmit() {
    if (this.adresseForm.valid) {
      console.log('Adresse enregistrée:', this.adresseForm.value);
      let info = {addresse:this.adresseForm.value,panier : this.panier} 
      this.apiService.Commande(info).subscribe(
        (response) => {
          console.log('Connexion réussie !');
          window.location.href = '/validate'; // ✅ Redirection APRÈS la réponse
        },
        (err) => {
          console.error('Erreur de connexion :', err);
        }
        
      );

    }
  }
}

