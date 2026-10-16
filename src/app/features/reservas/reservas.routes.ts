import { Routes } from '@angular/router';

import { permisoGuard } from '../../core/auth/permiso-guard';
import { PERMISOS } from '../../core/config/permisos';

/**
 * RF7 Reservas propias (P7.1 y P7.2) (`/mis-reservas`, con `sesionGuard`). Fijas antes que los parámetros.
 * P7.1 se abre desde «Reservar» de P6.1 o P6.2; sin sesión, `sesionGuard` lleva al login y vuelve aquí.
 */
export const RUTAS_MIS_RESERVAS: Routes = [
  {
    path: '',
    title: 'Mis reservas · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.RESERVA_PROPIA_CONSULTAR] },
    loadComponent: () => import('./pages/mis-reservas/mis-reservas').then((m) => m.MisReservas),
  },
  {
    path: 'nueva/:idLibro',
    title: 'Confirmar reserva · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.RESERVA_REALIZAR] },
    loadComponent: () =>
      import('./pages/confirmar-reserva/confirmar-reserva').then((m) => m.ConfirmarReserva),
  },
];
