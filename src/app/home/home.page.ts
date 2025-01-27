import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  rooms = [
    { name: 'Carga de datos', icon: 'cloud-upload-outline', isSelected: true, route: 'login' },
    { name: 'Realizar Inspección', icon: 'clipboard-outline', isSelected: false, route: 'lista' },
    { name: 'Enviar Información', icon: 'send-outline', isSelected: false, route: '' },
    { name: 'Cerrar Sesión', icon: 'log-out-outline', isSelected: false, route: '' },
  ];

  identificacion: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async () => {
      await this.fijarIdentificacion();
    });
  }

  async fijarIdentificacion() {
    const sesion = await Preferences.get({ key: 'identificacion' });
    this.identificacion = sesion.value ? JSON.parse(sesion.value) : '';
  }

  selectRoom(room: any) {
    this.rooms.forEach((r) => (r.isSelected = false));
    room.isSelected = true;
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  onRoomClick(room: any) {
    this.selectRoom(room);
    if (room.name === 'Carga de datos') {
      this.confirmSync(); // Muestra la confirmación para sincronizar
    } else {
      if (room.name === 'Cerrar Sesión') {
        this.confirmLogout(); // Muestra la confirmación para cerrar sesión
      } else {
      this.navigateTo(room.route);
      }
    }
  }

  // Preguntar al usuario si quiere sincronizar los datos
  async confirmSync() {
    const result = await Swal.fire({
      title: '¿Deseas sincronizar los datos?',
      text: 'Esta acción consultará al sistema  y actualizará los datos.',
      icon: 'question',
      width: '90%', // Ajusta el ancho
      heightAuto: false, // Evita que el alto sea automático
      showCancelButton: true,
      confirmButtonText: 'Sí, sincronizar',
      cancelButtonText: 'No, cancelar',
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
      },
    });

    if (result.isConfirmed) {
      this.loadData(); // Si acepta, llama a la función para sincronizar
    } else {
      Swal.fire({
        title: 'Sincronización cancelada',
        text: 'No se realizaron cambios.',
        icon: 'info',
        width: '90%', // Ajusta el ancho
        heightAuto: false, // Evita que el alto sea automático
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
        },
      });
    }
  }

  // Método para consumir la API y guardar valores en caché
  async loadData() {
    const apiUrl = 'https://g-kaipi.cloud/CB-OnlineLoreto/kservicios/view/envioinspeccion';

    try {
      const response: any = await this.http.get(apiUrl).toPromise();

      // Procesar y agregar estado a los datos
      const processedData = response.map((item: any) => ({
        ...item,
        estado: 'Pendiente',
      }));

      // Guardar los datos procesados en caché
      await Preferences.set({
        key: 'datosCargados',
        value: JSON.stringify(processedData),
      });

      console.log('Datos cargados y guardados en caché:', processedData);

      // Mostrar mensaje de éxito
      Swal.fire({
        title: 'Sincronización exitosa',
        text: 'Los datos se han sincronizado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        width: '90%', // Ajusta el ancho
        heightAuto: false, // Evita que el alto sea automático
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
        },
      });
    } catch (error) {
      console.error('Error al cargar los datos:', error);

      // Mostrar mensaje de error
      Swal.fire({
        title: 'Error al sincronizar',
        text: 'No se pudo conectar con la API.',
        icon: 'error',
        width: '90%', // Ajusta el ancho
        heightAuto: false, // Evita que el alto sea automático
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
        },
      });
    }
  }


   // Función para mostrar la confirmación de cierre de sesión
   async confirmLogout() {
    const result = await Swal.fire({
      title: '¿Estás seguro de cerrar sesión?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      width: '90%', // Ajusta el ancho
      heightAuto: false, // Evita que el alto sea automático
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
      },
    });

    if (result.isConfirmed) {
      await this.logout(); // Llamar a la función que limpia la caché y redirige
    }
  }

  // Función para limpiar caché y redirigir al login
  async logout() {
    try {
      // Limpiar las variables de caché
      await Preferences.remove({ key: 'identificacion' });
      await Preferences.remove({ key: 'email' });

      console.log('Caché limpiado. Redirigiendo al login.');

      // Redirigir al login
      this.router.navigate(['/login']);

      // Mensaje de éxito
      Swal.fire({
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión exitosamente.',
        icon: 'success',
        width: '90%', // Ajusta el ancho
        heightAuto: false, // Evita que el alto sea automático
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
        },
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);

      // Mostrar mensaje de error
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cerrar sesión.',
        icon: 'error',
        width: '90%', // Ajusta el ancho
        heightAuto: false, // Evita que el alto sea automático
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
        },
      });
    }
  }
}
