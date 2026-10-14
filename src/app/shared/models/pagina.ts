/** Listado paginado (docs/contrato-api.md, sección 2). `pagina` empieza en 0. */
export interface Pagina<T> {
  contenido: T[];
  pagina: number;
  tamanio: number;
  totalElementos: number;
}
