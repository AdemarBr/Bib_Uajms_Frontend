import { EstadoEjemplar } from '../../ejemplares/models/estado-ejemplar';

/**
 * Ejemplar de «Ejemplares disponibles del libro seleccionado» de P9.1 y P9.3
 * (GET /prestamos/ejemplares-disponibles, docs/contrato-api.md, sección 10).
 */
export interface EjemplarPrestableResponse {
  idEjemplar: number;
  codigoEjemplar: string;
  libroTitulo: string;
  autor: string;
  ubicacionFisica: string | null;
  estado: EstadoEjemplar;
  /** Uso exclusivo en sala: no puede prestarse a domicilio (RF9.2.3). */
  soloSala: boolean;
}
