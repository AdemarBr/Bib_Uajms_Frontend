import { Observable, delay, of, throwError } from 'rxjs';

import { ErrorRespuesta } from '../../shared/models/error-respuesta';
import { UsuarioVerificadoResponse } from '../../shared/models/usuario-verificado-response';

/**
 * Servicio de validación institucional simulado (docs/usuarios-falsos.md).
 * Simula POST /usuarios/validar-ru para los préstamos P9.1 y P9.3.
 */
interface RuVigente {
  ru: string;
  nombre: string;
  carreraNombre: string | null;
  rolNombre: string;
}

const RU_VIGENTES: RuVigente[] = [
  {
    ru: '2019001234',
    nombre: 'Estudiante Pérez',
    carreraNombre: 'Ingeniería de Sistemas',
    rolNombre: 'Estudiante',
  },
  {
    ru: '1998005678',
    nombre: 'Docente Gómez',
    carreraNombre: 'Ingeniería de Sistemas',
    rolNombre: 'Docente',
  },
  {
    ru: '2020009999',
    nombre: 'Académico Vargas',
    carreraNombre: null,
    rolNombre: 'Usuario académico',
  },
  // Vigente pero no registrado: se registra con sus datos mínimos en la primera validación.
  {
    ru: '2021004321',
    nombre: 'Estudiante Mamani',
    carreraNombre: 'Ingeniería de Sistemas',
    rolNombre: 'Estudiante',
  },
];

/** RU → idUsuario de los usuarios ya registrados en el sistema. */
const REGISTRADOS = new Map<string, number>([
  ['2019001234', 12],
  ['1998005678', 13],
  ['2020009999', 14],
]);

let siguienteIdUsuario = 100;

const DEMORA_MS = 400;

export function validarRuSimulado(ru: string): Observable<UsuarioVerificadoResponse> {
  const vigente = RU_VIGENTES.find((r) => r.ru === ru);
  if (!vigente) {
    // Texto según RF1.2: «el usuario no está vigente o es inexistente».
    const error: ErrorRespuesta = {
      status: 404,
      titulo: 'Usuario no vigente',
      detalle: 'El usuario no está vigente o es inexistente.',
      errores: [],
    };
    return throwError(() => error).pipe(delay(DEMORA_MS));
  }

  let idUsuario = REGISTRADOS.get(ru);
  const registradoAhora = idUsuario === undefined;
  if (idUsuario === undefined) {
    idUsuario = siguienteIdUsuario++;
    REGISTRADOS.set(ru, idUsuario);
  }

  return of({
    idUsuario,
    nombre: vigente.nombre,
    ru,
    carreraNombre: vigente.carreraNombre,
    rolNombre: vigente.rolNombre,
    registradoAhora,
  }).pipe(delay(DEMORA_MS));
}
