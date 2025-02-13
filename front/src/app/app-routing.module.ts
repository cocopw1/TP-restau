import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { LoginComponent } from './pages/login/login.component';
import { PanierComponent } from './pages/panier/panier.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path:'menu',component:MenuComponent},
  { path: 'login', component: LoginComponent },
  { path: 'panier', component: PanierComponent },
  
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
