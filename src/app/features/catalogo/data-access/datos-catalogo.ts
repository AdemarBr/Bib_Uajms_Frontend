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
}
