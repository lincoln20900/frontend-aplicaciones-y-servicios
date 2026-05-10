import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

export interface Veterinario {
  id: number;
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
export class VeterinarioComponent implements OnInit {

  veterinarios: Veterinario[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerVeterinarios();
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
}
