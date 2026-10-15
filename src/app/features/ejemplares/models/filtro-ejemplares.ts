import { EstadoEjemplar } from './estado-ejemplar';

/** Parámetros de GET /ejemplares (búsqueda RF5.3.1 y filtros RF5.3.1.1) y de la paginación. */
export interface FiltroEjemplares {
  /** Código de ejemplar o título del libro. */
  q?: string;
  idBiblioteca?: number | null;
  idFacultad?: number | null;
  estado?: EstadoEjemplar | null;
  disponible?: boolean | null;
  ubicacion?: string | null;
  /** Solo los ejemplares sin ubicación física (opción «Sin ubicación asignada»). */
  sinUbicacion?: boolean | null;
  pagina?: number;
  tamanio?: number;
}
