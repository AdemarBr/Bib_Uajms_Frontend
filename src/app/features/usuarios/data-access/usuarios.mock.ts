import { UsuarioResponse } from '../models/usuario-response';

/**
 * Fila de la tabla `usuario` del prototipo: guarda `idBiblioteca`, no su nombre, que `Usuarios` lee de
 * la tabla biblioteca (`DatosEstructura`) al armar cada `UsuarioResponse`, como el backend.
 */
export type UsuarioMock = Omit<UsuarioResponse, 'bibliotecaNombre'>;

const CENTRAL = { idBiblioteca: 1 };
const FCYT = { idBiblioteca: 2 };
const DERECHO = { idBiblioteca: 3 };
const SIN_BIBLIOTECA = { idBiblioteca: null };
const SISTEMAS = { idCarrera: 1, carreraNombre: 'Ingeniería de Sistemas' };
const SIN_CARRERA = { idCarrera: null, carreraNombre: null };

function interno(
  idUsuario: number,
  nombre: string,
  nombreUsuario: string,
  idRol: number,
  rolNombre: string,
  biblioteca: Pick<UsuarioMock, 'idBiblioteca'>,
  estado = true,
): UsuarioMock {
  return {
    idUsuario,
    nombre,
    nombreUsuario,
    correo: `${nombreUsuario}@uajms.edu.bo`,
    ru: null,
    estado,
    idRol,
    rolNombre,
    tipoUsuario: 'interno',
    ...biblioteca,
    ...SIN_CARRERA,
  };
}

function academico(
  idUsuario: number,
  nombre: string,
  ru: string,
  idRol: number,
  rolNombre: string,
  carrera: Pick<UsuarioMock, 'idCarrera' | 'carreraNombre'>,
): UsuarioMock {
  return {
    idUsuario,
    nombre,
    nombreUsuario: ru,
    correo: null,
    ru,
    estado: true,
    idRol,
    rolNombre,
    tipoUsuario: 'académico',
    ...SIN_BIBLIOTECA,
    ...carrera,
  };
}

/**
 * Usuarios de P2.2 (docs/usuarios-falsos.md): los usuarios de prueba del login, «Bibliotecario FCyT»
 * de Figma y cuatro internos ficticios, 14 en total como el contador de Figma. Primero las filas de Figma.
 */
export const USUARIOS_MOCK: UsuarioMock[] = [
  interno(
    1,
    'Ademar Mendez',
    'admin.general',
    8,
    'Administrador general del sistema',
    SIN_BIBLIOTECA,
  ),
  interno(3, 'Julia Altamirano', 'admin.biblioteca', 6, 'Administrador de biblioteca', CENTRAL),
  interno(9, 'Bibliotecario FCyT', 'bibliotecario.fcyt', 4, 'Bibliotecario', FCYT, false),
  interno(5, 'Carla Ríos', 'bibliotecario.central', 4, 'Bibliotecario', CENTRAL),
  interno(6, 'Marco Salazar', 'catalogador.central', 5, 'Catalogador', CENTRAL),
  interno(
    7,
    'Rosa Benítez',
    'responsable.tesis',
    7,
    'Responsable de tesis y solvencias',
    SIN_BIBLIOTECA,
  ),
  interno(8, 'Hugo Torrez', 'bibliotecario.inactivo', 4, 'Bibliotecario', CENTRAL, false),
  interno(10, 'Lucía Fernández', 'catalogador.fcyt', 5, 'Catalogador', FCYT),
  interno(11, 'Pedro Cruz', 'bibliotecario.derecho', 4, 'Bibliotecario', DERECHO),
  interno(15, 'Ana Quiroga', 'admin.derecho', 6, 'Administrador de biblioteca', DERECHO),
  interno(16, 'Mario Vaca', 'catalogador.derecho', 5, 'Catalogador', DERECHO),
  academico(12, 'Estudiante Pérez', '2019001234', 1, 'Estudiante', SISTEMAS),
  academico(13, 'Docente Gómez', '1998005678', 2, 'Docente', SISTEMAS),
  academico(14, 'Académico Vargas', '2020009999', 3, 'Usuario académico', SIN_CARRERA),
];
