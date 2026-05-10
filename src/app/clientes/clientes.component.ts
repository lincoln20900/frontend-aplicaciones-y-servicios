import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
}

const apiUrl = environment.apiUrl + '/clientes';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.loading = true;
    this.error = null;
    
    this.http.get<Cliente[]>(apiUrl).subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener clientes:', err);
        this.error = 'No se pudieron cargar los clientes';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los clientes'
        });
      }
    });
  }
}
