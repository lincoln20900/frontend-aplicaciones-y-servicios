import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { MascotaRead } from '../models/api.models';

const apiUrl = environment.apiUrl + '/mascotas';
declare const bootstrap: any;

@Component({
  selector: 'app-animales',
  templateUrl: './animales.component.html',
  styleUrls: ['./animales.component.scss']
})
export class AnimalesComponent implements OnInit, AfterViewInit {

  animales: MascotaRead[] = [];
  loading: boolean = false;
  error: string | null = null;
  
  // Modal instances
  modalCrearInstance: any;
  modalEditarInstance: any;

  @ViewChild('crearAnimalModal') crearAnimalModal: ElementRef;
  @ViewChild('editarAnimalModal') editarAnimalModal: ElementRef;
  
  // Nuevo animal form
  nuevoAnimal: any = {
    nombre: '',
    edad: '',
    genero_id: '',
    raza_id: '',
    usuario_id: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerAnimales();
  }

  ngAfterViewInit(): void {
    this.modalCrearInstance = new bootstrap.Modal(this.crearAnimalModal.nativeElement);
    this.modalEditarInstance = new bootstrap.Modal(this.editarAnimalModal.nativeElement);
  }

  obtenerAnimales(): void {
    this.loading = true;
    this.error = null;

    this.http.get<MascotaRead[]>(apiUrl).subscribe({
      next: (data) => {
        this.animales = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener mascotas:', err);
        this.error = 'No se pudieron cargar las mascotas';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las mascotas'
        });
      }
    });
  }

  /** Modal Crear Animal */
  abrirModal(): void {
    this.modalCrearInstance.show();
  }

  /** Cerrar cualquier modal */
  cerrarModal(): void {
    if (this.modalCrearInstance) this.modalCrearInstance.hide();
    if (this.modalEditarInstance) this.modalEditarInstance.hide();
  }

  /** Crear Animal */
  crearAnimal(): void {
    this.http.post<any>(apiUrl, this.nuevoAnimal).subscribe({
      next: (res) => {
        this.animales.push(res);
        this.cerrarModal();
        this.nuevoAnimal = {
          nombre: '',
          edad: '',
          genero_id: '',
          raza_id: '',
          usuario_id: ''
        };
      },
      error: () => {
        alert('Error al crear el animal.');
      }
    });
  }

  /** Eliminar Animal */
  eliminarAnimal(id_animal: number | string): void {
    if (!confirm('¿Seguro que deseas eliminar este animal?')) return;

    const url = `${apiUrl}/${id_animal}`;
    console.log('🗑️ Eliminando animal con ID:', id_animal);

    this.http.delete<any>(url).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del servidor:', response);

        if (response.exito) {
          alert(`Animal eliminado correctamente.`);
          this.obtenerAnimales();
        } else {
          alert(`No se pudo eliminar el animal: ${response.mensaje}`);
        }
      },
      error: (err) => {
        console.error('❌ Error al eliminar el animal:', err);
        alert('Error al eliminar el animal. Verifica la conexión con la API.');
      }
    });
  }
  
  /*EN CONTRUCCIÓN */
  /** -------------------------
   *  EDICIÓN DE ANIMAL
   * ------------------------- */
  modoEdicion: boolean = false;
  animalForm: any = { 
    id: '',
    nombre: '', 
    edad: '', 
    genero_id: '', 
    raza_id: '', 
    usuario_id: '' 
  };

  // Abrir modal de edición
  editarAnimal(animal: any): void {
    this.modoEdicion = true;
    this.animalForm = {
      id: animal.id,
      nombre: animal.nombre,
      edad: animal.edad,
      genero_id: animal.genero_id,
      raza_id: animal.raza_id,
      usuario_id: animal.usuario_id
    };
    this.modalEditarInstance.show();
  }
  // Guardar cambios del animal editado
  guardarCambios(): void {
    const url = `${apiUrl}/${this.animalForm.id}`;
    const payload = {
      nombre: this.animalForm.nombre,
      edad: this.animalForm.edad,
      genero_id: this.animalForm.genero_id,
      raza_id: this.animalForm.raza_id,
      usuario_id: this.animalForm.usuario_id
    };

    console.log('📦 Payload que se enviará:', payload); 

    this.http.put<any>(url, payload).subscribe({
      next: (response) => {
        this.obtenerAnimales();
        this.cerrarModal();
        this.modoEdicion = false;
        Swal.fire('Éxito', 'Animal actualizado correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al editar animal:', err);
        Swal.fire('Error', 'Error al editar el animal.', 'error');
      }
    });
  }

   /*Buscar animales por ID de propietario*/
  buscarAnimalesPorPropietario(id_usuario: string): void {
    if (!id_usuario) {
      alert('Por favor, ingresa un ID de propietario.');
      return;
    }

    const url = `${apiUrl}/propietario/${id_usuario}`;
    this.loading = true;
    this.error = null;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.animales = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al buscar animales por propietario:', err);
        this.error = 'No se pudieron obtener los animales del propietario.';
        this.loading = false;
      }
    });
  }



}
