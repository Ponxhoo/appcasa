import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class ListaPage {
  // Define el tipo de datos de las listas
  items: { title: string; description: string; id: number }[] = []; // Arreglo inicializado vacío

  pendientes = [
    { title: 'Trámite 1', description: 'Pendiente de revisión', id: 1 },
    { title: 'Trámite 2', description: 'En espera de aprobación', id: 2 },
  ];

  aprobados = [
    { title: 'Trámite 3', description: 'Aprobado el 10/01/2025', id: 3 },
    { title: 'Trámite 4', description: 'Aprobado el 12/01/2025', id: 4 },
  ];

  constructor(private router: Router) {
    this.items = this.pendientes;
  }

  onSegmentChange(event: any) {
    const selectedSegment = event.detail.value;

    if (selectedSegment === 'pendientes') {
      this.items = this.pendientes;
    } else if (selectedSegment === 'aprobados') {
      this.items = this.aprobados;
    }
  }

  goToRegistro(itemId: number) {  // Cambiar el tipo de itemId a number
    this.router.navigate(['/registro', itemId]);  // Navegar a la vista de registro
  }
}
