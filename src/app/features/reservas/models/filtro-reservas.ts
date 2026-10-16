import { EstadoReserva } from './estado-reserva';

/** Parámetros de GET /reservas (RF8.1.5 y RF8.2) y GET /reservas/historial (periodo, RF8.7). */
export interface FiltroReservas {
  /** Usuario, libro o biblioteca. */
  q?: string;
  idBiblioteca?: number | null;
  estado?: EstadoReserva | null;
  /** Fechas ISO, inclusivas. */
  desde?: string | null;
  hasta?: string | null;
  pagina?: number;
  tamanio?: number;
}
