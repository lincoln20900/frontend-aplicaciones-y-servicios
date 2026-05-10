import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

export interface Sede {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

const apiUrl = environment.apiUrl + '/sedes';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.scss']
})
export class SedeComponent implements OnInit {

  sedes: Sede[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerSedes();
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
}
