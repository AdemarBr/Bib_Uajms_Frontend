/** Fila de la tabla `carrera` (docs/modelo-datos.md). */
export interface CarreraMock {
  idCarrera: number;
  nombre: string;
  estado: boolean;
  idFacultad: number;
}

/**
 * Primero las tres carreras de la pestaña Carreras de P3.1 en Figma; el resto son ficticias para que
 * los conteos de la pestaña Facultades coincidan con Figma (8, 4 y 3 carreras).
 */
export const CARRERAS_MOCK: CarreraMock[] = [
  { idCarrera: 1, nombre: 'Ingeniería de Sistemas', estado: true, idFacultad: 1 },
  { idCarrera: 2, nombre: 'Ingeniería Civil', estado: true, idFacultad: 1 },
  { idCarrera: 3, nombre: 'Contaduría Pública', estado: false, idFacultad: 2 },
  { idCarrera: 4, nombre: 'Ingeniería Informática', estado: true, idFacultad: 1 },
  { idCarrera: 5, nombre: 'Ingeniería Química', estado: true, idFacultad: 1 },
  { idCarrera: 6, nombre: 'Ingeniería de Alimentos', estado: true, idFacultad: 1 },
  { idCarrera: 7, nombre: 'Ingeniería del Petróleo y Gas Natural', estado: true, idFacultad: 1 },
  { idCarrera: 8, nombre: 'Ingeniería Industrial', estado: true, idFacultad: 1 },
  { idCarrera: 9, nombre: 'Topografía y Geodesia', estado: true, idFacultad: 1 },
  { idCarrera: 10, nombre: 'Economía', estado: true, idFacultad: 2 },
  { idCarrera: 11, nombre: 'Administración de Empresas', estado: true, idFacultad: 2 },
  { idCarrera: 12, nombre: 'Ingeniería Comercial', estado: true, idFacultad: 2 },
  { idCarrera: 13, nombre: 'Medicina', estado: false, idFacultad: 3 },
  { idCarrera: 14, nombre: 'Enfermería', estado: false, idFacultad: 3 },
  { idCarrera: 15, nombre: 'Odontología', estado: false, idFacultad: 3 },
  { idCarrera: 16, nombre: 'Derecho', estado: true, idFacultad: 4 },
];
