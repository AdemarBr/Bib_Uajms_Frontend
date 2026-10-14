import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Sesion } from './sesion';

/**
 * Exige el permiso de la ruta según docs/rutas.md, declarado en `data: { permisos: [...] }`.
 * Con dos códigos («o») basta con tener uno. Sin sesión lleva a /iniciar-sesion; sin permiso, a /.
 *
 * Uso: `{ path: 'usuarios', canActivate: [permisoGuard], data: { permisos: [PERMISOS.USUARIO_CONSULTAR] } }`
 */
export const permisoGuard: CanActivateFn = (route, state) => {
  const sesion = inject(Sesion);
  const router = inject(Router);

  if (!sesion.haySesion()) {
    return router.createUrlTree(['/iniciar-sesion'], { queryParams: { returnUrl: state.url } });
  }

  const permisos = (route.data['permisos'] as readonly string[] | undefined) ?? [];
  if (permisos.length === 0 || sesion.tienePermiso(permisos)) {
    return true;
  }
  return router.createUrlTree(['/']);
};
