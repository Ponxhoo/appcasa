import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class RegistroPage {
  identificacion: string = '';
  cuu: number = 0;
  razonSocial: string = '';
  direccion: string = '';
  correoElectronico: string = '';
  representanteLegal: string = '';
  direccionLocal: string = '';
  areaLocal: number = 0;
  tipoConstruccion: string = '';
  riesgoIncendio: string = '';
  ventilacion: string = '';

  // Implementos
  bodega: string = 'Si';
  breakerAdecuado: string = 'Si';
  senalizacion: string = 'Si';
  salidaEmergencia: string = 'Si';
  instalacionAdecuada: string = 'Si';
  cajasAbiertas: string = 'Si';
  rotuloEcu911: string = 'Si';
  planEmergencia: string = 'Si';
  nroSurtidores: number | null = null;
  observacion: string = '';

  // Nuevos valores
  id_tramite_carga: number | null = null; // Serial
  sesion: string = '';
  creacion: string = '';
  estado: string = 'P'; // Estado inicial: pendiente
  id_tramite: number | null = null;
  co_x: number | null = null; // Coordenada X
  co_y: number | null = null; // Coordenada Y

  // Fotos
  foto1: string | null = null;
  foto2: string | null = null;
  foto3: string | null = null;
  fotos: string[] = []; // Array para almacenar las fotos seleccionadas

  constructor() {}

  async obtenerCoordenadas() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.co_x = position.coords.latitude;
      this.co_y = position.coords.longitude;

      console.log('Coordenadas obtenidas:', { co_x: this.co_x, co_y: this.co_y });
      alert(`Latitud: ${this.co_x}, Longitud: ${this.co_y}`);
    } catch (error) {
      console.error('Error obteniendo coordenadas:', error);
      alert('No se pudo obtener la ubicación. Por favor, revisa los permisos.');
    }
  }

  async subirFotos() {
    try {
      if (this.fotos.length >= 3) {
        alert('Ya has seleccionado el máximo de 3 fotos.');
        return;
      }
  
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl, // Usar DataUrl para obtener la imagen en base64
        source: CameraSource.Photos, // Selección desde la galería
      });
  
      const fotoBase64 = image.dataUrl || ''; // Ruta base64 de la imagen
      this.fotos.push(fotoBase64); // Agregar al array de fotos
  
      // Asignar nombres únicos a las fotos
      const timestamp = Date.now();
      if (this.fotos.length === 1) this.foto1 = `foto1_${timestamp}.jpg`;
      if (this.fotos.length === 2) this.foto2 = `foto2_${timestamp}.jpg`;
      if (this.fotos.length === 3) this.foto3 = `foto3_${timestamp}.jpg`;
  
      console.log('Foto seleccionada:', fotoBase64);
      console.log('Nombres asignados:', { foto1: this.foto1, foto2: this.foto2, foto3: this.foto3 });
    } catch (error) {
      console.error('Error seleccionando foto:', error);
      alert('No se pudo seleccionar la foto. Intenta nuevamente.');
    }
  }

  async actualizarInformacion() {
    try {
      const datosFormulario = {
        identificacion: this.identificacion,
        cuu: this.cuu,
        razonSocial: this.razonSocial,
        direccion: this.direccion,
        correoElectronico: this.correoElectronico,
        representanteLegal: this.representanteLegal,
        direccionLocal: this.direccionLocal,
        areaLocal: this.areaLocal,
        tipoConstruccion: this.tipoConstruccion,
        riesgoIncendio: this.riesgoIncendio,
        ventilacion: this.ventilacion,
        bodega: this.bodega,
        breakerAdecuado: this.breakerAdecuado,
        senalizacion: this.senalizacion,
        salidaEmergencia: this.salidaEmergencia,
        instalacionAdecuada: this.instalacionAdecuada,
        cajasAbiertas: this.cajasAbiertas,
        rotuloEcu911: this.rotuloEcu911,
        planEmergencia: this.planEmergencia,
        nroSurtidores: this.nroSurtidores,
        observacion: this.observacion,

        // Nuevos valores
        id_tramite_carga: this.id_tramite_carga,
        sesion: this.sesion,
        creacion: this.creacion,
        estado: this.estado,
        id_tramite: this.id_tramite,
        co_x: this.co_x,
        co_y: this.co_y,

        // Fotos
        foto1: this.foto1,
        foto2: this.foto2,
        foto3: this.foto3,
        fotos: this.fotos,
      };

      const { value } = await Preferences.get({ key: 'formularios' });
      const formularios = value ? JSON.parse(value) : [];
      formularios.push(datosFormulario);

      await Preferences.set({
        key: 'formularios',
        value: JSON.stringify(formularios),
      });

      console.log('Información guardada en caché:', datosFormulario);
      alert('La información ha sido guardada exitosamente.');
    } catch (error) {
      console.error('Error al guardar la información:', error);
      alert('Hubo un error al guardar la información.');
    }
  }

  seleccionarFotos(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const archivos = Array.from(input.files);
      archivos.forEach((archivo, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (this.fotos.length < 3) {
            // Almacenar la foto en base64 en el array
            this.fotos.push(reader.result as string);
  
            // Asignar nombres únicos a las fotos
            const timestamp = Date.now();
            if (this.fotos.length === 1) this.foto1 = `foto1_${timestamp}_${archivo.name}`;
            if (this.fotos.length === 2) this.foto2 = `foto2_${timestamp}_${archivo.name}`;
            if (this.fotos.length === 3) this.foto3 = `foto3_${timestamp}_${archivo.name}`;
  
            console.log('Foto seleccionada:', reader.result);
            console.log('Nombres asignados:', { foto1: this.foto1, foto2: this.foto2, foto3: this.foto3 });
          } else {
            alert('Solo puedes seleccionar hasta 3 fotos.');
          }
        };
        reader.readAsDataURL(archivo);
      });
    }
  }
  
}
