/** Parámetros de GET /tesis (búsqueda RF10.3.1 y filtros RF10.3.1.1) y de la paginación. */
export interface FiltroTesis {
  /** Título, autor o número de inventario. */
  q?: string;
  idCarrera?: number | null;
  gestion?: number | null;
  pagina?: number;
  tamanio?: number;
}
