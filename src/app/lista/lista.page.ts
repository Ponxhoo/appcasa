import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences'; // Importa Preferences para acceder al caché
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class ListaPage {
  // Arreglos para las listas
  items: any[] = []; // Lista actual a mostrar
  pendientes: any[] = []; // Lista de pendientes
  aprobados: any[] = []; // Lista de aprobados (si decides añadirla en el futuro)

  constructor(private router: Router, private navCtrl: NavController) {}

  
  ngOnInit() {
    this.validarSesion(); // Validar sesión al cargar la vista
  }

  async ionViewWillEnter() {
    // Cargar datos desde el caché
    const { value } = await Preferences.get({ key: 'datosCargados' });
    const cachedData = value ? JSON.parse(value) : [];

    // Asignar los datos a la lista de pendientes y añadir "estado"
    this.pendientes = cachedData.map((item: any) => ({
      ...item,
      estado: item.estado || 'pendiente', // Asegurarse de que tenga estado
      title: item.nombre || `Trámite ${item.id}`, // Asignar un título genérico si no hay nombre
      description: item.direccion || 'Sin descripción', // Asignar una descripción genérica si no hay dirección
      identificacion: item.idprov || 'Sin identificación', // Asignar una identificación genérica si no hay identificación
      razon : item.razon || 'Sin razón', // Asignar una razón genérica si no hay razón
      id: item.id_ren_tramite, // Asignar el ID del trámite
    }));

    // Mostrar pendientes por defecto
    this.items = this.pendientes;
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

  onSegmentChange(event: any) {
    const selectedSegment = event.detail.value;

    if (selectedSegment === 'pendientes') {
      this.items = this.pendientes;
    } else if (selectedSegment === 'aprobados') {
      this.items = this.aprobados; // Cambiar a lista de aprobados si se implementa
    }
  }

  goToRegistro(itemId: number) {
    this.router.navigate(['/registro', itemId]); // Navegar a la vista de registro con el ID
  }

  goBack() {
    // this.navCtrl.back(); // Regresar a la vista anterior
    this.router.navigate(['/home']);
  }
}
