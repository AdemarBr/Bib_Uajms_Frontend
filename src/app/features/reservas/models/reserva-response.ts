import { EstadoReserva } from './estado-reserva';

/** Reserva de P7.2 y P8.1 (docs/contrato-api.md, sección 9). */
export interface ReservaResponse {
  idReserva: number;
  fecha: string;
  estado: EstadoReserva;
  /** Si la reserva ya derivó en un préstamo (independiente del estado). */
  atendida: boolean;
  motivo: string | null;
  idUsuario: number;
  usuarioNombre: string;
  idEjemplar: number;
  ejemplarCodigo: string;
  idLibro: number;
  libroTitulo: string;
  idBiblioteca: number;
  bibliotecaNombre: string;
}
