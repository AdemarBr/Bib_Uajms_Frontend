/** Parámetros de GET /libros (búsqueda RF4.3.1 y filtros RF4.3.1.1) y de la paginación. */
export interface FiltroLibros {
  /** Título, autor o ISBN. */
  q?: string;
  idBiblioteca?: number | null;
  idFacultad?: number | null;
  materia?: string | null;
  autor?: string | null;
  estado?: boolean | null;
  clasificacionDewey?: string | null;
  pagina?: number;
  tamanio?: number;
}
