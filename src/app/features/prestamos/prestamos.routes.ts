import { Routes } from '@angular/router';

import { permisoGuard } from '../../core/auth/permiso-guard';
import { PERMISOS } from '../../core/config/permisos';

/**
 * RF9 Préstamos y devoluciones (P9.1 a P9.6) (`/prestamos`, con `sesionGuard`). Fijas antes que las cortas.
 * P9.1 y P9.3 aceptan `?idReserva=N` desde «Prestar» de P8.1 (RF8.8).
 */
export const RUTAS_PRESTAMOS: Routes = [
  {
    path: 'sala/registrar',
    title: 'Registrar préstamo en sala · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.PRESTAMO_SALA_REGISTRAR] },
    loadComponent: () =>
      import('./pages/registrar-prestamo-sala/registrar-prestamo-sala').then(
        (m) => m.RegistrarPrestamoSala,
      ),
  },
  {
    path: 'sala',
    title: 'Préstamos en sala vigentes · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.PRESTAMO_CONSULTAR] },
    loadComponent: () =>
      import('./pages/prestamos-sala/prestamos-sala').then((m) => m.PrestamosSala),
  },
  {
    path: 'domicilio/registrar',
    title: 'Registrar préstamo a domicilio · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.PRESTAMO_DOMICILIO_REGISTRAR] },
    loadComponent: () =>
      import('./pages/registrar-prestamo-domicilio/registrar-prestamo-domicilio').then(
        (m) => m.RegistrarPrestamoDomicilio,
      ),
  },
  {
    path: 'domicilio',
    title: 'Préstamos a domicilio vigentes · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.PRESTAMO_CONSULTAR] },
    loadComponent: () =>
      import('./pages/prestamos-domicilio/prestamos-domicilio').then((m) => m.PrestamosDomicilio),
  },
  {
    path: 'devoluciones/registrar',
    title: 'Registrar devolución de libro · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.DEVOLUCION_REGISTRAR] },
    loadComponent: () =>
      import('./pages/registrar-devolucion/registrar-devolucion').then(
        (m) => m.RegistrarDevolucion,
      ),
  },
  {
    path: 'devoluciones',
    title: 'Consultar historial de devoluciones · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.DEVOLUCION_HISTORIAL_CONSULTAR] },
    loadComponent: () =>
      import('./pages/historial-devoluciones/historial-devoluciones').then(
        (m) => m.HistorialDevoluciones,
      ),
  },
];
