import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { CitaVacunacionRead } from '../models/api.models';

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

  @ViewChild('crearCitaModal') crearCitaModal: ElementRef;
  @ViewChild('editarCitaModal') editarCitaModal: ElementRef;

  nuevaCita: any = {
    mascota_id: '',
    vacuna_id: '',
    veterinario_id: '',
    fecha: '',
    estado: 'programada'
  };

  citaForm: any = {
    id: '',
    mascota_id: '',
    vacuna_id: '',
    veterinario_id: '',
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
    this.http.put<any>(url, this.citaForm).subscribe({
      next: () => {
        this.obtenerCitas();
        this.cerrarModal();
        Swal.fire('Éxito', 'Cita actualizada correctamente', 'success');
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar la cita', 'error')
    });
  }
}
