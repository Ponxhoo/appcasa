import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', 
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule)
  },
  {
    path: 'registro',
    loadComponent: () =>import('./registro/registro.page').then((m) => m.RegistroPage),
  },
  {
    path: 'registro/:id',  // Definir la ruta con un parámetro :id
    loadComponent: () =>import('./registro/registro.page').then((m) => m.RegistroPage),
  },

  {
    path: 'lista',
    loadComponent: () =>import('./lista/lista.page').then((m) => m.ListaPage),
  },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
