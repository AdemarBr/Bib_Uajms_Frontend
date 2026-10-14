import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Sesion } from './sesion';

/** P1.1 solo sin sesión: con sesión activa, `/iniciar-sesion` redirige a `/`. */
export const sinSesionGuard: CanActivateFn = () => {
  return inject(Sesion).haySesion() ? inject(Router).createUrlTree(['/']) : true;
};
