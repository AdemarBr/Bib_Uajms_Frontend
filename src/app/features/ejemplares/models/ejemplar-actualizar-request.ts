import { EstadoEjemplar } from './estado-ejemplar';

/** Datos de PUT /ejemplares/{id} (P5.3): el libro no se cambia (RF5.4.3). */
export interface EjemplarActualizarRequest {
  codigoEjemplar: string;
  idBiblioteca: number;
  ubicacionFisica: string | null;
  estado: EstadoEjemplar;
}
