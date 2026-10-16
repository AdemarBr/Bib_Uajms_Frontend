import { hoy } from '../../catalogo/data-access/datos-catalogo';
import { AmpliacionResponse } from '../models/ampliacion-response';
import { DevolucionRequest } from '../models/devolucion-request';
import { PrestamoResponse } from '../models/prestamo-response';

/** Fila de la tabla `prestamo`: los nombres, el estado del ejemplar y los calculados se arman al responder. */
export type PrestamoMock = Pick<
  PrestamoResponse,
  | 'idPrestamo'
  | 'fechaPrestamo'
  | 'estado'
  | 'tipoPrestamo'
  | 'fechaLimiteDevolucion'
  | 'celularContacto'
  | 'idUsuario'
  | 'idEjemplar'
  | 'idReserva'
>;

/** Fila de la tabla `ampliacion_prestamo`. */
export type AmpliacionMock = AmpliacionResponse;

/** Fila de la tabla `devolucion`. */
export interface DevolucionMock extends DevolucionRequest {
  idDevolucion: number;
  fechaDevolucion: string;
}

function sala(
  idPrestamo: number,
  hora: string,
  idUsuario: number,
  idEjemplar: number,
): PrestamoMock {
  return {
    idPrestamo,
    fechaPrestamo: `${hoy()}T${hora}:00`,
    estado: 'activo',
    tipoPrestamo: 'sala',
    fechaLimiteDevolucion: null,
    celularContacto: null,
    idUsuario,
    idEjemplar,
    idReserva: null,
  };
}

function domicilio(
  idPrestamo: number,
  fechaPrestamo: string,
  fechaLimiteDevolucion: string,
  celularContacto: string,
  idUsuario: number,
  idEjemplar: number,
  estado: PrestamoMock['estado'] = 'activo',
  idReserva: number | null = null,
): PrestamoMock {
  return {
    idPrestamo,
    fechaPrestamo,
    estado,
    tipoPrestamo: 'domicilio',
    fechaLimiteDevolucion,
    celularContacto,
    idUsuario,
    idEjemplar,
    idReserva,
  };
}

/**
 * Préstamos del prototipo, con los usuarios, libros y fechas de Figma (P9.2 22:1974, P9.4 22:2118 y P9.6 24:3),
 * sin repetir un ejemplar en dos préstamos activos (docs/usuarios-falsos.md, «Préstamos»):
 * - en sala, con la fecha de hoy y la hora de Figma: Docente Gómez (EJ-00312, Cálculo I) y Estudiante Rojas
 *   (EJ-00512). La fila de Estudiante Pérez con EJ-00123 aparece al registrarla en P9.1, como en Figma;
 * - a domicilio: Gómez (EJ-00313, Cálculo I, vencido, 1 ampliación), Pérez (EJ-00130, vencido), Rojas (EJ-00210,
 *   vigente hasta el 20/11/2026), y los de EJ-00124 (Pérez, reserva 9 atendida) y EJ-00308 (Vargas), que ya
 *   figuraban como prestados en RF5 y RF6;
 * - devueltos (P9.6): Gómez EJ-00301, Pérez EJ-00147 y Rojas EJ-00512.
 * Usuarios: 12 Pérez, 13 Gómez, 14 Vargas, 17 Rojas. Ejemplares: ids de `ejemplares.mock.ts`.
 */
export const PRESTAMOS_MOCK: PrestamoMock[] = [
  sala(1, '10:02', 13, 43),
  sala(2, '11:40', 17, 40),
  domicilio(3, '2026-07-26T10:02:00', '2026-08-02', '71234567', 13, 44),
  domicilio(4, '2026-07-20T09:00:00', '2026-07-27', '70000000', 12, 35),
  domicilio(5, '2026-07-10T11:00:00', '2026-11-20', '72345678', 17, 41),
  domicilio(6, '2026-08-20T09:30:00', '2026-09-19', '70000000', 12, 8, 'activo', 9),
  domicilio(7, '2026-10-05T15:20:00', '2026-11-04', '76543210', 14, 22),
  domicilio(8, '2026-07-18T10:00:00', '2026-07-25', '71234567', 13, 9, 'inactivo'),
  domicilio(9, '2026-07-12T09:00:00', '2026-07-19', '70000000', 12, 42, 'inactivo'),
  domicilio(10, '2026-07-19T11:00:00', '2026-07-26', '72345678', 17, 40, 'inactivo'),
];

/** La ampliación de Gómez (Figma P9.4: «1 ampliación», fecha límite 02/08/2026). */
export const AMPLIACIONES_MOCK: AmpliacionMock[] = [
  { idAmpliacion: 1, fechaAnterior: '2026-07-27', fechaNueva: '2026-08-02', idPrestamo: 3 },
];

/** Las tres filas de Figma P9.6 (24:3). */
export const DEVOLUCIONES_MOCK: DevolucionMock[] = [
  {
    idDevolucion: 1,
    fechaDevolucion: '2026-07-19',
    estadoEjemplar: 'Con observaciones',
    observaciones: 'Página 45 con humedad',
    idPrestamo: 9,
  },
  {
    idDevolucion: 2,
    fechaDevolucion: '2026-07-24',
    estadoEjemplar: 'Buen estado',
    observaciones: null,
    idPrestamo: 8,
  },
  {
    idDevolucion: 3,
    fechaDevolucion: '2026-07-26',
    estadoEjemplar: 'Buen estado',
    observaciones: null,
    idPrestamo: 10,
  },
];
