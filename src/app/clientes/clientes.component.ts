import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

declare const bootstrap: any;

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
}

export interface ClienteUpdate {
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface ClienteCreate {
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
export class ClientesComponent implements OnInit, AfterViewInit {

  clientes: Cliente[] = [];
  loading: boolean = false;
  error: string | null = null;

  modalCrearInstance: any;
  modalEditarInstance: any;

  @ViewChild('crearClienteModal') crearClienteModal!: ElementRef;
  @ViewChild('editarClienteModal') editarClienteModal!: ElementRef;

  nuevaCliente: ClienteCreate = {
    nombre: '',
    telefono: '',
    direccion: '',
    email: ''
  };

  clienteForm: Cliente & { id?: number } = {
    id: undefined,
    nombre: '',
    telefono: '',
    direccion: '',
    email: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  ngAfterViewInit(): void {
    this.modalCrearInstance = new bootstrap.Modal(this.crearClienteModal.nativeElement);
    this.modalEditarInstance = new bootstrap.Modal(this.editarClienteModal.nativeElement);
  }

  abrirModalCrear(): void {
    this.nuevaCliente = {
      nombre: '',
      telefono: '',
      direccion: '',
      email: ''
    };
    this.modalCrearInstance.show();
  }

  crearCliente(): void {
    this.http.post<Cliente>(apiUrl, this.nuevaCliente).subscribe({
      next: (res) => {
        this.clientes.push(res);
        this.modalCrearInstance.hide();
        Swal.fire('Éxito', 'Cliente creado correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al crear cliente:', err);
        Swal.fire('Error', 'No se pudo crear el cliente.', 'error');
      }
    });
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

  editarCliente(cliente: Cliente): void {
    this.clienteForm = {
      id: cliente.id,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      email: cliente.email
    };
    this.modalEditarInstance.show();
  }

  guardarCambios(): void {
    if (!this.clienteForm.id) {
      return;
    }

    const payload: ClienteUpdate = {
      nombre: this.clienteForm.nombre,
      telefono: this.clienteForm.telefono,
      direccion: this.clienteForm.direccion
    };

    this.http.put<Cliente>(`${apiUrl}/${this.clienteForm.id}`, payload).subscribe({
      next: () => {
        this.obtenerClientes();
        this.modalEditarInstance.hide();
        Swal.fire('Éxito', 'Cliente actualizado correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al actualizar cliente:', err);
        Swal.fire('Error', 'No se pudo actualizar el cliente.', 'error');
      }
    });
  }

  eliminarCliente(clienteId: number): void {
    if (!confirm('¿Seguro que deseas eliminar este cliente?')) {
      return;
    }

    this.http.delete<Cliente>(`${apiUrl}/${clienteId}`).subscribe({
      next: () => {
        Swal.fire('Eliminado', 'Cliente eliminado correctamente', 'success');
        this.obtenerClientes();
      },
      error: (err) => {
        console.error('Error al eliminar cliente:', err);
        Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error');
      }
    });
  }
}
