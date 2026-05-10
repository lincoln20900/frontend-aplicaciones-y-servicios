import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

declare const bootstrap: any;

export interface Vacuna {
  id: number;
  nombre: string;
  fabricante: string;
  dosis_requeridas: number;
}

export interface VacunaCreate {
  nombre: string;
  fabricante: string;
  dosis_requeridas: number;
}

const apiUrl = environment.apiUrl + '/vacunas';

@Component({
  selector: 'app-vacuna',
  templateUrl: './vacuna.component.html',
  styleUrls: ['./vacuna.component.scss']
})
export class VacunaComponent implements OnInit, AfterViewInit {

  vacunas: Vacuna[] = [];
  loading: boolean = false;
  error: string | null = null;

  modalCrearInstance: any;
  modalEditarInstance: any;

  @ViewChild('crearVacunaModal') crearVacunaModal!: ElementRef;
  @ViewChild('editarVacunaModal') editarVacunaModal!: ElementRef;

  nuevaVacuna: VacunaCreate = {
    nombre: '',
    fabricante: '',
    dosis_requeridas: 0
  };

  vacunaForm: Vacuna & { id?: number } = {
    id: undefined,
    nombre: '',
    fabricante: '',
    dosis_requeridas: 0
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerVacunas();
  }

  ngAfterViewInit(): void {
    this.modalCrearInstance = new bootstrap.Modal(this.crearVacunaModal.nativeElement);
    this.modalEditarInstance = new bootstrap.Modal(this.editarVacunaModal.nativeElement);
  }

  obtenerVacunas(): void {
    this.loading = true;
    this.error = null;
    
    this.http.get<Vacuna[]>(apiUrl).subscribe({
      next: (data) => {
        this.vacunas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener vacunas:', err);
        this.error = 'No se pudieron cargar las vacunas';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las vacunas'
        });
      }
    });
  }

  abrirModalCrear(): void {
    this.nuevaVacuna = {
      nombre: '',
      fabricante: '',
      dosis_requeridas: 0
    };
    this.modalCrearInstance.show();
  }

  crearVacuna(): void {
    this.http.post<Vacuna>(apiUrl, this.nuevaVacuna).subscribe({
      next: (res) => {
        this.vacunas.push(res);
        this.modalCrearInstance.hide();
        Swal.fire('Éxito', 'Vacuna creada correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al crear vacuna:', err);
        Swal.fire('Error', 'No se pudo crear la vacuna.', 'error');
      }
    });
  }

  editarVacuna(vacuna: Vacuna): void {
    this.vacunaForm = {
      id: vacuna.id,
      nombre: vacuna.nombre,
      fabricante: vacuna.fabricante,
      dosis_requeridas: vacuna.dosis_requeridas
    };
    this.modalEditarInstance.show();
  }

  guardarCambios(): void {
    if (!this.vacunaForm.id) {
      return;
    }

    const payload: VacunaCreate = {
      nombre: this.vacunaForm.nombre,
      fabricante: this.vacunaForm.fabricante,
      dosis_requeridas: this.vacunaForm.dosis_requeridas
    };

    this.http.put<Vacuna>(`${apiUrl}/${this.vacunaForm.id}`, payload).subscribe({
      next: () => {
        this.obtenerVacunas();
        this.modalEditarInstance.hide();
        Swal.fire('Éxito', 'Vacuna actualizada correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al actualizar vacuna:', err);
        Swal.fire('Error', 'No se pudo actualizar la vacuna.', 'error');
      }
    });
  }

  eliminarVacuna(vacunaId: number): void {
    if (!confirm('¿Seguro que deseas eliminar esta vacuna?')) {
      return;
    }

    this.http.delete<Vacuna>(`${apiUrl}/${vacunaId}`).subscribe({
      next: () => {
        Swal.fire('Eliminada', 'Vacuna eliminada correctamente', 'success');
        this.obtenerVacunas();
      },
      error: (err) => {
        console.error('Error al eliminar vacuna:', err);
        Swal.fire('Error', 'No se pudo eliminar la vacuna.', 'error');
      }
    });
  }
}
