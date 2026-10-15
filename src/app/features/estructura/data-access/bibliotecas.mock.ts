/** Fila de la tabla `biblioteca` (docs/modelo-datos.md): de una facultad o de una carrera, nunca de las dos. */
export interface BibliotecaMock {
  idBiblioteca: number;
  nombre: string;
  ubicacion: string;
  descripcion: string | null;
  estado: boolean;
  idFacultad: number | null;
  idCarrera: number | null;
}

/** Id de la Biblioteca Central en el prototipo (`esBibliotecaCentral`, docs/contrato-api.md). */
export const ID_BIBLIOTECA_CENTRAL = 1;

/**
 * Bibliotecas de P3.1 en Figma (pestañas Bibliotecas y Facultades) y la de Postgrado, que como la Central
 * no pertenece a ninguna facultad ni carrera. Las ubicaciones de Economía, Salud y Postgrado son ficticias;
 * las descripciones son las de las tarjetas «Bibliotecas disponibles» de la Home (Figma 9:7).
 */
export const BIBLIOTECAS_MOCK: BibliotecaMock[] = [
  {
    idBiblioteca: ID_BIBLIOTECA_CENTRAL,
    nombre: 'Biblioteca Central',
    ubicacion: 'Edificio Rectorado, 2do piso',
    descripcion: 'Biblioteca principal de la universidad',
    estado: true,
    idFacultad: null,
    idCarrera: null,
  },
  {
    idBiblioteca: 2,
    nombre: 'Biblioteca FCyT',
    ubicacion: 'Edificio FCyT, planta baja',
    descripcion: 'Colección de ciencias y tecnología',
    estado: true,
    idFacultad: 1,
    idCarrera: null,
  },
  {
    idBiblioteca: 3,
    nombre: 'Biblioteca Facultad de Derecho',
    ubicacion: 'Edificio central, planta baja',
    descripcion: 'Colección de ciencias jurídicas',
    estado: true,
    idFacultad: 4,
    idCarrera: null,
  },
  {
    idBiblioteca: 4,
    nombre: 'Biblioteca de Economía',
    ubicacion: 'Edificio de Ciencias Económicas, 1er piso',
    descripcion: 'Colección de ciencias económicas y financieras',
    estado: true,
    idFacultad: 2,
    idCarrera: null,
  },
  {
    idBiblioteca: 5,
    nombre: 'Biblioteca de Salud',
    ubicacion: 'Edificio de Ciencias de la Salud, planta baja',
    descripcion: 'Colección de ciencias de la salud',
    estado: true,
    idFacultad: 3,
    idCarrera: null,
  },
  {
    idBiblioteca: 6,
    nombre: 'Biblioteca de Postgrado',
    ubicacion: 'Edificio de Postgrado, 2do piso',
    descripcion: 'Colección de programas de postgrado',
    estado: true,
    idFacultad: null,
    idCarrera: null,
  },
];
