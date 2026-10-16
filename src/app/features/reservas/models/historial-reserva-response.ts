import { EstadoReserva } from './estado-reserva';

/** Cambio de estado de una reserva de P8.2 (docs/contrato-api.md, sección 9; RF8.7.4). */
export interface HistorialReservaResponse {
  idHistorialReserva: number;
  fecha: string;
  estadoAnterior: EstadoReserva | null;
  estadoNuevo: EstadoReserva;
  idReserva: number;
  usuarioNombre: string;
  libroTitulo: string;
  bibliotecaNombre: string;
}
