/** Estados de `devolucion.estado_ejemplar` (docs/modelo-datos.md), en el orden de RF9.3.8. */
export const ESTADOS_DEVOLUCION = ['Buen estado', 'Con observaciones', 'Dañado'] as const;

export type EstadoDevolucion = (typeof ESTADOS_DEVOLUCION)[number];
