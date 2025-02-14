import { Component } from '@angular/core';

@Component({
  selector: 'app-validate',
  standalone: false,
  templateUrl: './validate.component.html',
  styleUrl: './validate.component.css'
})
export class ValidateComponent {
  toHome(){
  window.location.href = '/home'; 
}
}
