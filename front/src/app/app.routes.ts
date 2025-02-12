import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirection vers home par défaut
];