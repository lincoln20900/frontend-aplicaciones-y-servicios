import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { UsuarioRead } from '../models/api.models';

const apiUrl = environment.apiUrl + '/usuarios';
declare const bootstrap: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  usuarios: UsuarioRead[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.loading = true;
    this.error = null;

    this.http.get<UsuarioRead[]>(apiUrl).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        this.error = 'No se pudieron cargar los usuarios';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los usuarios'
        });
      }
    });
  }
}
