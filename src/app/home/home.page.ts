import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  rooms = [
    { name: 'Carga de datos', icon: 'bed-outline', isSelected: false },
    { name: 'Realizar Inspección', icon: 'tv-outline', isSelected: true },
    { name: 'Enviar Información', icon: 'restaurant-outline', isSelected: false },

  ];

  selectRoom(room: any) {
    this.rooms.forEach((r) => (r.isSelected = false));
    room.isSelected = true;
  }
}