import { TipoUsuario } from '../../../shared/models/login-response';

/** GET /auth/perfil (docs/contrato-api.md, sección 3; P1.2, RF1.4). */
export interface PerfilResponse {
  idUsuario: number;
  nombre: string;
  nombreUsuario: string;
  correo: string | null;
  ru: string | null;
  rolNombre: string;
  tipoUsuario: TipoUsuario;
  bibliotecaNombre: string | null;
  facultadNombre: string | null;
  carreraNombre: string | null;
}
