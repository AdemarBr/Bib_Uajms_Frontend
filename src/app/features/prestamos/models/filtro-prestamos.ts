import { EstadoPrestamo, TipoPrestamo } from './prestamo-response';

/** Parámetros de GET /prestamos (P9.2, P9.4 y P9.5) y de la paginación. */
export interface FiltroPrestamos {
  tipoPrestamo?: TipoPrestamo | null;
  estado?: EstadoPrestamo | null;
  /** Código de ejemplar, usuario o número de préstamo (RF9.3.6). */
  q?: string;
  pagina?: number;
  tamanio?: number;
}
