import { Component,OnInit } from '@angular/core';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  data: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getData().subscribe(response => {
      this.data = response;
    });
  }
}