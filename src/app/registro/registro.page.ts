import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  ////

  itemId: number = 0; // Para almacenar el id recibido de la URL

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id) {
        this.itemId = +id; // Convertir a número solo si id tiene un valor
        this.id_tramite = this.itemId;
        console.log('ID del registro:', this.itemId);

        // Buscar el registro en `datosCargados`
        await this.obtenerDatosTramite(this.id_tramite);
      } else {
        console.error('ID no encontrado en la URL');
      }
    });
  }

  async obtenerDatosTramite(idTramite: number) {
    try {
      // Obtener los datos de `datosCargados`
      const datosCargadosResult = await Preferences.get({
        key: 'datosCargados',
      });
      const datosCargados = datosCargadosResult.value
        ? JSON.parse(datosCargadosResult.value)
        : [];

      // Buscar el registro con el `id_ren_tramite`
      const registro = datosCargados.find(
        (item: any) => item.id_ren_tramite === idTramite
      );

      if (registro) {
        console.log('Registro encontrado:', registro);

        // Aquí puedes asignar los valores específicos a variables
        this.identificacion = registro.idprov || '';
        this.cuu = registro.cuu || 0;
        this.razonSocial = registro.razon || '';
        this.direccion = registro.direccion || '';
        this.sesion = registro.sesion || '';
      } else {
        console.warn(
          `No se encontró ningún registro con id_ren_tramite = ${idTramite}`
        );
      }
    } catch (error) {
      console.error('Error al obtener los datos del trámite:', error);
    }
  }

  async obtenerCoordenadas() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.co_x = position.coords.latitude;
      this.co_y = position.coords.longitude;

      console.log('Coordenadas obtenidas:', {
        co_x: this.co_x,
        co_y: this.co_y,
      });
      //alert(`Latitud: ${this.co_x}, Longitud: ${this.co_y}`);

      Swal.fire({
        title: 'Coordenadas obtenidas:',
        text: `Latitud: ${this.co_x}, Longitud: ${this.co_y}`,
        icon: 'success',
        width: '90%', // Ajusta el ancho
        heightAuto: false, // Evita que el alto sea automático
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error obteniendo coordenadas:', error);
      alert('No se pudo obtener la ubicación. Por favor, revisa los permisos.');

      console.error('Error obteniendo coordenadas:', JSON.stringify(error));
    }
  }

  // async actualizarInformacion() {
  //   try {
  //     const datosFormulario = {
  //       identificacion: this.identificacion,
  //       cuu: this.cuu,
  //       razonSocial: this.razonSocial,
  //       direccion: this.direccion,
  //       correoElectronico: this.correoElectronico,
  //       representanteLegal: this.representanteLegal,
  //       direccionLocal: this.direccionLocal,
  //       areaLocal: this.areaLocal,
  //       tipoConstruccion: this.tipoConstruccion,
  //       riesgoIncendio: this.riesgoIncendio,
  //       ventilacion: this.ventilacion,
  //       bodega: this.bodega,
  //       breakerAdecuado: this.breakerAdecuado,
  //       senalizacion: this.senalizacion,
  //       salidaEmergencia: this.salidaEmergencia,
  //       instalacionAdecuada: this.instalacionAdecuada,
  //       cajasAbiertas: this.cajasAbiertas,
  //       rotuloEcu911: this.rotuloEcu911,
  //       planEmergencia: this.planEmergencia,
  //       nroSurtidores: this.nroSurtidores,
  //       observacion: this.observacion,

  //       // Nuevos valores
  //       id_tramite_carga: this.id_tramite_carga,
  //       sesion: this.sesion,
  //       creacion: this.creacion,
  //       estado: this.estado,
  //       id_tramite: this.id_tramite,
  //       co_x: this.co_x,
  //       co_y: this.co_y,

  //       // Fotos
  //       foto1: this.foto1,
  //       foto2: this.foto2,
  //       foto3: this.foto3,
  //       fotos: this.fotos,
  //     };

  //     const { value } = await Preferences.get({ key: 'formularios' });
  //     const formularios = value ? JSON.parse(value) : [];
  //     formularios.push(datosFormulario);

  //     await Preferences.set({
  //       key: 'formularios',
  //       value: JSON.stringify(formularios),
  //     });

  //     console.log('Información guardada en caché:', datosFormulario);
  //     alert('La información ha sido guardada exitosamente.');
  //   } catch (error) {
  //     console.error('Error al guardar la información:', error);
  //     alert('Hubo un error al guardar la información.');
  //   }
  // }

  async actualizarInformacion() {

    const camposFaltantes = this.validarFormulario(); // Obtiene los campos vacíos

    if (camposFaltantes.length > 0) {
      Swal.fire({
        title: 'Campos incompletos',
        html: `<p>Los siguientes campos son obligatorios:</p><ul style="text-align: left;">${camposFaltantes.map(campo => `<li>${campo}</li>`).join('')}</ul>`,
        icon: 'warning',
        width: '90%', // Ajusta el ancho
        heightAuto: false, // Evita que el alto sea automático
        confirmButtonText: 'Aceptar',
      });
      return; // Detiene la ejecución si hay campos vacíos
    }

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

      // Actualizar los datos en `datosCargados`
      const datosCargadosResult = await Preferences.get({
        key: 'datosCargados',
      });
      let datosCargados = datosCargadosResult.value
        ? JSON.parse(datosCargadosResult.value)
        : [];

      datosCargados = datosCargados.map((item: any) => {
        console.log('Item:', item.id_ren_tramite);
        if (item.id_ren_tramite === this.id_tramite) {
          return { ...item, estado: 'Cerrado' }; // Cambiar el estado a cerrado
        }

        return item;
      });

      await Preferences.set({
        key: 'datosCargados',
        value: JSON.stringify(datosCargados),
      });

      // Actualizar los datos en `formularios`
      const formulariosResult = await Preferences.get({ key: 'formularios' });
      let formularios = formulariosResult.value
        ? JSON.parse(formulariosResult.value)
        : [];

      formularios.push(datosFormulario);

      await Preferences.set({
        key: 'formularios',
        value: JSON.stringify(formularios),
      });

      console.log('Información guardada en caché.');
      console.log('Datos cargados actualizados:', datosCargados);
      console.log('Formulario actualizado:', datosFormulario);

      // Mensaje de éxito
      Swal.fire({
        title: 'La información ha sido guardada exitosamente.',
        text: 'Toda la información se envió correctamente.',
        icon: 'success',
        width: '90%', // Ajusta el ancho
        heightAuto: false, // Evita que el alto sea automático
        confirmButtonText: 'Aceptar',
      });

      this.router.navigate(['/lista']);
    } catch (error) {
      console.error('Error al guardar la información:', error);
      alert('Hubo un error al guardar la información.');
    }
  }

  // ✅ Nueva función mejorada para validar qué campos están vacíos
validarFormulario(): string[] {
  const camposFaltantes: string[] = [];

  if (!this.razonSocial) camposFaltantes.push('Razón Social');
  if (!this.direccion) camposFaltantes.push('Dirección');
  if (!this.direccionLocal) camposFaltantes.push('Dirección Local');
  if (!this.areaLocal) camposFaltantes.push('Área Local');
  if (!this.tipoConstruccion) camposFaltantes.push('Tipo de Construcción');
  if (!this.riesgoIncendio) camposFaltantes.push('Riesgo de Incendio');
  if (!this.ventilacion) camposFaltantes.push('Ventilación');
  if (!this.bodega) camposFaltantes.push('Cuenta con Bodega');
  if (!this.breakerAdecuado) camposFaltantes.push('Breaker Adecuado');
  if (!this.senalizacion) camposFaltantes.push('Señalización');
  if (!this.salidaEmergencia) camposFaltantes.push('Salida de Emergencia');
  if (!this.instalacionAdecuada) camposFaltantes.push('Instalación Adecuada');
  if (!this.cajasAbiertas) camposFaltantes.push('Cajas Abiertas');
  if (!this.rotuloEcu911) camposFaltantes.push('Rótulo ECU 911');
  if (!this.planEmergencia) camposFaltantes.push('Plan de Emergencia');
  if (!this.observacion) camposFaltantes.push('Observación');
  if (!this.co_x) camposFaltantes.push('Coordenadas');
  if (!this.foto1) camposFaltantes.push('Mìnimo una foto');
  

  return camposFaltantes; // Devuelve la lista de campos vacíos
}


  

  async manejarFotos(event?: Event) {
    try {
      if (this.fotos.length >= 3) {
        alert('Ya has seleccionado el máximo de 3 fotos.');
        return;
      }

      if (event) {
        // Manejar selección desde el input de archivos
        const input = event.target as HTMLInputElement;
        if (input.files) {
          const archivos = Array.from(input.files);

          archivos.forEach((archivo) => {
            if (this.fotos.length < 3) {
              const reader = new FileReader();
              reader.onload = () => {
                const fotoBase64 = reader.result as string;
                this.fotos.push(fotoBase64);

                // Asignar nombres únicos
                const timestamp = Date.now();
                if (this.fotos.length === 1)
                  this.foto1 = `foto1_${timestamp}_${archivo.name}`;
                if (this.fotos.length === 2)
                  this.foto2 = `foto2_${timestamp}_${archivo.name}`;
                if (this.fotos.length === 3)
                  this.foto3 = `foto3_${timestamp}_${archivo.name}`;
              };
              reader.readAsDataURL(archivo);
            }
          });
        }
      } else {
        // Manejar selección desde cámara/galería
        const image = await Camera.getPhoto({
          quality: 90,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos,
        });

        const fotoBase64 = image.dataUrl || '';
        this.fotos.push(fotoBase64);

        // Asignar nombres únicos
        const timestamp = Date.now();
        if (this.fotos.length === 1) this.foto1 = `foto1_${timestamp}.jpg`;
        if (this.fotos.length === 2) this.foto2 = `foto2_${timestamp}.jpg`;
        if (this.fotos.length === 3) this.foto3 = `foto3_${timestamp}.jpg`;
      }
    } catch (error) {
      console.error('Error manejando fotos:', error);
      alert('No se pudo procesar la foto. Intenta nuevamente.');
    }
  }

  eliminarFoto(index: number) {
    if (index > -1) {
      this.fotos.splice(index, 1); // Elimina la foto del array
      console.log(`Foto en índice ${index} eliminada.`);
    }
  }

  goBack() {
    // this.navCtrl.back();
    this.router.navigate(['/lista']);
  }
}
