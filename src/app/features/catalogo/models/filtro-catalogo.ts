/** Disponibilidad del filtro de P6.1 (docs/contrato-api.md, sección 7). */
export type Disponibilidad = 'disponible' | 'no_disponible';

/** Parámetros de GET /catalogo/libros (búsqueda RF6.1 y filtros RF6.1.1) y de la paginación. */
export interface FiltroCatalogo {
  /** Título, autor, materia o clasificación Dewey. */
  q?: string;
  idBiblioteca?: number | null;
  idFacultad?: number | null;
  materia?: string | null;
  autor?: string | null;
  disponibilidad?: Disponibilidad | null;
  clasificacionDewey?: string | null;
  pagina?: number;
  tamanio?: number;
}
