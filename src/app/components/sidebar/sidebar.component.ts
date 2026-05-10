import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    count?: number;
    loading?: boolean;
    showCount?: boolean;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '', loading: false, showCount: true },
    { path: '/clientes', title: 'Clientes',  icon:'business_badge', class: '', loading: false, showCount: true },
    { path: '/animales', title: 'Mascotas',  icon:'education_atom', class: '', loading: false, showCount: true },
    { path: '/sede', title: 'Sede',  icon:'ui-2_settings-90', class: '', loading: false, showCount: true },
    { path: '/usuarios', title: 'Usuarios',  icon:'users_single-02', class: '', loading: false, showCount: true },
    { path: '/vacuna', title: 'Vacuna',  icon:'health_ambulance', class: '', loading: false, showCount: true },
    { path: '/veterinario', title: 'Veterinario',  icon:'health_40', class: '', loading: false, showCount: true },
    { path: '/citas', title: 'Citas Vacunación',  icon:'ui-1_calendar-60', class: '', loading: false, showCount: true }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.cargarDatosDelBackend();
  }

  cargarDatosDelBackend() {
    // Cargar datos de clientes
    this.cargarDatos('clientes', '/clientes');
    
    // Cargar datos de mascotas
    this.cargarDatos('animales', '/mascotas');
    
    // Cargar datos de usuarios
    this.cargarDatos('usuarios', '/usuarios');
    
    // Cargar datos de vacunas
    this.cargarDatos('vacuna', '/vacunas');
    
    // Cargar datos de veterinarios
    this.cargarDatos('veterinario', '/veterinarios');
    
    // Cargar datos de sedes
    this.cargarDatos('sede', '/sedes');
    
    // Cargar datos de citas
    this.cargarDatos('citas', '/citas');
  }

  cargarDatos(ruta: string, endpoint: string) {
    const item = this.menuItems.find(m => m.path === '/' + ruta);
    if (item) {
      if (item.showCount === false) {
        return;
      }
      item.loading = true;
      this.http.get<any[]>(`${this.apiUrl}${endpoint}`).subscribe({
        next: (response) => {
          console.log(`✅ ${ruta}:`, response);
          item.count = response?.length || 0;
          item.loading = false;
        },
        error: (err) => {
          console.error(`❌ Error cargando ${ruta} de ${this.apiUrl}${endpoint}:`, err);
          item.loading = false;
          item.count = 0;
        }
      });
    }
  }

  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}
