import { ID_BIBLIOTECA_CENTRAL } from '../../estructura/data-access/bibliotecas.mock';

/** Estados de `ejemplar.estado` (docs/modelo-datos.md). */
export type EstadoEjemplar =
  'disponible' | 'reservado' | 'prestado' | 'no disponible' | 'en mantenimiento' | 'desactivado';

/** Fila de la tabla `ejemplar`. En RF4 solo se usa para los filtros de biblioteca y facultad de P4.3. */
export interface EjemplarMock {
  idEjemplar: number;
  codigoEjemplar: string;
  ubicacionFisica: string | null;
  estado: EstadoEjemplar;
  soloSala: boolean;
  idLibro: number;
  idBiblioteca: number;
}

const FCYT = 2;
const DERECHO = 3;
const ECONOMIA = 4;
const SALUD = 5;
const POSTGRADO = 6;

/** [idLibro, idBiblioteca, estado] de cada ejemplar; el primero es el del contrato (EJ-00123, sección 8). */
const FILAS: [number, number, EstadoEjemplar][] = [
  [1, ID_BIBLIOTECA_CENTRAL, 'disponible'],
  [1, ID_BIBLIOTECA_CENTRAL, 'prestado'],
  [1, FCYT, 'disponible'],
  [2, FCYT, 'disponible'],
  [2, ID_BIBLIOTECA_CENTRAL, 'reservado'],
  [3, DERECHO, 'desactivado'],
  [4, FCYT, 'disponible'],
  [5, FCYT, 'disponible'],
  [5, ID_BIBLIOTECA_CENTRAL, 'disponible'],
  [6, FCYT, 'en mantenimiento'],
  [7, FCYT, 'disponible'],
  [8, FCYT, 'disponible'],
  [9, ECONOMIA, 'disponible'],
  [9, POSTGRADO, 'disponible'],
  [10, FCYT, 'disponible'],
  [11, FCYT, 'prestado'],
  [12, FCYT, 'disponible'],
  [13, FCYT, 'disponible'],
  [14, DERECHO, 'disponible'],
  [14, ID_BIBLIOTECA_CENTRAL, 'disponible'],
  [15, DERECHO, 'disponible'],
  [16, DERECHO, 'disponible'],
  [17, ECONOMIA, 'disponible'],
  [18, ECONOMIA, 'disponible'],
  [19, ECONOMIA, 'disponible'],
  [20, ECONOMIA, 'no disponible'],
  [21, SALUD, 'disponible'],
  [22, SALUD, 'desactivado'],
  [23, FCYT, 'disponible'],
  [24, POSTGRADO, 'disponible'],
  [24, ID_BIBLIOTECA_CENTRAL, 'disponible'],
];

export const EJEMPLARES_MOCK: EjemplarMock[] = FILAS.map(([idLibro, idBiblioteca, estado], i) => ({
  idEjemplar: i + 7,
  codigoEjemplar: `EJ-${String(123 + i).padStart(5, '0')}`,
  ubicacionFisica: i === 0 ? 'Estante 4B, Dewey 005.1' : null,
  estado,
  soloSala: true,
  idLibro,
  idBiblioteca,
}));
