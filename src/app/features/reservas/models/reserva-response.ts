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
  /** RU y carrera del usuario: precargan P9.1 y P9.3 sin pedir el RU (RF9.1.6 y RF9.2.10). */
  usuarioRu: string | null;
  usuarioCarreraNombre: string | null;
  idEjemplar: number;
  ejemplarCodigo: string;
  idLibro: number;
  libroTitulo: string;
  idBiblioteca: number;
  bibliotecaNombre: string;
}
