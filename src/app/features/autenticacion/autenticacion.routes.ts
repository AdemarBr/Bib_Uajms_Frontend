import { Routes } from '@angular/router';

/** P1.1 Iniciar sesión: pública, dentro de LayoutPublico (`/iniciar-sesion`). */
export const RUTAS_INICIAR_SESION: Routes = [
  {
    path: '',
    title: 'Iniciar sesión · Biblioteca UAJMS',
    loadComponent: () =>
      import('./pages/iniciar-sesion/iniciar-sesion').then((m) => m.IniciarSesion),
  },
];

/** P1.2 Perfil de usuario: solo requiere sesión, dentro de LayoutPrivado (`/perfil`). */
export const RUTAS_PERFIL: Routes = [
  {
    path: '',
    title: 'Perfil de usuario · Biblioteca UAJMS',
    loadComponent: () =>
      import('./pages/perfil-usuario/perfil-usuario').then((m) => m.PerfilUsuario),
  },
];
