import { TipoUsuario } from '../../../shared/models/login-response';

/** Usuario de la tabla de P2.2 y del formulario de P2.3 (docs/contrato-api.md, sección 4; RF2.2.4). */
export interface UsuarioResponse {
  idUsuario: number;
  nombre: string;
  nombreUsuario: string;
  correo: string | null;
  ru: string | null;
  estado: boolean;
  idRol: number;
  rolNombre: string;
  tipoUsuario: TipoUsuario;
  idBiblioteca: number | null;
  bibliotecaNombre: string | null;
  idCarrera: number | null;
  carreraNombre: string | null;
}
