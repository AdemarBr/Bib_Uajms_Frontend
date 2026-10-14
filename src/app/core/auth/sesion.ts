import { Service, computed, signal } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';

import { LoginRequest } from '../../shared/models/login-request';
import { LoginResponse, UsuarioSesion } from '../../shared/models/login-response';
import { loginSimulado } from './login-simulado';

/**
 * Sesión del usuario, solo en memoria (sin localStorage, sessionStorage ni cookies).
 * Al recargar la página la sesión se pierde: es lo esperado en el prototipo.
 * En la Iteración 5 solo cambia el interior: POST /auth/login, /auth/refresh y /auth/cerrar-sesion.
 */
@Service()
export class Sesion {
  private readonly _usuario = signal<UsuarioSesion | null>(null);
  private readonly _rol = signal<string | null>(null);
  private readonly _permisos = signal<readonly string[]>([]);
  private readonly _token = signal<string | null>(null);

  readonly usuario = this._usuario.asReadonly();
  readonly rol = this._rol.asReadonly();
  readonly permisos = this._permisos.asReadonly();
  readonly token = this._token.asReadonly();

  readonly haySesion = computed(() => this._token() !== null);

  iniciarSesion(solicitud: LoginRequest): Observable<LoginResponse> {
    return loginSimulado(solicitud).pipe(tap((respuesta) => this.guardar(respuesta)));
  }

  /** RF1.5: descarta las credenciales en uso. Devuelve Observable porque en la Iteración 5 llama al backend. */
  cerrarSesion(): Observable<void> {
    return of(undefined).pipe(
      delay(200),
      tap(() => this.limpiar()),
    );
  }

  /** Con varios códigos basta con tener cualquiera de ellos. */
  tienePermiso(codigo: string | readonly string[]): boolean {
    const codigos = typeof codigo === 'string' ? [codigo] : codigo;
    const permisos = this._permisos();
    return codigos.some((c) => permisos.includes(c));
  }

  private guardar(respuesta: LoginResponse): void {
    this._usuario.set(respuesta.usuario);
    this._rol.set(respuesta.rol);
    this._permisos.set(respuesta.permisos);
    this._token.set(respuesta.token);
  }

  private limpiar(): void {
    this._usuario.set(null);
    this._rol.set(null);
    this._permisos.set([]);
    this._token.set(null);
  }
}
