import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true, // Esta propiedad debe estar presente
   imports: [CommonModule, FormsModule, IonicModule],
})
export class LoginPage {
  constructor(private router: Router) {}

  identificacion: string = '';
  email: string = '';

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  async saveData() {
    try {
      // Guarda la identificación en Preferences
      await Preferences.set({
        key: 'identificacion',
        value: this.identificacion,
      });

      // Guarda el email en Preferences
      await Preferences.set({
        key: 'email',
        value: this.email,
      });

      console.log('Datos guardados en caché.');
      // Navega a la ruta 'home'
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al guardar los datos en Preferences:', error);
    }
  }
}
