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
 * Solo hay opciones para pantallas que se abren sin un registro elegido. Las pantallas de detalle
 * (con `:id`) se abren desde su lista y marcan como activa la opción de esa lista (`detalles`).
 */
export interface OpcionMenu {
  texto: string;
  ruta: string;
  /** Patrones de docs/rutas.md de las pantallas de detalle que se abren desde esta lista. */
  detalles?: readonly string[];
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
        detalles: ['/usuarios/:id/editar'],
        permisos: [P.USUARIO_CONSULTAR],
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
        detalles: ['/gestion-catalogo/libros/:id/editar', '/gestion-catalogo/libros/:id/historial'],
        permisos: [P.LIBRO_CONSULTAR],
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
        detalles: ['/ejemplares/:id/editar'],
        permisos: [P.EJEMPLAR_CONSULTAR],
      },
    ],
  },
  {
    texto: 'Mis reservas',
    icono: LucideBookmark,
    opciones: [
      {
        texto: 'Consultar estado de reserva',
        ruta: '/mis-reservas',
        detalles: ['/mis-reservas/nueva/:idLibro'],
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
        texto: 'Consultar tesis registradas',
        ruta: '/gestion-tesis',
        detalles: [
          '/gestion-tesis/:id/editar',
          '/gestion-tesis/:id/documentos/cargar',
          '/gestion-tesis/:id/documentos/actualizar',
        ],
        permisos: [P.TESIS_CONSULTAR],
      },
    ],
  },
  {
    texto: 'Comunicación',
    icono: LucideMessageSquare,
    opciones: [
      {
        texto: 'Bandeja de mensajes',
        ruta: '/comunicacion',
        detalles: ['/comunicacion/:id'],
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
