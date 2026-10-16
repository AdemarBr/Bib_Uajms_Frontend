import { EstadoEjemplar } from '../../ejemplares/models/estado-ejemplar';
import { EstadoDevolucion } from './estado-devolucion';

/** Devolución de P9.6 y respuesta de P9.5 (docs/contrato-api.md, sección 10). */
export interface DevolucionResponse {
  idDevolucion: number;
  fechaDevolucion: string;
  estadoEjemplar: EstadoDevolucion;
  observaciones: string | null;
  idPrestamo: number;
  usuarioNombre: string;
  ejemplarCodigo: string;
  libroTitulo: string;
  /** Estado del ejemplar tras la devolución (RF9.3.4.4). */
  ejemplarEstado: EstadoEjemplar;
  fechaPrestamo: string;
  /** (calculado) Devuelto después de la fecha límite (RF9.3.3). */
  conRetraso: boolean;
}
