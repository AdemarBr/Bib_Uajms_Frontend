/** Estados de `reserva.estado` (docs/reglas-negocio.md). */
export type EstadoReserva = 'Pendiente' | 'Confirmada' | 'Rechazada' | 'Cancelada';

/**
 * RF7.4: se puede cancelar una reserva Pendiente o Confirmada que aún no derivó en un préstamo. Es la regla
 * del backend (docs/contrato-api.md, sección 9); la interfaz la usa para mostrar «Cancelar» o «—».
 */
export function puedeCancelarse(reserva: { estado: EstadoReserva; atendida: boolean }): boolean {
  return reserva.estado === 'Pendiente' || (reserva.estado === 'Confirmada' && !reserva.atendida);
}
