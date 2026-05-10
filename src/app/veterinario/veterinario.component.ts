import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

declare const bootstrap: any;

export interface Veterinario {
  id: number;
  nombre: string;
  especialidad: string;
  sede_id: number;
}

export interface VeterinarioUpdate {
  nombre: string;
  especialidad: string;
  sede_id: number;
}

export interface VeterinarioCreate {
  nombre: string;
  especialidad: string;
  sede_id: number;
}

const apiUrl = environment.apiUrl + '/veterinarios';

@Component({
  selector: 'app-veterinario',
  templateUrl: './veterinario.component.html',
  styleUrls: ['./veterinario.component.scss']
})
export class VeterinarioComponent implements OnInit, AfterViewInit {

  veterinarios: Veterinario[] = [];
  loading: boolean = false;
  error: string | null = null;

  modalCrearInstance: any;
  modalEditarInstance: any;

  @ViewChild('crearVeterinarioModal') crearVeterinarioModal!: ElementRef;
  @ViewChild('editarVeterinarioModal') editarVeterinarioModal!: ElementRef;

  nuevaVeterinario: VeterinarioCreate = {
    nombre: '',
    especialidad: '',
    sede_id: 0
  };

  veterinarioForm: Veterinario & { id?: number } = {
    id: undefined,
    nombre: '',
    especialidad: '',
    sede_id: 0
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerVeterinarios();
  }

  ngAfterViewInit(): void {
    this.modalCrearInstance = new bootstrap.Modal(this.crearVeterinarioModal.nativeElement);
    this.modalEditarInstance = new bootstrap.Modal(this.editarVeterinarioModal.nativeElement);
  }

  abrirModalCrear(): void {
    this.nuevaVeterinario = {
      nombre: '',
      especialidad: '',
      sede_id: 0
    };
    this.modalCrearInstance.show();
  }

  crearVeterinario(): void {
    this.http.post<Veterinario>(apiUrl, this.nuevaVeterinario).subscribe({
      next: (res) => {
        this.veterinarios.push(res);
        this.modalCrearInstance.hide();
        Swal.fire('Éxito', 'Veterinario creado correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al crear veterinario:', err);
        Swal.fire('Error', 'No se pudo crear el veterinario.', 'error');
      }
    });
  }

  obtenerVeterinarios(): void {
    this.loading = true;
    this.error = null;
    
    this.http.get<Veterinario[]>(apiUrl).subscribe({
      next: (data) => {
        this.veterinarios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener veterinarios:', err);
        this.error = 'No se pudieron cargar los veterinarios';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los veterinarios'
        });
      }
    });
  }

  editarVeterinario(veterinario: Veterinario): void {
    this.veterinarioForm = {
      id: veterinario.id,
      nombre: veterinario.nombre,
      especialidad: veterinario.especialidad,
      sede_id: veterinario.sede_id
    };
    this.modalEditarInstance.show();
  }

  guardarCambios(): void {
    if (!this.veterinarioForm.id) {
      return;
    }

    const payload: VeterinarioUpdate = {
      nombre: this.veterinarioForm.nombre,
      especialidad: this.veterinarioForm.especialidad,
      sede_id: this.veterinarioForm.sede_id
    };

    this.http.put<Veterinario>(`${apiUrl}/${this.veterinarioForm.id}`, payload).subscribe({
      next: () => {
        this.obtenerVeterinarios();
        this.modalEditarInstance.hide();
        Swal.fire('Éxito', 'Veterinario actualizado correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al actualizar veterinario:', err);
        Swal.fire('Error', 'No se pudo actualizar el veterinario.', 'error');
      }
    });
  }

  eliminarVeterinario(veterinarioId: number): void {
    if (!confirm('¿Seguro que deseas eliminar este veterinario?')) {
      return;
    }

    this.http.delete<Veterinario>(`${apiUrl}/${veterinarioId}`).subscribe({
      next: () => {
        Swal.fire('Eliminado', 'Veterinario eliminado correctamente', 'success');
        this.obtenerVeterinarios();
      },
      error: (err) => {
        console.error('Error al eliminar veterinario:', err);
        Swal.fire('Error', 'No se pudo eliminar el veterinario.', 'error');
      }
    });
  }
}
