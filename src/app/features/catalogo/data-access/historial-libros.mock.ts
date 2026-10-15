import { HistorialCambioLibroResponse } from '../models/historial-cambio-libro-response';

/** Fila de la tabla `historial_cambio_libro`. */
export interface HistorialMock extends HistorialCambioLibroResponse {
  idLibro: number;
}

/**
 * Cambios de «Introducción a la Programación» de Figma (P4.5 22:938). Las fechas de Figma (marzo a junio)
 * eran anteriores a su incorporación del 15/07/2026 (Home), así que se pasaron a julio y agosto.
 */
export const HISTORIAL_LIBROS_MOCK: HistorialMock[] = [
  {
    idHistorial: 1,
    idLibro: 1,
    fecha: '2026-07-20',
    campoModificado: 'titulo',
    valorAnterior: 'Introducción Programación',
    valorNuevo: 'Introducción a la Programación',
  },
  {
    idHistorial: 2,
    idLibro: 1,
    fecha: '2026-08-03',
    campoModificado: 'clasificacionDewey',
    valorAnterior: '005',
    valorNuevo: '005.1',
  },
  {
    idHistorial: 3,
    idLibro: 1,
    fecha: '2026-08-12',
    campoModificado: 'editorial',
    valorAnterior: 'Editorial Popular',
    valorNuevo: 'Editorial Universitaria',
  },
];
