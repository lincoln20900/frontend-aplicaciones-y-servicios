import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { CitaVacunacionRead, CitaVacunacionUpdate } from '../models/api.models';

const apiUrl = environment.apiUrl + '/citas';
declare const bootstrap: any;

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss']
})
export class CitasComponent implements OnInit, AfterViewInit {

  citas: CitaVacunacionRead[] = [];
  loading: boolean = false;
  error: string | null = null;

  // Modales
  modalCrearInstance: any;
  modalEditarInstance: any;

  @ViewChild('crearCitaModal') crearCitaModal!: ElementRef;
  @ViewChild('editarCitaModal') editarCitaModal!: ElementRef;

  nuevaCita: any = {
    mascota_id: '',
    vacuna_id: '',
    veterinario_id: '',
    fecha: '',
    estado: 'programada'
  };

  citaForm: CitaVacunacionRead & { id?: number } = {
    id: undefined,
    mascota_id: 0,
    vacuna_id: 0,
    veterinario_id: 0,
    fecha: '',
    estado: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerCitas();
  }

  ngAfterViewInit(): void {
    this.modalCrearInstance = new bootstrap.Modal(this.crearCitaModal.nativeElement);
    this.modalEditarInstance = new bootstrap.Modal(this.editarCitaModal.nativeElement);
  }

  obtenerCitas(): void {
    this.loading = true;
    this.error = null;

    this.http.get<any>(apiUrl).subscribe({
      next: (res) => {
        this.citas = res.datos || res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener citas:', err);
        this.error = 'No se pudieron cargar las citas';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las citas'
        });
      }
    });
  }

  abrirModal(): void {
    this.modalCrearInstance.show();
  }

  cerrarModal(): void {
    if (this.modalCrearInstance) this.modalCrearInstance.hide();
    if (this.modalEditarInstance) this.modalEditarInstance.hide();
  }

  crearCita(): void {
    this.http.post<any>(apiUrl, this.nuevaCita).subscribe({
      next: (res) => {
        const citaCreada = res.datos || res;
        this.citas.push(citaCreada);
        this.cerrarModal();
        this.nuevaCita = { 
          mascota_id: '', 
          vacuna_id: '', 
          veterinario_id: '', 
          fecha: '', 
          estado: 'programada' 
        };
        Swal.fire('Éxito', 'Cita creada correctamente', 'success');
      },
      error: () => Swal.fire('Error', 'No se pudo crear la cita', 'error')
    });
  }

  editarCita(cita: any): void {
    this.citaForm = { ...cita };
    this.modalEditarInstance.show();
  }

  guardarCambios(): void {
    const url = `${apiUrl}/${this.citaForm.id}`;
    const payload: CitaVacunacionUpdate = {
      mascota_id: this.citaForm.mascota_id,
      vacuna_id: this.citaForm.vacuna_id,
      veterinario_id: this.citaForm.veterinario_id,
      fecha: this.citaForm.fecha,
      estado: this.citaForm.estado
    };

    this.http.put<any>(url, payload).subscribe({
      next: () => {
        this.obtenerCitas();
        this.cerrarModal();
        Swal.fire('Éxito', 'Cita actualizada correctamente', 'success');
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar la cita', 'error')
    });
  }

  eliminarCita(citaId?: number): void {
    if (!citaId) {
      return;
    }

    if (!confirm('¿Seguro que deseas eliminar esta cita?')) {
      return;
    }

    this.http.delete<any>(`${apiUrl}/${citaId}`).subscribe({
      next: () => {
        Swal.fire('Eliminada', 'Cita eliminada correctamente', 'success');
        this.obtenerCitas();
      },
      error: () => Swal.fire('Error', 'No se pudo eliminar la cita', 'error')
    });
  }
}
