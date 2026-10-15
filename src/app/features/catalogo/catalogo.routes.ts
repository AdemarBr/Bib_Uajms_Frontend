import { Routes } from '@angular/router';

import { permisoGuard } from '../../core/auth/permiso-guard';
import { PERMISOS } from '../../core/config/permisos';

/**
 * RF4 Gestión del catálogo (P4.1 a P4.5) (`/gestion-catalogo/libros`, con `sesionGuard`).
 * Fijas antes que `:id`. P4.4 y P4.5 se abren desde P4.3 y P4.4 (no están en el menú).
 */
export const RUTAS_GESTION_CATALOGO: Routes = [
  {
    path: 'libros',
    title: 'Consultar libros registrados · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.LIBRO_CONSULTAR] },
    loadComponent: () =>
      import('./pages/consultar-libros/consultar-libros').then((m) => m.ConsultarLibros),
  },
  {
    path: 'libros/registrar',
    title: 'Registrar libro · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.LIBRO_REGISTRAR] },
    loadComponent: () =>
      import('./pages/registrar-libro/registrar-libro').then((m) => m.RegistrarLibro),
  },
  {
    path: 'libros/importar',
    title: 'Importar libros mediante archivo · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.LIBRO_IMPORTAR] },
    loadComponent: () =>
      import('./pages/importar-libros/importar-libros').then((m) => m.ImportarLibros),
  },
  {
    path: 'libros/:id/editar',
    title: 'Actualizar datos del libro · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.LIBRO_ACTUALIZAR] },
    loadComponent: () =>
      import('./pages/actualizar-libro/actualizar-libro').then((m) => m.ActualizarLibro),
  },
  {
    path: 'libros/:id/historial',
    title: 'Historial de cambios del libro · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.LIBRO_HISTORIAL_CONSULTAR] },
    loadComponent: () =>
      import('./pages/historial-libro/historial-libro').then((m) => m.HistorialLibro),
  },
];
