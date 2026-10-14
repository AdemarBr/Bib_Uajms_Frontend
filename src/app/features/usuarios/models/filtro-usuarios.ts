import { TipoUsuario } from '../../../shared/models/login-response';

/** Parámetros de GET /usuarios (búsqueda RF2.2.1 y filtros RF2.2.1.1) y de la paginación. */
export interface FiltroUsuarios {
  q?: string;
  idRol?: number | null;
  estado?: boolean | null;
  tipoUsuario?: TipoUsuario | null;
  idBiblioteca?: number | null;
  pagina?: number;
  tamanio?: number;
}
