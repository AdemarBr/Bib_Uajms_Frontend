/** Fila de la tabla `facultad` (docs/modelo-datos.md). */
export interface FacultadMock {
  idFacultad: number;
  nombre: string;
  estado: boolean;
}

/** Las tres facultades de P3.1 en Figma y la de Derecho, a la que pertenece «Biblioteca Facultad de Derecho». */
export const FACULTADES_MOCK: FacultadMock[] = [
  { idFacultad: 1, nombre: 'Facultad de Ciencias y Tecnología', estado: true },
  { idFacultad: 2, nombre: 'Facultad de Ciencias Económicas', estado: true },
  { idFacultad: 3, nombre: 'Facultad de Ciencias de la Salud', estado: false },
  { idFacultad: 4, nombre: 'Facultad de Derecho', estado: true },
];
