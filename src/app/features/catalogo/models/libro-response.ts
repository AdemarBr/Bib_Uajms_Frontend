/** Libro de la tabla de P4.3 y del formulario de P4.4 (docs/contrato-api.md, sección 6). */
export interface LibroResponse {
  idLibro: number;
  titulo: string;
  autor: string;
  editorial: string | null;
  materia: string;
  clasificacionDewey: string | null;
  isbn: string | null;
  /** (calculado) URL de la portada; `null` si el libro no tiene. */
  portadaUrl: string | null;
  fechaIncorporacion: string;
  estado: boolean;
}
