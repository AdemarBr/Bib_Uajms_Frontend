/** Biblioteca con ejemplares de un libro, dentro de `LibroDetalleResponse`. */
export interface UbicacionLibro {
  idBiblioteca: number;
  bibliotecaNombre: string;
  disponibles: number;
  total: number;
}
