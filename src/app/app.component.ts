import { Component } from '@angular/core';
import { AlertController, MenuController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
// export class AppComponent {
//   constructor() {}
// }


export class AppComponent {
  constructor(
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController
  ) {}

  async abrirConfiguracion() {
    // Leer URL guardada previamente (si existe)
    const urlGuardada = localStorage.getItem('apiUrl') || '';

    const alert = await this.alertCtrl.create({
      header: 'Configuración',
      cssClass: 'custom-alert', // para agrandar el modal
      inputs: [
        {
          name: 'url',
          type: 'url',
          placeholder: 'https://tuservidor.com/api',
          value: urlGuardada,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.url) {
              localStorage.setItem('apiUrl', data.url);

              // Mostrar mensaje de éxito
              const toast = await this.toastCtrl.create({
                message: '✅ URL actualizada con éxito',
                duration: 2000,
                color: 'success',
              });
              await toast.present();

              // Cerrar menú lateral
              this.menuCtrl.close();
            }
          },
        },
      ],
    });

    await alert.present();
  }
}