import { Service, inject, signal } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { Sesion } from '../../../core/auth/sesion';
import { ErrorRespuesta } from '../../../shared/models/error-respuesta';
import { PerfilResponse } from '../models/perfil-response';
import { PERFILES_MOCK } from './perfil.mock';

const DEMORA_MS = 300;

/** Perfil del usuario autenticado. En la Iteración 5: GET /auth/perfil (el backend lo identifica por el token). */
@Service()
export class Perfil {
  private readonly sesion = inject(Sesion);
  private readonly perfiles = signal<PerfilResponse[]>(PERFILES_MOCK);

  obtenerPerfil(): Observable<PerfilResponse> {
    const idUsuario = this.sesion.usuario()?.idUsuario;
    const perfil = this.perfiles().find((p) => p.idUsuario === idUsuario);
    if (!perfil) {
      const error: ErrorRespuesta = {
        status: 401,
        titulo: 'No se pudo iniciar sesión',
        detalle: 'El usuario o la contraseña no son válidos, o la cuenta no se encuentra vigente.',
        errores: [],
      };
      return throwError(() => error).pipe(delay(DEMORA_MS));
    }
    return of(perfil).pipe(delay(DEMORA_MS));
  }
}
