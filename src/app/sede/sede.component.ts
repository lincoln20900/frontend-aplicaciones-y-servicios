import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

declare const bootstrap: any;

export interface Sede {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface SedeCreate {
  nombre: string;
  direccion: string;
  telefono: string;
}

const apiUrl = environment.apiUrl + '/sedes';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.scss']
})
export class SedeComponent implements OnInit, AfterViewInit {

  sedes: Sede[] = [];
  loading: boolean = false;
  error: string | null = null;

  modalCrearInstance: any;
  modalEditarInstance: any;

  constructor(private http: HttpClient, private authService: AuthService) { }

  @ViewChild('crearSedeModal') crearSedeModal!: ElementRef;
  @ViewChild('editarSedeModal') editarSedeModal!: ElementRef;

  nuevoSede: SedeCreate = {
    nombre: '',
    telefono: '',
    direccion: ''
  };

  sedeForm: Sede & { id?: number } = {
    id: undefined,
    nombre: '',
    telefono: '',
    direccion: ''
  };

  private getAuthOptions(): { headers: { [header: string]: string } } {
    const headers = this.authService.getAuthHeaders();
    if (!headers || !headers['Authorization']) {
      Swal.fire('Error', 'No estás autenticado. Inicia sesión nuevamente.', 'error');
      throw new Error('No auth token available');
    }
    return { headers };
  }

  ngOnInit(): void {
    this.obtenerSedes();
  }

  ngAfterViewInit(): void {
    this.modalCrearInstance = new bootstrap.Modal(this.crearSedeModal.nativeElement);
    this.modalEditarInstance = new bootstrap.Modal(this.editarSedeModal.nativeElement);
  }

  obtenerSedes(): void {
    this.loading = true;
    this.error = null;
    
    this.http.get<Sede[]>(apiUrl).subscribe({
      next: (data) => {
        this.sedes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener sedes:', err);
        this.error = 'No se pudieron cargar las sedes';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las sedes'
        });
      }
    });
  }

  abrirModalCrear(): void {
    this.nuevoSede = {
      nombre: '',
      telefono: '',
      direccion: ''
    };
    this.modalCrearInstance.show();
  }

  crearSede(): void {
    let options: { headers: { [header: string]: string } };
    try {
      options = this.getAuthOptions();
    } catch {
      return;
    }

    this.http.post<Sede>(apiUrl, this.nuevoSede, options).subscribe({
      next: (res) => {
        this.sedes.push(res);
        this.modalCrearInstance.hide();
        Swal.fire('Éxito', 'Sede creada correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al crear sede:', err);
        const message = err?.error?.detail || err?.message || 'No se pudo crear la sede.';
        Swal.fire('Error', message, 'error');
      }
    });
  }

  editarSede(sede: Sede): void {
    this.sedeForm = {
      id: sede.id,
      nombre: sede.nombre,
      telefono: sede.telefono,
      direccion: sede.direccion
    };
    this.modalEditarInstance.show();
  }

  guardarCambios(): void {
    if (!this.sedeForm.id) {
      return;
    }

    const payload: SedeCreate = {
      nombre: this.sedeForm.nombre,
      telefono: this.sedeForm.telefono,
      direccion: this.sedeForm.direccion
    };

    let options: { headers: { [header: string]: string } };
    try {
      options = this.getAuthOptions();
    } catch {
      return;
    }

    this.http.put<Sede>(`${apiUrl}/${this.sedeForm.id}`, payload, options).subscribe({
      next: () => {
        this.obtenerSedes();
        this.modalEditarInstance.hide();
        Swal.fire('Éxito', 'Sede actualizada correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al actualizar sede:', err);
        const message = err?.error?.detail || err?.message || 'No se pudo actualizar la sede.';
        if (err?.status === 401) {
          Swal.fire('Error', 'No autorizado. Inicia sesión nuevamente.', 'error');
        } else if (err?.status === 404) {
          Swal.fire('Error', 'Sede no encontrada. Recarga la página.', 'error');
        } else {
          Swal.fire('Error', message, 'error');
        }
      }
    });
  }

  eliminarSede(sedeId: number): void {
    if (!confirm('¿Seguro que deseas eliminar esta sede?')) {
      return;
    }

    let options: { headers: { [header: string]: string } };
    try {
      options = this.getAuthOptions();
    } catch {
      return;
    }

    this.http.delete<Sede>(`${apiUrl}/${sedeId}`, options).subscribe({
      next: () => {
        Swal.fire('Eliminada', 'Sede eliminada correctamente', 'success');
        this.obtenerSedes();
      },
      error: (err) => {
        console.error('Error al eliminar sede:', err);
        const message = err?.error?.detail || err?.message || 'No se pudo eliminar la sede.';
        Swal.fire('Error', message, 'error');
      }
    });
  }
}
