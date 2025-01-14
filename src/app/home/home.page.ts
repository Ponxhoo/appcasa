import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  rooms = [
    { name: 'Bedroom', icon: 'bed-outline', isSelected: false },
    { name: 'Living room', icon: 'tv-outline', isSelected: true },
    { name: 'Kitchen', icon: 'restaurant-outline', isSelected: false },
    { name: 'Bathroom', icon: 'water-outline', isSelected: false },
    { name: 'Dining room', icon: 'wine-outline', isSelected: false },
    { name: 'Office', icon: 'desktop-outline', isSelected: false },
  ];

  selectRoom(room: any) {
    this.rooms.forEach((r) => (r.isSelected = false));
    room.isSelected = true;
  }
}