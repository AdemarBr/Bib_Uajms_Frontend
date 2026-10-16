import { DIAS_AMPLIACION_PRESTAMO, PLAZO_MAXIMO_PRESTAMO_DIAS } from '../../core/config/constantes';
import { hoy } from '../catalogo/data-access/datos-catalogo';

/**
 * Fechas de los préstamos (docs/contrato-api.md, sección 10), en ISO 8601 («2026-08-02»). Las usan el servicio
 * simulado, que las valida como el backend, y las pantallas, que las proponen (P9.3 y la ventana de P9.4).
 */

/** Suma días a una fecha ISO sin pasar por la zona horaria. */
export function sumarDias(fecha: string, dias: number): string {
  const [a, m, d] = fecha.split('-').map(Number);
  const resultado = new Date(Date.UTC(a, m - 1, d + dias));
  return resultado.toISOString().slice(0, 10);
}

/** Días de `desde` a `hasta` (positivo si `hasta` es posterior). */
export function diasEntre(desde: string, hasta: string): number {
  const utc = (f: string) => {
    const [a, m, d] = f.split('-').map(Number);
    return Date.UTC(a, m - 1, d);
  };
  return Math.round((utc(hasta) - utc(desde)) / 86_400_000);
}

/** Rango de la fecha límite de un préstamo a domicilio: de mañana a hoy + 30 días (RF9.2.5). */
export function rangoFechaLimite(): { minima: string; maxima: string } {
  return { minima: sumarDias(hoy(), 1), maxima: sumarDias(hoy(), PLAZO_MAXIMO_PRESTAMO_DIAS) };
}

/** Fecha límite propuesta al registrar: hoy + 30 días (RF9.2.5, paso 2). */
export function fechaLimitePropuesta(): string {
  return rangoFechaLimite().maxima;
}

/** Nueva fecha límite de una ampliación: max(fecha límite vigente, hoy) + 7 días (RF9.2.8). */
export function fechaAmpliada(fechaLimite: string): string {
  const base = fechaLimite > hoy() ? fechaLimite : hoy();
  return sumarDias(base, DIAS_AMPLIACION_PRESTAMO);
}

/** «2026-08-02» → «02/08/2026», para los mensajes de rango de fechas. */
export function dma(fecha: string): string {
  const [a, m, d] = fecha.split('-');
  return `${d}/${m}/${a}`;
}
