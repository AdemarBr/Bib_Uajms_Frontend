import { EstadoDevolucion } from './estado-devolucion';

/** POST /devoluciones (P9.5): observaciones obligatorias si el estado no es «Buen estado». */
export interface DevolucionRequest {
  idPrestamo: number;
  estadoEjemplar: EstadoDevolucion;
  observaciones: string | null;
}
