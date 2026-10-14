import { Routes } from '@angular/router';

import { permisoGuard } from '../../core/auth/permiso-guard';
import { PERMISOS } from '../../core/config/permisos';

/** RF3 Bibliotecas, facultades y carreras (P3.1 a P3.5), dentro de LayoutPrivado (`/estructura`). */
export const RUTAS_ESTRUCTURA: Routes = [
  {
    path: '',
    title: 'Bibliotecas, facultades y carreras · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.ESTRUCTURA_CONSULTAR] },
    loadComponent: () =>
      import('./pages/consultar-estructura/consultar-estructura').then(
        (m) => m.ConsultarEstructura,
      ),
  },
  {
    path: 'facultades-carreras/registrar',
    title: 'Registrar facultad o carrera · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.FACULTAD_REGISTRAR, PERMISOS.CARRERA_REGISTRAR] },
    loadComponent: () =>
      import('./pages/registrar-facultad-carrera/registrar-facultad-carrera').then(
        (m) => m.RegistrarFacultadCarrera,
      ),
  },
  {
    path: 'facultades-carreras/actualizar',
    title: 'Actualizar facultad o carrera · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.FACULTAD_ACTUALIZAR, PERMISOS.CARRERA_ACTUALIZAR] },
    loadComponent: () =>
      import('./pages/actualizar-facultad-carrera/actualizar-facultad-carrera').then(
        (m) => m.ActualizarFacultadCarrera,
      ),
  },
  {
    path: 'bibliotecas/registrar',
    title: 'Registrar biblioteca física · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.BIBLIOTECA_REGISTRAR] },
    loadComponent: () =>
      import('./pages/registrar-biblioteca/registrar-biblioteca').then(
        (m) => m.RegistrarBiblioteca,
      ),
  },
  {
    path: 'bibliotecas/actualizar',
    title: 'Actualizar biblioteca física · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.BIBLIOTECA_ACTUALIZAR] },
    loadComponent: () =>
      import('./pages/actualizar-biblioteca/actualizar-biblioteca').then(
        (m) => m.ActualizarBiblioteca,
      ),
  },
];
