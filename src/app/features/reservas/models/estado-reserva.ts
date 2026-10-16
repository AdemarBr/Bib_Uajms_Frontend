/** Estados de `reserva.estado` (docs/reglas-negocio.md). */
export type EstadoReserva = 'Pendiente' | 'Confirmada' | 'Rechazada' | 'Cancelada';

export const ESTADOS_RESERVA: readonly EstadoReserva[] = [
  'Pendiente',
  'Confirmada',
  'Rechazada',
  'Cancelada',
];

type ReservaConEstado = { estado: EstadoReserva; atendida: boolean };

/**
 * Reserva activa: Pendiente, o Confirmada que aún no derivó en un préstamo (docs/contrato-api.md,
 * sección 9). Solo puede haber una por usuario y libro.
 */
export function esActiva(reserva: ReservaConEstado): boolean {
  return reserva.estado === 'Pendiente' || esConfirmadaVigente(reserva);
}

/** Confirmada sin atender: se puede prestar (RF8.8) o cancelar administrativamente (RF8.5). */
export function esConfirmadaVigente(reserva: ReservaConEstado): boolean {
  return reserva.estado === 'Confirmada' && !reserva.atendida;
}

/**
 * RF7.4: se puede cancelar una reserva Pendiente o Confirmada que aún no derivó en un préstamo. Es la regla
 * del backend (docs/contrato-api.md, sección 9); la interfaz la usa para mostrar «Cancelar» o «—».
 */
export function puedeCancelarse(reserva: ReservaConEstado): boolean {
  return esActiva(reserva);
}
