import { Routes } from '@angular/router';

import { permisoGuard } from '../../core/auth/permiso-guard';
import { PERMISOS } from '../../core/config/permisos';

/**
 * RF10 Gestión de tesis (P10.1 a P10.5) (`/gestion-tesis`, con `sesionGuard`). Fijas antes que los parámetros.
 * P10.2, P10.4 y P10.5 se abren desde P10.3.
 */
export const RUTAS_GESTION_TESIS: Routes = [
  {
    path: '',
    title: 'Consultar tesis registradas · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.TESIS_CONSULTAR] },
    loadComponent: () =>
      import('./pages/consultar-tesis/consultar-tesis').then((m) => m.ConsultarTesis),
  },
  {
    path: 'registrar',
    title: 'Registrar tesis · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.TESIS_REGISTRAR] },
    loadComponent: () =>
      import('./pages/registrar-tesis/registrar-tesis').then((m) => m.RegistrarTesis),
  },
  {
    path: ':id/editar',
    title: 'Actualizar datos de tesis · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.TESIS_ACTUALIZAR] },
    loadComponent: () =>
      import('./pages/actualizar-tesis/actualizar-tesis').then((m) => m.ActualizarTesis),
  },
  {
    path: ':id/documentos/cargar',
    title: 'Cargar documentos digitales de tesis · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.TESIS_DOCUMENTO_CARGAR] },
    loadComponent: () =>
      import('./pages/cargar-documentos/cargar-documentos').then((m) => m.CargarDocumentos),
  },
  {
    path: ':id/documentos/actualizar',
    title: 'Actualizar documento digital de tesis · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.TESIS_DOCUMENTO_ACTUALIZAR] },
    loadComponent: () =>
      import('./pages/actualizar-documento/actualizar-documento').then(
        (m) => m.ActualizarDocumento,
      ),
  },
];
