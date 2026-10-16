/** Ejemplar que se reservará en P7.1 (GET /catalogo/libros/{id}/ejemplar-reservable, sección 7). */
export interface EjemplarReservableResponse {
  idLibro: number;
  libroTitulo: string;
  ejemplaresDisponibles: number;
  idEjemplar: number;
  codigoEjemplar: string;
  bibliotecaNombre: string;
}
