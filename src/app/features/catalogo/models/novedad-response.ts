/** Novedad bibliográfica de P.1 Home (RF6.2.5): portada, título, autor, materia y fecha de incorporación. */
export interface NovedadResponse {
  idLibro: number;
  titulo: string;
  autor: string;
  materia: string;
  portadaUrl: string | null;
  fechaIncorporacion: string;
}
