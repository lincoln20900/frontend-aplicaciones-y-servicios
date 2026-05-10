import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UsuariosComponent } from '../../usuarios/usuarios.component';
import { AnimalesComponent } from '../../animales/animales.component';
import { CitasComponent } from '../../citas/citas.component';
import { FacturaComponent } from '../../factura/factura.component';
import { ClientesComponent } from '../../clientes/clientes.component';
import { SedeComponent } from '../../sede/sede.component';
import { VacunaComponent } from '../../vacuna/vacuna.component';
import { VeterinarioComponent } from '../../veterinario/veterinario.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'clientes',       component: ClientesComponent },
    { path: 'animales',       component: AnimalesComponent },
    { path: 'sede',           component: SedeComponent },
    { path: 'usuarios',       component: UsuariosComponent },
    { path: 'vacuna',         component: VacunaComponent },
    { path: 'veterinario',    component: VeterinarioComponent },
    { path: 'citas',          component: CitasComponent },
    { path: 'factura',        component: FacturaComponent }
];
