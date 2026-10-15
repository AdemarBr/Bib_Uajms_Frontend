import { EstadoEjemplar } from './estado-ejemplar';

/** Ejemplar de la tabla de P5.2 y del formulario de P5.3 (docs/contrato-api.md, sección 8). */
export interface EjemplarResponse {
  idEjemplar: number;
  codigoEjemplar: string;
  ubicacionFisica: string | null;
  estado: EstadoEjemplar;
  /** (calculado) `estado == "disponible"`. */
  disponible: boolean;
  soloSala: boolean;
  idLibro: number;
  libroTitulo: string;
  idBiblioteca: number;
  bibliotecaNombre: string;
}
