/** Parámetros de GET /devoluciones (P9.6, RF9.3.5.5) y de la paginación. */
export interface FiltroDevoluciones {
  /** Usuario, código de ejemplar o título del libro. */
  q?: string;
  desde?: string | null;
  hasta?: string | null;
  pagina?: number;
  tamanio?: number;
}
