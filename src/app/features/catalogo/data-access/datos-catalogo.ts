import { Service, signal } from '@angular/core';

import { EJEMPLARES_MOCK, EjemplarMock } from '../../ejemplares/data-access/ejemplares.mock';
import { HISTORIAL_LIBROS_MOCK, HistorialMock } from './historial-libros.mock';
import { LIBROS_MOCK, LibroMock } from './libros.mock';

/**
 * Tablas libro, ejemplar e historial_cambio_libro del prototipo, compartidas por los servicios del
 * catálogo (RF4), de ejemplares (RF5) y del catálogo público (RF6) para que cada respuesta combine las
 * tablas como lo haría el backend. Solo existe en la Iteración 4, igual que `DatosEstructura`.
 */
@Service()
export class DatosCatalogo {
  readonly libros = signal<LibroMock[]>(LIBROS_MOCK);
  readonly ejemplares = signal<EjemplarMock[]>(EJEMPLARES_MOCK);
  readonly historial = signal<HistorialMock[]>(HISTORIAL_LIBROS_MOCK);
  /**
   * Tabla registro_uso, para RF13: fecha de cada visualización del detalle de un libro (RF6.1.2.5) o de una tesis
   * (RF11.1.2.4) y de cada apertura de un documento de tesis (RF11.1.2.1.7). Cada registro se refiere a uno solo.
   */
  readonly registroUso = signal<RegistroUso[]>([]);
}

/** Fila de registro_uso: exactamente uno de idLibro, idTesis o idDocumento (docs/reglas-negocio.md). */
export type RegistroUso = { fecha: string } & (
  { idLibro: number } | { idTesis: number } | { idDocumento: number }
);

/** Fecha de hoy en ISO 8601 («2026-10-15»), en la hora local. */
export function hoy(): string {
  const d = new Date();
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}
