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
  
    
  }