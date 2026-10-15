import { Routes } from '@angular/router';

import { sesionGuard } from './core/auth/sesion-guard';
import { sinSesionGuard } from './core/auth/sin-sesion-guard';
import { LayoutAplicacion } from './core/layout/layout-aplicacion/layout-aplicacion';

/**
 * Rutas de docs/rutas.md, todas dentro de LayoutAplicacion, que muestra el menú lateral solo con
 * sesión (RF1.2.10). Cada feature agrega las suyas con carga diferida:
 * - públicas, sin guard;
 * - con sesión, con `sesionGuard`; con permiso, además `permisoGuard` y `data: { permisos: [...] }`
 *   en sus rutas hijas.
 * Las rutas fijas van antes que las que tienen parámetro.
 */
export const routes: Routes = [
  {
    path: '',
    component: LayoutAplicacion,
    children: [
      // P.1 Home (`/`): su pantalla se construye en RF6; mientras tanto, solo el layout.
      { path: '', pathMatch: 'full', children: [] },
      {
        path: 'iniciar-sesion',
        canActivate: [sinSesionGuard],
        loadChildren: () =>
          import('./features/autenticacion/autenticacion.routes').then(
            (m) => m.RUTAS_INICIAR_SESION,
          ),
      },
      {
        path: 'perfil',
        canActivate: [sesionGuard],
        loadChildren: () =>
          import('./features/autenticacion/autenticacion.routes').then((m) => m.RUTAS_PERFIL),
      },
      {
        path: 'usuarios',
        canActivate: [sesionGuard],
        loadChildren: () =>
          import('./features/usuarios/usuarios.routes').then((m) => m.RUTAS_USUARIOS),
      },
      {
        path: 'estructura',
        canActivate: [sesionGuard],
        loadChildren: () =>
          import('./features/estructura/estructura.routes').then((m) => m.RUTAS_ESTRUCTURA),
      },
      {
        path: 'gestion-catalogo',
        canActivate: [sesionGuard],
        loadChildren: () =>
          import('./features/catalogo/catalogo.routes').then((m) => m.RUTAS_GESTION_CATALOGO),
      },
      {
        path: 'ejemplares',
        canActivate: [sesionGuard],
        loadChildren: () =>
          import('./features/ejemplares/ejemplares.routes').then((m) => m.RUTAS_EJEMPLARES),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
