import { ID_BIBLIOTECA_CENTRAL } from '../../estructura/data-access/bibliotecas.mock';
import { EjemplarResponse } from '../models/ejemplar-response';
import { EstadoEjemplar } from '../models/estado-ejemplar';

/** Fila de la tabla `ejemplar`: sin `disponible` ni los nombres, que se calculan al responder. */
export type EjemplarMock = Omit<
  EjemplarResponse,
  'disponible' | 'libroTitulo' | 'bibliotecaNombre'
>;

const CENTRAL = ID_BIBLIOTECA_CENTRAL;
const FCYT = 2;
const DERECHO = 3;
const ECONOMIA = 4;
const SALUD = 5;
const POSTGRADO = 6;

type Fila = [string, number, number, string | null, EstadoEjemplar];

/**
 * [código, idLibro, idBiblioteca, ubicación, estado]. Las tres primeras son las filas de Figma (P5.2 22:1082);
 * algunas no tienen ubicación, para el filtro y la celda «Sin ubicación asignada» (RF5.7).
 */
const FILAS: Fila[] = [
  ['EJ-00123', 1, CENTRAL, 'Estante 4B, Dewey 005.1', 'disponible'],
  ['EJ-00124', 1, CENTRAL, 'Estante 4B, Dewey 005.1', 'prestado'],
  ['EJ-00301', 2, FCYT, 'Estante 2A, Dewey 515', 'reservado'],
  ['EJ-00125', 1, FCYT, 'Estante 1C, Dewey 005.1', 'disponible'],
  ['EJ-00302', 2, FCYT, 'Estante 2A, Dewey 515', 'disponible'],
  ['EJ-00410', 3, DERECHO, 'Estante 3B, Dewey 346', 'desactivado'],
  ['EJ-00126', 4, FCYT, 'Estante 1C, Dewey 005.73', 'disponible'],
  ['EJ-00127', 5, FCYT, 'Estante 1C, Dewey 005.75', 'disponible'],
  ['EJ-00128', 5, CENTRAL, 'Estante 4B, Dewey 005.75', 'disponible'],
  ['EJ-00129', 6, FCYT, null, 'en mantenimiento'],
  ['EJ-00303', 7, FCYT, 'Estante 2A, Dewey 512.5', 'disponible'],
  ['EJ-00304', 8, FCYT, 'Estante 2A, Dewey 515', 'disponible'],
  ['EJ-00305', 9, ECONOMIA, 'Estante 1A, Dewey 519.5', 'disponible'],
  ['EJ-00306', 9, POSTGRADO, null, 'disponible'],
  ['EJ-00307', 10, FCYT, 'Estante 2B, Dewey 530', 'disponible'],
  ['EJ-00308', 11, FCYT, 'Estante 2B, Dewey 540', 'prestado'],
  ['EJ-00309', 12, FCYT, 'Estante 3A, Dewey 624.15', 'disponible'],
  ['EJ-00310', 13, FCYT, null, 'disponible'],
  ['EJ-00411', 14, DERECHO, 'Estante 3A, Dewey 342', 'disponible'],
  ['EJ-00412', 14, CENTRAL, 'Estante 5A, Dewey 342', 'disponible'],
  ['EJ-00413', 15, DERECHO, 'Estante 3A, Dewey 345', 'disponible'],
  ['EJ-00414', 16, DERECHO, 'Estante 3A, Dewey 340', 'no disponible'],
  ['EJ-00501', 17, ECONOMIA, 'Estante 1B, Dewey 338.5', 'disponible'],
  ['EJ-00502', 18, ECONOMIA, 'Estante 1B, Dewey 339', 'reservado'],
  ['EJ-00503', 19, ECONOMIA, 'Estante 2A, Dewey 657', 'disponible'],
  ['EJ-00504', 20, ECONOMIA, null, 'no disponible'],
  ['EJ-00601', 21, SALUD, 'Estante 1A, Dewey 611', 'disponible'],
  ['EJ-00602', 22, SALUD, 'Estante 1A, Dewey 610.73', 'desactivado'],
  ['EJ-00130', 23, FCYT, 'Estante 1D, Dewey 004.6', 'disponible'],
  ['EJ-00701', 24, POSTGRADO, 'Estante 1A, Dewey 001.42', 'disponible'],
  ['EJ-00702', 24, CENTRAL, 'Estante 6A, Dewey 001.42', 'disponible'],
];

export const EJEMPLARES_MOCK: EjemplarMock[] = FILAS.map(
  ([codigoEjemplar, idLibro, idBiblioteca, ubicacionFisica, estado], i) => ({
    idEjemplar: i + 7,
    codigoEjemplar,
    ubicacionFisica,
    estado,
    soloSala: true,
    idLibro,
    idBiblioteca,
  }),
);
