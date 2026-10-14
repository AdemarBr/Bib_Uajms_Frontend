import { TipoUsuario } from '../../../shared/models/login-response';

/** Rol con sus permisos (GET /roles, P2.5). */
export interface RolResponse {
  idRol: number;
  nombre: string;
  tipoUsuario: TipoUsuario;
  permisos: PermisoResponse[];
}

export interface PermisoResponse {
  codigo: string;
  nombre: string;
}
