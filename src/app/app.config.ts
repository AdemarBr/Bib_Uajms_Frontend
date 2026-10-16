import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { ReutilizacionRutas } from './core/config/reutilizacion-rutas';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    // Las pantallas con `:id` se recrean (y recargan sus datos) cuando cambia el id de la ruta.
    { provide: RouteReuseStrategy, useClass: ReutilizacionRutas },
  ],
};
