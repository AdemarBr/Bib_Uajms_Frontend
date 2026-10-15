import { HistorialCambioLibroResponse } from '../models/historial-cambio-libro-response';

/** Fila de la tabla `historial_cambio_libro`. */
export interface HistorialMock extends HistorialCambioLibroResponse {
  idLibro: number;
}

/** Cambios de «Introducción a la Programación» de Figma (P4.5 22:938). */
export const HISTORIAL_LIBROS_MOCK: HistorialMock[] = [
  {
    idHistorial: 1,
    idLibro: 1,
    fecha: '2026-03-20',
    campoModificado: 'titulo',
    valorAnterior: 'Introducción Programación',
    valorNuevo: 'Introducción a la Programación',
  },
  {
    idHistorial: 2,
    idLibro: 1,
    fecha: '2026-05-03',
    campoModificado: 'clasificacionDewey',
    valorAnterior: '005',
    valorNuevo: '005.1',
  },
  {
    idHistorial: 3,
    idLibro: 1,
    fecha: '2026-06-12',
    campoModificado: 'editorial',
    valorAnterior: 'Editorial Popular',
    valorNuevo: 'Editorial Universitaria',
  },
];
