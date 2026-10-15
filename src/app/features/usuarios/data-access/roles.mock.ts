import { CodigoPermiso } from '../../../core/config/permisos';
import { PERMISOS_POR_ROL } from '../../../core/auth/usuarios.mock';
import { RolResponse } from '../models/rol-response';

/** Nombres de los permisos (columna «Permiso» de docs/permisos.md, tabla `permiso`). */
const NOMBRES_PERMISO: Record<CodigoPermiso, string> = {
  USUARIO_REGISTRAR: 'Registrar usuario interno',
  USUARIO_CONSULTAR: 'Consultar, buscar y filtrar usuarios',
  USUARIO_ACTUALIZAR: 'Actualizar datos de usuario',
  USUARIO_ASIGNAR_ROL: 'Asignar rol de usuario',
  USUARIO_ASIGNAR_BIBLIOTECA: 'Asignar biblioteca responsable',
  USUARIO_CAMBIAR_ESTADO: 'Activar y desactivar usuario',
  USUARIO_RESTABLECER_PASSWORD: 'Restablecer contraseña de usuario interno',
  PERMISO_CONSULTAR: 'Consultar permisos por rol',
  BIBLIOTECA_REGISTRAR: 'Registrar biblioteca física',
  BIBLIOTECA_ACTUALIZAR: 'Actualizar datos de biblioteca',
  FACULTAD_REGISTRAR: 'Registrar facultad',
  FACULTAD_ACTUALIZAR: 'Actualizar datos de facultad',
  CARRERA_REGISTRAR: 'Registrar carrera',
  CARRERA_ACTUALIZAR: 'Actualizar datos de carrera',
  ESTRUCTURA_CONSULTAR: 'Consultar bibliotecas, facultades y carreras',
  LIBRO_REGISTRAR: 'Registrar libro',
  LIBRO_CONSULTAR: 'Consultar, buscar y filtrar libros registrados',
  LIBRO_ACTUALIZAR: 'Actualizar datos del libro',
  LIBRO_CAMBIAR_ESTADO: 'Activar y desactivar libro',
  LIBRO_IMPORTAR: 'Importar libros mediante archivo',
  LIBRO_HISTORIAL_CONSULTAR: 'Consultar historial de cambios del libro',
  EJEMPLAR_REGISTRAR: 'Registrar ejemplar y asignar su código',
  EJEMPLAR_CONSULTAR: 'Consultar ejemplares, su disponibilidad y ubicación',
  EJEMPLAR_ACTUALIZAR: 'Actualizar datos del ejemplar',
  EJEMPLAR_CAMBIAR_ESTADO: 'Actualizar estado del ejemplar',
  RESERVA_REALIZAR: 'Realizar reserva de libro',
  RESERVA_PROPIA_CONSULTAR: 'Consultar estado de sus reservas',
  RESERVA_PROPIA_CANCELAR: 'Cancelar su reserva',
  RESERVA_CONSULTAR: 'Consultar reservas registradas y por biblioteca',
  RESERVA_CONFIRMAR: 'Confirmar reserva',
  RESERVA_RECHAZAR: 'Rechazar reserva',
  RESERVA_CANCELAR: 'Cancelar reserva administrativa',
  RESERVA_HISTORIAL_CONSULTAR: 'Consultar historial de reservas',
  PRESTAMO_SALA_REGISTRAR: 'Registrar préstamo en sala',
  PRESTAMO_DOMICILIO_REGISTRAR: 'Registrar préstamo a domicilio',
  PRESTAMO_CONSULTAR: 'Consultar préstamos vigentes',
  PRESTAMO_AMPLIAR: 'Ampliar plazo de préstamo a domicilio',
  DEVOLUCION_REGISTRAR: 'Registrar devolución de libro',
  DEVOLUCION_HISTORIAL_CONSULTAR: 'Consultar historial de devoluciones',
  TESIS_REGISTRAR: 'Registrar tesis',
  TESIS_CONSULTAR: 'Consultar, buscar y filtrar tesis registradas',
  TESIS_ACTUALIZAR: 'Actualizar datos de tesis',
  TESIS_CAMBIAR_ESTADO: 'Activar y desactivar tesis',
  TESIS_DOCUMENTO_CARGAR: 'Cargar documentos digitales de tesis',
  TESIS_DOCUMENTO_ACTUALIZAR: 'Actualizar documento digital de tesis',
  MENSAJE_ENVIAR_CONSULTA: 'Enviar consulta al bibliotecario',
  MENSAJE_CONSULTAR: 'Consultar mensajes enviados y recibidos',
  MENSAJE_RESPONDER: 'Responder consulta del usuario',
  DASHBOARD_VER: 'Visualizar dashboards y filtrar estadísticas',
  REPORTE_GENERAR: 'Generar reportes',
  REPORTE_EXPORTAR: 'Exportar reportes',
};

function rol(idRol: number, nombre: string, tipoUsuario: RolResponse['tipoUsuario']): RolResponse {
  const permisos = PERMISOS_POR_ROL[nombre] ?? [];
  return {
    idRol,
    nombre,
    tipoUsuario,
    permisos: permisos.map((codigo) => ({ codigo, nombre: NOMBRES_PERMISO[codigo] })),
  };
}

/** Roles de docs/permisos.md, en su orden (Bibliotecario es el id 4, como en el contrato). */
export const ROLES_MOCK: RolResponse[] = [
  rol(1, 'Estudiante', 'académico'),
  rol(2, 'Docente', 'académico'),
  rol(3, 'Usuario académico', 'académico'),
  rol(4, 'Bibliotecario', 'interno'),
  rol(5, 'Catalogador', 'interno'),
  rol(6, 'Administrador de biblioteca', 'interno'),
  rol(7, 'Responsable de tesis y solvencias', 'interno'),
  rol(8, 'Administrador general del sistema', 'interno'),
];
