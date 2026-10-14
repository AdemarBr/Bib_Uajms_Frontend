import { Routes } from '@angular/router';

import { permisoGuard } from '../../core/auth/permiso-guard';
import { PERMISOS } from '../../core/config/permisos';

/** RF2 Usuarios y roles (P2.1 a P2.5) (`/usuarios`, con `sesionGuard`). Fijas antes que `:id`. */
export const RUTAS_USUARIOS: Routes = [
  {
    path: '',
    title: 'Consultar usuarios del sistema · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.USUARIO_CONSULTAR] },
    loadComponent: () =>
      import('./pages/consultar-usuarios/consultar-usuarios').then((m) => m.ConsultarUsuarios),
  },
  {
    path: 'registrar',
    title: 'Registrar usuario interno · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.USUARIO_REGISTRAR] },
    loadComponent: () =>
      import('./pages/registrar-usuario/registrar-usuario').then((m) => m.RegistrarUsuario),
  },
  {
    path: 'restablecer-contrasena',
    title: 'Restablecer contraseña de usuario interno · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.USUARIO_RESTABLECER_PASSWORD] },
    loadComponent: () =>
      import('./pages/restablecer-contrasena/restablecer-contrasena').then(
        (m) => m.RestablecerContrasena,
      ),
  },
  {
    path: 'permisos',
    title: 'Consultar permisos por rol · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.PERMISO_CONSULTAR] },
    loadComponent: () => import('./pages/permisos-rol/permisos-rol').then((m) => m.PermisosRol),
  },
  {
    path: ':id/editar',
    title: 'Actualizar datos de usuario · Biblioteca UAJMS',
    canActivate: [permisoGuard],
    data: { permisos: [PERMISOS.USUARIO_ACTUALIZAR] },
    loadComponent: () =>
      import('./pages/actualizar-usuario/actualizar-usuario').then((m) => m.ActualizarUsuario),
  },
];
