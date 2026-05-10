import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { UsuarioRead, UsuarioCreate, UsuarioUpdate } from '../models/api.models';

const apiUrl = environment.apiUrl + '/usuarios';
declare const bootstrap: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, AfterViewInit {

  usuarios: UsuarioRead[] = [];
  loading: boolean = false;
  error: string | null = null;

  modalCrearInstance: any;
  modalEditarInstance: any;

  @ViewChild('crearUsuarioModal') crearUsuarioModal!: ElementRef;
  @ViewChild('editarUsuarioModal') editarUsuarioModal!: ElementRef;

  nuevoUsuario: UsuarioCreate = {
    email: '',
    rol: 'cliente',
    cliente_id: null,
    veterinario_id: null,
  };

  usuarioForm: UsuarioUpdate & { id?: number } = {
    id: undefined,
    email: '',
    rol: 'cliente',
    cliente_id: null,
    veterinario_id: null,
  };

  modoEdicion: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.modalCrearInstance = new bootstrap.Modal(this.crearUsuarioModal.nativeElement);
    this.modalEditarInstance = new bootstrap.Modal(this.editarUsuarioModal.nativeElement);
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

  abrirModalCrear(): void {
    this.resetCrearFormulario();
    this.modalCrearInstance.show();
  }

  cerrarModal(): void {
    if (this.modalCrearInstance) {
      this.modalCrearInstance.hide();
    }
    if (this.modalEditarInstance) {
      this.modalEditarInstance.hide();
    }
  }

  private resetCrearFormulario(): void {
    this.nuevoUsuario = {
      email: '',
      rol: 'cliente',
      cliente_id: null,
      veterinario_id: null,
    };
  }

  private normalizeNumber(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  crearUsuario(): void {
    const payload: UsuarioCreate = {
      email: this.nuevoUsuario.email,
      rol: this.nuevoUsuario.rol,
      cliente_id: this.normalizeNumber(this.nuevoUsuario.cliente_id),
      veterinario_id: this.normalizeNumber(this.nuevoUsuario.veterinario_id),
    };

    this.http.post<UsuarioRead>(apiUrl, payload).subscribe({
      next: (res) => {
        this.usuarios.push(res);
        this.cerrarModal();
        this.resetCrearFormulario();
        Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        Swal.fire('Error', 'No se pudo crear el usuario.', 'error');
      }
    });
  }

  editarUsuario(usuario: UsuarioRead): void {
    this.modoEdicion = true;
    this.usuarioForm = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      cliente_id: usuario.cliente_id ?? null,
      veterinario_id: usuario.veterinario_id ?? null,
    };
    this.modalEditarInstance.show();
  }

  guardarCambios(): void {
    if (!this.usuarioForm.id) {
      return;
    }

    const payload: UsuarioUpdate = {
      email: this.usuarioForm.email,
      rol: this.usuarioForm.rol,
      cliente_id: this.normalizeNumber(this.usuarioForm.cliente_id),
      veterinario_id: this.normalizeNumber(this.usuarioForm.veterinario_id),
    };

    const url = `${apiUrl}/${this.usuarioForm.id}`;
    this.http.put<UsuarioRead>(url, payload).subscribe({
      next: () => {
        this.obtenerUsuarios();
        this.cerrarModal();
        this.modoEdicion = false;
        Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
      }
    });
  }

  eliminarUsuario(usuarioId: number): void {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) {
      return;
    }

    const url = `${apiUrl}/${usuarioId}`;
    this.http.delete<{ exito: boolean; mensaje: string }>(url).subscribe({
      next: (response) => {
        if (response?.exito) {
          Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
          this.obtenerUsuarios();
        } else {
          Swal.fire('Error', response?.mensaje || 'No se pudo eliminar el usuario.', 'error');
        }
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    });
  }
}
