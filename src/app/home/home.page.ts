import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  // rooms = [
  //   { name: 'Carga de datos', icon: 'bed-outline', isSelected: true,route: 'lista'  },
  //   { name: 'Realizar Inspección', icon: 'tv-outline', isSelected: false,route: 'registro'  },
  //   { name: 'Enviar Información', icon: 'restaurant-outline', isSelected: false,route: ''  },

  // ];

  rooms = [
    { name: 'Carga de datos', icon: 'cloud-upload-outline', isSelected: true, route: '' },
    { name: 'Realizar Inspección', icon: 'clipboard-outline', isSelected: false, route: 'lista' },
    { name: 'Enviar Información', icon: 'send-outline', isSelected: false, route: '' },
  ];
  

  selectRoom(room: any) {
    this.rooms.forEach((r) => (r.isSelected = false));
    room.isSelected = true;
  }

  constructor(private router: Router) {}

  navigateTo(page: string) {
    console.log("entro");
    this.router.navigate([`/${page}`]); // Navega a la página especificada
  }

  onRoomClick(room: any) {
    this.selectRoom(room); // Marca la habitación como seleccionada
    this.navigateTo(room.route); // Navega a la ruta especificada en el objeto
  }
  


}