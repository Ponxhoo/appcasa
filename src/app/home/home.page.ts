import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { ActivatedRoute } from '@angular/router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

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
  correo : string = '';
  fechaActual: string = '';
  datosCargados: any[] = []; // Variable para almacenar los datos
  tienePendientes: boolean = false; // Variable para mostrar/ocultar el texto


  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async () => {
      await this.validarSesion();
      await this.fijarIdentificacion();
      await this.obtenerFechaActual();
      await this.verificarPendientes();
    });
  }


  async validarSesion() {
      try {
          // Obtener los valores almacenados en Preferences
          const identificacion = await Preferences.get({ key: 'identificacion' });
          const email = await Preferences.get({ key: 'email' });
    
          // Verificar si los valores existen y no están vacíos
          if (!identificacion.value || !email.value) {
              console.warn('Sesión no válida. Redirigiendo al login.');
    
              // Mostrar alerta y redirigir al login
              Swal.fire({
                  title: 'Sesión no válida',
                  text: 'Debes iniciar sesión para acceder.',
                  icon: 'warning',
                  width: '90%', // Ajusta el ancho
                  heightAuto: false, // Evita que el alto sea automático
                  confirmButtonText: 'Aceptar'
              }).then(() => {
                  this.router.navigate(['/login']); // Redirigir al login
              });
    
              return false; // Indica que la sesión no es válida
          }
    
          console.log('Sesión válida:', identificacion.value, email.value);
          return true; // Indica que la sesión es válida
    
      } catch (error) {
          console.error('Error al validar sesión:', error);
    
          // En caso de error, redirigir al login
          this.router.navigate(['/login']);
          return false;
      }
    }
  


  async verificarPendientes() {
    const { value } = await Preferences.get({ key: 'datosCargados' });

    if (value) {
      const datosCargados = JSON.parse(value); // Convertir el JSON a un array
      const pendientes = datosCargados.filter((item: any) => item.estado === 'Pendiente'); // Filtrar por estado "Pendiente"

      console.log(`Número de pendientes: ${pendientes.length}`);
      this.tienePendientes = pendientes.length > 0; // Si hay al menos un pendiente, mostrar el mensaje
    } else {
      this.tienePendientes = false; // No hay datos, ocultar el mensaje
    }
  }

  async fijarIdentificacion() {
    const sesion = await Preferences.get({ key: 'identificacion' });
    const sesion2 = await Preferences.get({ key: 'email' });
    this.identificacion = sesion.value ? sesion.value : '';
    this.correo = sesion2.value ? sesion2.value : '';
  }

  async obtenerFechaActual() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes comienza en 0
    const dia = String(fecha.getDate()).padStart(2, '0');

    this.fechaActual = `${año}-${mes}-${dia}`;
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
        if(room.name === 'Enviar Información') {
          this.confirmAndSendData(); // Muestra la confirmación para cerrar sesión
        }
        else{
          this.navigateTo(room.route);

        }  
      
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
    const baseUrl = localStorage.getItem('apiUrl');
    const apiUrl = `${baseUrl}/kservicios/view/envioinspeccion`;
  
    try {
      const response: any = await this.http.get(apiUrl).toPromise();
  
      // Verificar si la API devolvió un mensaje de error o está vacía
      if (response?.error === 'No se encontraron registros.') {
        Swal.fire({
          title: 'Sin datos',
          text: 'No hay registros disponibles.',
          icon: 'info',
          confirmButtonText: 'Aceptar',
          width: '90%',
          heightAuto: false,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
          },
        });
        return;
      }
  
      // Procesar y agregar estado a los datos si hay resultados
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
  
      Swal.fire({
        title: 'Sincronización exitosa',
        text: 'Los datos se han sincronizado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        width: '90%',
        heightAuto: false,
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
        },
      });
  
    } catch (error) {
      console.error('Error al cargar los datos:', error);
  
      Swal.fire({
        title: 'Error al sincronizar',
        text: 'No se pudo conectar con la API.',
        icon: 'error',
        width: '90%',
        heightAuto: false,
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
      // this.router.navigate(['/login']);

      if (Capacitor.isNativePlatform()) {
        App.exitApp();
      } else {
        console.log('App.exitApp() solo funciona en dispositivos reales.');
      }

      await new Promise(resolve => setTimeout(resolve, 3000));

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

  async confirmAndSendData() {
    // Mostrar confirmación al usuario
    const result = await Swal.fire({
      title: '¿Estás seguro de enviar la información?',
      text: 'Se enviará toda la información guardada.',
      icon: 'warning',
      showCancelButton: true,
      width: '90%', // Ajusta el ancho
      heightAuto: false, // Evita que el alto sea automático
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
      },
    });

    if (result.isConfirmed) {
      // Llamar a la función para enviar los datos
      await this.sendDataToApi();
    } else {
      Swal.fire({
        title: 'Envío cancelado',
        text: 'No se realizó ningún envío.',
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



  async sendDataToApi() {
    try {
        // Obtener los datos almacenados en caché
        const { value } = await Preferences.get({ key: 'formularios' });
        let formularios = value ? JSON.parse(value) : [];

        if (formularios.length === 0) {
            Swal.fire({
                title: 'No hay datos para enviar',
                text: 'No se encontraron formularios guardados.',
                icon: 'info',
                width: '90%', // Ajusta el ancho
                heightAuto: false, // Evita que el alto sea automático
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        // ✅ URL de la API
        
        //const apiUrl = 'https://g-kaipi.cloud/CB-OnlineLoreto/kservicios/view/subir_cache';
        const apiUrl = localStorage.getItem('apiUrl')+'/kservicios/view/subir_cache';

        let formulariosFallidos = []; // Para almacenar los formularios que no se enviaron correctamente

        for (const formulario of formularios) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formulario)
                });

                const data = await response.json(); // Convertir la respuesta a JSON

                if (!response.ok || data.message !== "Datos recibidos correctamente") {
                    throw new Error(`Error en la API: ${data.message || response.statusText}`);
                }

                console.log('Formulario enviado con éxito:', formulario);
                console.log('Respuesta de la API:', data);

            } catch (error) {
                console.error('Error al enviar formulario:', formulario, error);
                formulariosFallidos.push(formulario); // Mantener este formulario en la caché
            }
        }

        // Si quedan formularios fallidos, actualizar la caché con los que no se enviaron
        if (formulariosFallidos.length > 0) {
            await Preferences.set({ key: 'formularios', value: JSON.stringify(formulariosFallidos) });

            Swal.fire({
                title: 'Algunos datos no se enviaron',
                text: 'Hubo un problema con algunos formularios. Intenta enviarlos de nuevo.',
                icon: 'warning',
                width: '90%', // Ajusta el ancho
                heightAuto: false, // Evita que el alto sea automático
                confirmButtonText: 'Aceptar',
            });

            return; // No cerrar sesión, ya que hay formularios sin enviar
        }

        // ✅ Si todos se enviaron correctamente, limpiar caché y cerrar sesión
        await Preferences.remove({ key: 'formularios' });

        Swal.fire({
            title: 'Datos enviados con éxito',
            text: 'Toda la información se envió correctamente.',
            icon: 'success',
            width: '90%', // Ajusta el ancho
            heightAuto: false, // Evita que el alto sea automático
            confirmButtonText: 'Aceptar',
        });

        // Retraso de 3 segundos antes de cerrar sesión
        await new Promise(resolve => setTimeout(resolve, 5000));

        this.logout(); // Cerrar sesión

    } catch (error) {
        console.error('Error al enviar datos:', error);
        Swal.fire({
            title: 'Error al enviar datos',
            text: 'Hubo un problema al enviar la información.',
            icon: 'error',
            width: '90%', // Ajusta el ancho
            heightAuto: false, // Evita que el alto sea automático
            confirmButtonText: 'Aceptar',
        });
    }
}



  // Función sleep para manejar retrasos
  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
