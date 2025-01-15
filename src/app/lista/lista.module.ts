import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ListaPage } from './lista.page';
import { RouterModule } from '@angular/router';  // Asegúrate de importar RouterModule



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
        IonicModule,
        RouterModule,
  ],
  declarations: [ListaPage]
})
export class ListaPageModule {}
