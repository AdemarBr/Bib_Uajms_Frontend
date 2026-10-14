import { Routes } from '@angular/router';

import { sesionGuard } from './core/auth/sesion-guard';
import { LayoutPrivado } from './core/layout/layout-privado/layout-privado';
import { LayoutPublico } from './core/layout/layout-publico/layout-publico';

/**
 * Rutas de docs/rutas.md. Cada feature agrega las suyas con carga diferida:
 * - públicas, dentro de LayoutPublico;
 * - con sesión o permiso, dentro de LayoutPrivado, con `permisoGuard` y `data: { permisos: [...] }`.
 * Las rutas fijas van antes que las que tienen parámetro.
 */
export const routes: Routes = [
  {
    path: '',
    component: LayoutPublico,
    children: [
      // P.1 Home (`/`): su pantalla se construye en RF6; mientras tanto, solo barra superior y pie.
      { path: '', pathMatch: 'full', children: [] },
      {
        path: 'iniciar-sesion',
        loadChildren: () =>
          import('./features/autenticacion/autenticacion.routes').then(
            (m) => m.RUTAS_INICIAR_SESION,
          ),
      },
    ],
  },
  {
    path: '',
    component: LayoutPrivado,
    canActivate: [sesionGuard],
    children: [
      {
        path: 'perfil',
        loadChildren: () =>
          import('./features/autenticacion/autenticacion.routes').then((m) => m.RUTAS_PERFIL),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./features/usuarios/usuarios.routes').then((m) => m.RUTAS_USUARIOS),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
