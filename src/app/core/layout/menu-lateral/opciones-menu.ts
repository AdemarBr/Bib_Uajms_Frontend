import {
  LucideArrowRightLeft,
  LucideBook,
  LucideBookmark,
  LucideCalendar,
  LucideChartNoAxesColumn,
  LucideGraduationCap,
  LucideIcon,
  LucideLayers,
  LucideMessageSquare,
  LucideSchool,
  LucideUser,
} from '@lucide/angular';

import { CodigoPermiso, PERMISOS as P } from '../../config/permisos';

/**
 * Menú lateral de Figma (componente Sidebar). Textos de Figma; rutas y permisos de docs/rutas.md.
 *
 * `ruta` es el patrón de docs/rutas.md y sirve para marcar la opción activa. Cuando la pantalla
 * necesita un id (`:id`), la opción lleva a `destino`, la pantalla desde donde se elige el registro.
 */
export interface OpcionMenu {
  texto: string;
  ruta: string;
  destino?: string;
  permisos: readonly CodigoPermiso[];
  /** Grupo de la opción; su encabezado se muestra antes de la primera opción visible del grupo («DASHBOARDS», «REPORTES»). */
  grupo?: string;
}

export interface ModuloMenu {
  texto: string;
  icono: LucideIcon;
  opciones: readonly OpcionMenu[];
}

export const MODULOS_MENU: readonly ModuloMenu[] = [
  {
    texto: 'Usuarios y roles',
    icono: LucideUser,
    opciones: [
      {
        texto: 'Registrar usuario interno',
        ruta: '/usuarios/registrar',
        permisos: [P.USUARIO_REGISTRAR],
      },
      {
        texto: 'Consultar usuarios del sistema',
        ruta: '/usuarios',
        permisos: [P.USUARIO_CONSULTAR],
      },
      {
        texto: 'Actualizar datos de usuario',
        ruta: '/usuarios/:id/editar',
        destino: '/usuarios',
        permisos: [P.USUARIO_ACTUALIZAR],
      },
      {
        texto: 'Restablecer contraseña de usuario interno',
        ruta: '/usuarios/restablecer-contrasena',
        permisos: [P.USUARIO_RESTABLECER_PASSWORD],
      },
      {
        texto: 'Consultar permisos por rol',
        ruta: '/usuarios/permisos',
        permisos: [P.PERMISO_CONSULTAR],
      },
    ],
  },
  {
    texto: 'Bibliotecas, facultades y carreras',
    icono: LucideSchool,
    opciones: [
      { texto: 'Vista general', ruta: '/estructura', permisos: [P.ESTRUCTURA_CONSULTAR] },
      {
        texto: 'Registrar facultad o carrera',
        ruta: '/estructura/facultades-carreras/registrar',
        permisos: [P.FACULTAD_REGISTRAR, P.CARRERA_REGISTRAR],
      },
      {
        texto: 'Actualizar facultad o carrera',
        ruta: '/estructura/facultades-carreras/actualizar',
        permisos: [P.FACULTAD_ACTUALIZAR, P.CARRERA_ACTUALIZAR],
      },
      {
        texto: 'Registrar biblioteca física',
        ruta: '/estructura/bibliotecas/registrar',
        permisos: [P.BIBLIOTECA_REGISTRAR],
      },
      {
        texto: 'Actualizar biblioteca física',
        ruta: '/estructura/bibliotecas/actualizar',
        permisos: [P.BIBLIOTECA_ACTUALIZAR],
      },
    ],
  },
  {
    texto: 'Gestión de catálogo',
    icono: LucideBook,
    opciones: [
      {
        texto: 'Registrar libro',
        ruta: '/gestion-catalogo/libros/registrar',
        permisos: [P.LIBRO_REGISTRAR],
      },
      {
        texto: 'Importar libros mediante archivo',
        ruta: '/gestion-catalogo/libros/importar',
        permisos: [P.LIBRO_IMPORTAR],
      },
      {
        texto: 'Consultar libros registrados',
        ruta: '/gestion-catalogo/libros',
        permisos: [P.LIBRO_CONSULTAR],
      },
      {
        texto: 'Actualizar datos del libro',
        ruta: '/gestion-catalogo/libros/:id/editar',
        destino: '/gestion-catalogo/libros',
        permisos: [P.LIBRO_ACTUALIZAR],
      },
      {
        texto: 'Historial de cambios de libro',
        ruta: '/gestion-catalogo/libros/:id/historial',
        destino: '/gestion-catalogo/libros',
        permisos: [P.LIBRO_HISTORIAL_CONSULTAR],
      },
    ],
  },
  {
    texto: 'Ejemplares',
    icono: LucideLayers,
    opciones: [
      {
        texto: 'Registrar ejemplar de libro',
        ruta: '/ejemplares/registrar',
        permisos: [P.EJEMPLAR_REGISTRAR],
      },
      {
        texto: 'Consultar ejemplares registrados',
        ruta: '/ejemplares',
        permisos: [P.EJEMPLAR_CONSULTAR],
      },
      {
        texto: 'Actualizar datos del ejemplar',
        ruta: '/ejemplares/:id/editar',
        destino: '/ejemplares',
        permisos: [P.EJEMPLAR_ACTUALIZAR],
      },
    ],
  },
  {
    texto: 'Mis reservas',
    icono: LucideBookmark,
    opciones: [
      {
        texto: 'Registrar reserva de libro',
        ruta: '/mis-reservas/nueva/:idLibro',
        destino: '/catalogo',
        permisos: [P.RESERVA_REALIZAR],
      },
      {
        texto: 'Consultar estado de reserva',
        ruta: '/mis-reservas',
        permisos: [P.RESERVA_PROPIA_CONSULTAR],
      },
    ],
  },
  {
    texto: 'Reservas',
    icono: LucideCalendar,
    opciones: [
      {
        texto: 'Listado de reservas registradas',
        ruta: '/reservas',
        permisos: [P.RESERVA_CONSULTAR],
      },
      {
        texto: 'Historial de reservas',
        ruta: '/reservas/historial',
        permisos: [P.RESERVA_HISTORIAL_CONSULTAR],
      },
    ],
  },
  {
    texto: 'Préstamos',
    icono: LucideArrowRightLeft,
    opciones: [
      {
        texto: 'Registrar préstamo en sala',
        ruta: '/prestamos/sala/registrar',
        permisos: [P.PRESTAMO_SALA_REGISTRAR],
      },
      {
        texto: 'Préstamos en sala vigentes',
        ruta: '/prestamos/sala',
        permisos: [P.PRESTAMO_CONSULTAR],
      },
      {
        texto: 'Registrar préstamo a domicilio',
        ruta: '/prestamos/domicilio/registrar',
        permisos: [P.PRESTAMO_DOMICILIO_REGISTRAR],
      },
      {
        texto: 'Préstamos a domicilio vigentes',
        ruta: '/prestamos/domicilio',
        permisos: [P.PRESTAMO_CONSULTAR],
      },
      {
        texto: 'Registrar devolución de libro',
        ruta: '/prestamos/devoluciones/registrar',
        permisos: [P.DEVOLUCION_REGISTRAR],
      },
      {
        texto: 'Consultar historial de devoluciones',
        ruta: '/prestamos/devoluciones',
        permisos: [P.DEVOLUCION_HISTORIAL_CONSULTAR],
      },
    ],
  },
  {
    texto: 'Gestión de tesis',
    icono: LucideGraduationCap,
    opciones: [
      { texto: 'Registrar tesis', ruta: '/gestion-tesis/registrar', permisos: [P.TESIS_REGISTRAR] },
      {
        texto: 'Cargar documentos digitales de tesis',
        ruta: '/gestion-tesis/documentos/cargar',
        permisos: [P.TESIS_DOCUMENTO_CARGAR],
      },
      {
        texto: 'Consultar tesis registradas',
        ruta: '/gestion-tesis',
        permisos: [P.TESIS_CONSULTAR],
      },
      {
        texto: 'Actualizar datos de tesis',
        ruta: '/gestion-tesis/:id/editar',
        destino: '/gestion-tesis',
        permisos: [P.TESIS_ACTUALIZAR],
      },
      {
        texto: 'Actualizar documento digital de tesis',
        ruta: '/gestion-tesis/documentos/actualizar',
        permisos: [P.TESIS_DOCUMENTO_ACTUALIZAR],
      },
    ],
  },
  {
    texto: 'Comunicación',
    icono: LucideMessageSquare,
    opciones: [
      { texto: 'Bandeja de mensajes', ruta: '/comunicacion', permisos: [P.MENSAJE_CONSULTAR] },
      {
        texto: 'Ver conversación',
        ruta: '/comunicacion/:id',
        destino: '/comunicacion',
        permisos: [P.MENSAJE_CONSULTAR],
      },
    ],
  },
  {
    texto: 'Reportes y dashboards',
    icono: LucideChartNoAxesColumn,
    opciones: [
      {
        texto: 'Dashboard general',
        ruta: '/reportes',
        permisos: [P.DASHBOARD_VER],
        grupo: 'DASHBOARDS',
      },
      {
        texto: 'Uso del catálogo',
        ruta: '/reportes/dashboard/catalogo',
        permisos: [P.DASHBOARD_VER],
        grupo: 'DASHBOARDS',
      },
      {
        texto: 'Préstamos',
        ruta: '/reportes/dashboard/prestamos',
        permisos: [P.DASHBOARD_VER],
        grupo: 'DASHBOARDS',
      },
      {
        texto: 'Reservas',
        ruta: '/reportes/dashboard/reservas',
        permisos: [P.DASHBOARD_VER],
        grupo: 'DASHBOARDS',
      },
      {
        texto: 'Tesis',
        ruta: '/reportes/dashboard/tesis',
        permisos: [P.DASHBOARD_VER],
        grupo: 'DASHBOARDS',
      },
      {
        texto: 'Libros más consultados',
        ruta: '/reportes/libros-mas-consultados',
        permisos: [P.REPORTE_GENERAR],
        grupo: 'REPORTES',
      },
      {
        texto: 'Préstamos',
        ruta: '/reportes/prestamos',
        permisos: [P.REPORTE_GENERAR],
        grupo: 'REPORTES',
      },
      {
        texto: 'Reservas',
        ruta: '/reportes/reservas',
        permisos: [P.REPORTE_GENERAR],
        grupo: 'REPORTES',
      },
      {
        texto: 'Tesis más consultadas',
        ruta: '/reportes/tesis-mas-consultadas',
        permisos: [P.REPORTE_GENERAR],
        grupo: 'REPORTES',
      },
      {
        texto: 'Por facultad',
        ruta: '/reportes/por-facultad',
        permisos: [P.REPORTE_GENERAR],
        grupo: 'REPORTES',
      },
      {
        texto: 'Por carrera',
        ruta: '/reportes/por-carrera',
        permisos: [P.REPORTE_GENERAR],
        grupo: 'REPORTES',
      },
    ],
  },
];
