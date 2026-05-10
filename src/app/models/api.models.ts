/** Contratos alineados con el backend FastAPI de Veterinaria */

// ==================== AUTENTICACIÓN ====================
export interface LoginRequest {
  email: string;
}

export interface UsuarioResponse {
  id: number;
  email: string;
  rol: string;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioResponse;
}

// ==================== USUARIO ====================
export interface UsuarioRead {
  id: number;
  email: string;
  rol: string;
}

export interface UsuarioCreate {
  email: string;
  nombre_completo: string;
  nombre_usuario: string;
  telefono: string | null;
  rol: string;
  clave: string;
  activo: boolean;
}

export interface UsuarioUpdate {
  email?: string;
  nombre_completo?: string;
  nombre_usuario?: string;
  telefono?: string | null;
  rol?: string;
  clave?: string;
  activo?: boolean;
}

// ==================== CLIENTE ====================
export interface ClienteRead {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface ClienteCreate {
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface ClienteUpdate {
  nombre?: string;
  telefono?: string;
  direccion?: string;
}

// ==================== MASCOTA ====================
export interface MascotaRead {
  id: number;
  nombre: string;
  edad?: string;
  genero_id?: string;
  raza_id?: string;
  usuario_id?: number;
}

export interface MascotaCreate {
  nombre: string;
  edad?: string;
  genero_id?: string | number;
  raza_id?: string | number;
  usuario_id?: string | number;
}

export interface MascotaUpdate {
  nombre?: string;
  edad?: string;
  genero_id?: string | number;
  raza_id?: string | number;
  usuario_id?: string | number;
}

// ==================== VETERINARIO ====================
export interface VeterinarioRead {
  id: number;
  nombre: string;
  especialidad: string;
  sede_id: number;
  email: string;
}

export interface VeterinarioCreate {
  nombre: string;
  especialidad: string;
  sede_id: number;
  email: string;
}

export interface VeterinarioUpdate {
  nombre?: string;
  especialidad?: string;
  sede_id?: number;
  email?: string;
}

// ==================== VACUNA ====================
export interface VacunaRead {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface VacunaCreate {
  nombre: string;
  descripcion?: string | null;
}

export interface VacunaUpdate {
  nombre?: string;
  descripcion?: string | null;
}

// ==================== CITA DE VACUNACIÓN ====================
export interface CitaVacunacionRead {
  id?: number;
  fecha?: string;
  estado?: string;
  mascota_id?: number;
  vacuna_id?: number;
  veterinario_id?: number;
}

export interface CitaVacunacionCreate {
  fecha: string;
  mascota_id: number;
  veterinario_id: number;
  vacuna_id: number;
  estado?: string;
}

export interface CitaVacunacionUpdate {
  fecha?: string;
  mascota_id?: number;
  veterinario_id?: number;
  vacuna_id?: number;
  estado?: string;
}

// ==================== SEDE ====================
export interface SedeRead {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface SedeCreate {
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface SedeUpdate {
  nombre?: string;
  telefono?: string;
  direccion?: string;
}
