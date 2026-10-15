/** Datos de POST /ejemplares (P5.1). */
export interface EjemplarRequest {
  codigoEjemplar: string;
  ubicacionFisica: string | null;
  idLibro: number;
  idBiblioteca: number;
}
