import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

export interface Vacuna {
  id: number;
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
export class VacunaComponent implements OnInit {

  vacunas: Vacuna[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerVacunas();
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
}
