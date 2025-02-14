import { Component } from '@angular/core';

import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
    itemForm: FormGroup;
  
    constructor(private apiService: ApiService) {
      this.itemForm = new FormGroup({
        category: new FormControl('Plats', Validators.required),
        name: new FormControl('', Validators.required),
        price: new FormControl('', [Validators.required, Validators.min(0)]),
        imageUrl: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
      });
    }
  
    onSubmit() {
      if (this.itemForm.valid) {
        console.log('Nouvel article ajouté :', this.itemForm.value);
        alert('Article ajouté avec succès !');
        let data = {
          nom:this.itemForm.value.name,
          imgsrc:this.itemForm.value.imageUrl,
          prix:this.itemForm.value.price,
          descr:this.itemForm.value.description
        }
        if (this.itemForm.value.category == "Plats"){
          this.apiService.postPlats(data).subscribe(
            (response) => {
              console.log('Connexion réussie !');
              window.location.href = '/menu'; // ✅ Redirection APRÈS la réponse
            },
            (err) => {
              console.error('Erreur de connexion :', err);
            }
            
          );
        }
        if (this.itemForm.value.category == "Boissons"){
          this.apiService.postBoissons(data).subscribe(
            (response) => {
              console.log('Connexion réussie !');
              window.location.href = '/menu'; // ✅ Redirection APRÈS la réponse
            },
            (err) => {
              console.error('Erreur de connexion :', err);
            }
            
          );
        }
        if (this.itemForm.value.category == "Desserts"){
          this.apiService.postDessert(data).subscribe(
            (response) => {
              console.log('Connexion réussie !');
              window.location.href = '/menu'; // ✅ Redirection APRÈS la réponse
            },
            (err) => {
              console.error('Erreur de connexion :', err);
            }
            
          );
        }
        this.itemForm.reset({ category: 'Plats' }); // Réinitialiser le formulaire
      } else {
        alert('Veuillez remplir tous les champs correctement.');
      }
    }
  }