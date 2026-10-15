/** Estados de `ejemplar.estado` (docs/modelo-datos.md), en el orden de RF5.5.3. */
export const ESTADOS_EJEMPLAR = [
  'disponible',
  'reservado',
  'prestado',
  'no disponible',
  'en mantenimiento',
  'desactivado',
] as const;

export type EstadoEjemplar = (typeof ESTADOS_EJEMPLAR)[number];
