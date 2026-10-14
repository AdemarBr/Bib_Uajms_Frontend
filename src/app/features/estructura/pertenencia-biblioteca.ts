import { OpcionSelect, ValorSelect } from '../../shared/components/select/select';
import { CarreraResponse } from './models/carrera-response';

/** Valor de la opción «Toda la facultad» del desplegable Carrera (RF3.6.4). */
export const TODA_LA_FACULTAD = 'toda';

/** Opciones del desplegable Carrera de P3.4 y P3.5: «Toda la facultad» y las carreras de la facultad. */
export function opcionesCarrera(carreras: readonly CarreraResponse[]): OpcionSelect[] {
  return [
    { valor: TODA_LA_FACULTAD, etiqueta: 'Toda la facultad' },
    ...carreras.map((c) => ({ valor: c.idCarrera, etiqueta: c.nombre })),
  ];
}

/**
 * Facultad y carrera elegidas → campos de `BibliotecaRequest`: de toda la facultad (idFacultad con valor)
 * o de una carrera (idCarrera con valor), nunca las dos (regla de la tabla biblioteca).
 */
export function aPertenencia(
  idFacultad: ValorSelect,
  carrera: ValorSelect,
): { idFacultad: number | null; idCarrera: number | null } {
  if (idFacultad === null || carrera === null) return { idFacultad: null, idCarrera: null };
  return carrera === TODA_LA_FACULTAD
    ? { idFacultad: idFacultad as number, idCarrera: null }
    : { idFacultad: null, idCarrera: carrera as number };
}
