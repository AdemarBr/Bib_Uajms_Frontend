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
    children: [],
  },
  {
    path: '',
    component: LayoutPrivado,
    canActivate: [sesionGuard],
    children: [],
  },
  { path: '**', redirectTo: '' },
];
