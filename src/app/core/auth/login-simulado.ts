import { Observable, delay, of, throwError } from 'rxjs';

import { ErrorRespuesta } from '../../shared/models/error-respuesta';
import { LoginRequest } from '../../shared/models/login-request';
import { LoginResponse } from '../../shared/models/login-response';
import { PERMISOS_POR_ROL, USUARIOS_MOCK } from './usuarios.mock';

/** Mismo error para cualquier fallo, sin indicar qué dato falló (RF1.2.4 y RF1.2.5). */
const CREDENCIALES_NO_VALIDAS: ErrorRespuesta = {
  status: 401,
  titulo: 'Credenciales no válidas',
  detalle: 'El usuario o la contraseña no son válidos, o la cuenta no se encuentra vigente.',
  errores: [],
};

const DEMORA_MS = 400;

/**
 * Simula POST /auth/login en la Iteración 4. Solo la usa el servicio Sesion;
 * en la Iteración 5 se reemplaza por la llamada HTTP.
 */
export function loginSimulado(solicitud: LoginRequest): Observable<LoginResponse> {
  const usuario = USUARIOS_MOCK.find(
    (u) => u.nombreUsuario === solicitud.nombreUsuario && u.contrasena === solicitud.contrasena,
  );

  if (!usuario || !usuario.activo) {
    return throwError(() => CREDENCIALES_NO_VALIDAS).pipe(delay(DEMORA_MS));
  }

  const respuesta: LoginResponse = {
    token: 'token-simulado',
    expiraEn: 900,
    usuario: {
      idUsuario: usuario.idUsuario,
      nombre: usuario.nombre,
      nombreUsuario: usuario.nombreUsuario,
      idBiblioteca: usuario.idBiblioteca,
      bibliotecaNombre: usuario.bibliotecaNombre,
      idCarrera: usuario.idCarrera,
      carreraNombre: usuario.carreraNombre,
    },
    rol: usuario.rol,
    tipoUsuario: usuario.tipoUsuario,
    permisos: [...(PERMISOS_POR_ROL[usuario.rol] ?? [])],
  };
  return of(respuesta).pipe(delay(DEMORA_MS));
}
