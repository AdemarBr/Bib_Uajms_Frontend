import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Sesion } from './sesion';

/** Exige sesión. Sin sesión lleva a /iniciar-sesion con la ruta pedida en `returnUrl`. */
export const sesionGuard: CanActivateFn = (route, state) => {
  if (inject(Sesion).haySesion()) {
    return true;
  }
  return inject(Router).createUrlTree(['/iniciar-sesion'], {
    queryParams: { returnUrl: state.url },
  });
};
