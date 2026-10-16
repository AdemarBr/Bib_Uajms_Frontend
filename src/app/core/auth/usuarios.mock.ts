import { CodigoPermiso, PERMISOS } from '../config/permisos';
import { TipoUsuario, UsuarioSesion } from '../../shared/models/login-response';

/**
 * Usuarios de prueba del prototipo (docs/usuarios-falsos.md).
 * Las contraseñas existen solo aquí: nunca van al backend ni a la base de datos.
 */
export interface UsuarioMock extends UsuarioSesion {
  contrasena: string;
  activo: boolean;
  rol: string;
  tipoUsuario: TipoUsuario;
}

const P = PERMISOS;

const PERMISOS_ACADEMICO: CodigoPermiso[] = [
  P.RESERVA_REALIZAR,
  P.RESERVA_PROPIA_CONSULTAR,
  P.RESERVA_PROPIA_CANCELAR,
  P.MENSAJE_ENVIAR_CONSULTA,
  P.MENSAJE_CONSULTAR,
];

const PERMISOS_CATALOGO_Y_EJEMPLARES: CodigoPermiso[] = [
  P.LIBRO_REGISTRAR,
  P.LIBRO_CONSULTAR,
  P.LIBRO_ACTUALIZAR,
  P.LIBRO_CAMBIAR_ESTADO,
  P.LIBRO_IMPORTAR,
  P.LIBRO_HISTORIAL_CONSULTAR,
  P.EJEMPLAR_REGISTRAR,
  P.EJEMPLAR_CONSULTAR,
  P.EJEMPLAR_ACTUALIZAR,
  P.EJEMPLAR_CAMBIAR_ESTADO,
];

const PERMISOS_ADMINISTRAR_RESERVAS: CodigoPermiso[] = [
  P.RESERVA_CONSULTAR,
  P.RESERVA_CONFIRMAR,
  P.RESERVA_RECHAZAR,
  P.RESERVA_CANCELAR,
  P.RESERVA_HISTORIAL_CONSULTAR,
];

const PERMISOS_REPORTES: CodigoPermiso[] = [P.DASHBOARD_VER, P.REPORTE_GENERAR, P.REPORTE_EXPORTAR];

/** Matriz de docs/permisos.md: rol → permisos. */
export const PERMISOS_POR_ROL: Record<string, CodigoPermiso[]> = {
  Estudiante: PERMISOS_ACADEMICO,
  Docente: PERMISOS_ACADEMICO,
  'Usuario académico': PERMISOS_ACADEMICO,
  Bibliotecario: [
    ...PERMISOS_ADMINISTRAR_RESERVAS,
    P.PRESTAMO_SALA_REGISTRAR,
    P.PRESTAMO_DOMICILIO_REGISTRAR,
    P.PRESTAMO_CONSULTAR,
    P.PRESTAMO_AMPLIAR,
    P.DEVOLUCION_REGISTRAR,
    P.DEVOLUCION_HISTORIAL_CONSULTAR,
    P.MENSAJE_CONSULTAR,
    P.MENSAJE_RESPONDER,
    ...PERMISOS_REPORTES,
  ],
  Catalogador: PERMISOS_CATALOGO_Y_EJEMPLARES,
  'Administrador de biblioteca': [
    ...PERMISOS_CATALOGO_Y_EJEMPLARES,
    ...PERMISOS_ADMINISTRAR_RESERVAS,
    ...PERMISOS_REPORTES,
  ],
  'Responsable de tesis y solvencias': [
    P.TESIS_REGISTRAR,
    P.TESIS_CONSULTAR,
    P.TESIS_ACTUALIZAR,
    P.TESIS_CAMBIAR_ESTADO,
    P.TESIS_DOCUMENTO_CARGAR,
    P.TESIS_DOCUMENTO_ACTUALIZAR,
  ],
  'Administrador general del sistema': Object.values(PERMISOS),
};

const CENTRAL = { idBiblioteca: 1, bibliotecaNombre: 'Biblioteca Central' };
const SIN_BIBLIOTECA = { idBiblioteca: null, bibliotecaNombre: null };
const SISTEMAS = { idCarrera: 1, carreraNombre: 'Ingeniería de Sistemas' };
const SIN_CARRERA = { idCarrera: null, carreraNombre: null };

export const USUARIOS_MOCK: UsuarioMock[] = [
  {
    idUsuario: 12,
    nombre: 'Estudiante Pérez',
    nombreUsuario: '2019001234',
    contrasena: 'demo123',
    activo: true,
    rol: 'Estudiante',
    tipoUsuario: 'académico',
    ...SIN_BIBLIOTECA,
    ...SISTEMAS,
  },
  {
    idUsuario: 13,
    nombre: 'Docente Gómez',
    nombreUsuario: '1998005678',
    contrasena: 'demo123',
    activo: true,
    rol: 'Docente',
    tipoUsuario: 'académico',
    ...SIN_BIBLIOTECA,
    ...SISTEMAS,
  },
  {
    idUsuario: 14,
    nombre: 'Académico Vargas',
    nombreUsuario: '2020009999',
    contrasena: 'demo123',
    activo: true,
    rol: 'Usuario académico',
    tipoUsuario: 'académico',
    ...SIN_BIBLIOTECA,
    ...SIN_CARRERA,
  },
  {
    idUsuario: 17,
    nombre: 'Estudiante Rojas',
    nombreUsuario: '2022003456',
    contrasena: 'demo123',
    activo: true,
    rol: 'Estudiante',
    tipoUsuario: 'académico',
    ...SIN_BIBLIOTECA,
    ...SISTEMAS,
  },
  {
    idUsuario: 5,
    nombre: 'Carla Ríos',
    nombreUsuario: 'bibliotecario.central',
    contrasena: 'demo123',
    activo: true,
    rol: 'Bibliotecario',
    tipoUsuario: 'interno',
    ...CENTRAL,
    ...SIN_CARRERA,
  },
  {
    idUsuario: 6,
    nombre: 'Marco Salazar',
    nombreUsuario: 'catalogador.central',
    contrasena: 'demo123',
    activo: true,
    rol: 'Catalogador',
    tipoUsuario: 'interno',
    ...CENTRAL,
    ...SIN_CARRERA,
  },
  {
    idUsuario: 3,
    nombre: 'Julia Altamirano',
    nombreUsuario: 'admin.biblioteca',
    contrasena: 'demo123',
    activo: true,
    rol: 'Administrador de biblioteca',
    tipoUsuario: 'interno',
    ...CENTRAL,
    ...SIN_CARRERA,
  },
  {
    idUsuario: 7,
    nombre: 'Rosa Benítez',
    nombreUsuario: 'responsable.tesis',
    contrasena: 'demo123',
    activo: true,
    rol: 'Responsable de tesis y solvencias',
    tipoUsuario: 'interno',
    ...SIN_BIBLIOTECA,
    ...SIN_CARRERA,
  },
  {
    idUsuario: 1,
    nombre: 'Ademar Mendez',
    nombreUsuario: 'admin.general',
    contrasena: 'demo123',
    activo: true,
    rol: 'Administrador general del sistema',
    tipoUsuario: 'interno',
    ...SIN_BIBLIOTECA,
    ...SIN_CARRERA,
  },
  {
    idUsuario: 8,
    nombre: 'Hugo Torrez',
    nombreUsuario: 'bibliotecario.inactivo',
    contrasena: 'demo123',
    activo: false,
    rol: 'Bibliotecario',
    tipoUsuario: 'interno',
    ...CENTRAL,
    ...SIN_CARRERA,
  },
];
