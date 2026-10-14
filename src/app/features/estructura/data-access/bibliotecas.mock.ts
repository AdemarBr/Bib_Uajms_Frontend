import { BibliotecaResponse } from '../models/biblioteca-response';

/** Bibliotecas de la pestaña Bibliotecas de P3.1 en Figma. La Central es la de id 1 (docs/contrato-api.md). */
export const BIBLIOTECAS_MOCK: BibliotecaResponse[] = [
  {
    idBiblioteca: 1,
    nombre: 'Biblioteca Central',
    ubicacion: 'Edificio Rectorado, 2do piso',
    descripcion: 'Biblioteca principal de la universidad',
    estado: true,
    idFacultad: null,
    facultadNombre: null,
    idCarrera: null,
    carreraNombre: null,
    esBibliotecaCentral: true,
  },
  {
    idBiblioteca: 2,
    nombre: 'Biblioteca FCyT',
    ubicacion: 'Edificio FCyT, planta baja',
    descripcion: null,
    estado: true,
    idFacultad: 1,
    facultadNombre: 'Facultad de Ciencias y Tecnología',
    idCarrera: null,
    carreraNombre: null,
    esBibliotecaCentral: false,
  },
  {
    idBiblioteca: 3,
    nombre: 'Biblioteca Facultad de Derecho',
    ubicacion: 'Edificio central, planta baja',
    descripcion: null,
    estado: true,
    idFacultad: 2,
    facultadNombre: 'Facultad de Derecho',
    idCarrera: null,
    carreraNombre: null,
    esBibliotecaCentral: false,
  },
];
