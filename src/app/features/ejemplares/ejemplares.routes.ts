import { Routes } from '@angular/router';

import { permisoGuard } from '../../core/auth/permiso-guard';
import { PERMISOS } from '../../core/config/permisos';

/** RF5 Ejemplares (P5.1 a P5.3) (`/ejemplares`, con `sesionGuard`). Fijas antes que `:id`. */
export const RUTAS_EJEMPLARES: Routes = [
  {
    path: '',
    title: 'Consultar ejemplares registrados · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.EJEMPLAR_CONSULTAR] },
    loadComponent: () =>
      import('./pages/consultar-ejemplares/consultar-ejemplares').then(
        (m) => m.ConsultarEjemplares,
      ),
  },
  {
    path: 'registrar',
    title: 'Registrar ejemplar de libro · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.EJEMPLAR_REGISTRAR] },
    loadComponent: () =>
      import('./pages/registrar-ejemplar/registrar-ejemplar').then((m) => m.RegistrarEjemplar),
  },
  {
    path: ':id/editar',
    title: 'Actualizar datos del ejemplar · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.EJEMPLAR_ACTUALIZAR] },
    loadComponent: () =>
      import('./pages/actualizar-ejemplar/actualizar-ejemplar').then((m) => m.ActualizarEjemplar),
  },
];
