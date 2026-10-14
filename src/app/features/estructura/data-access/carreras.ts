import { Service, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { ErrorCampo } from '../../../shared/models/error-respuesta';
import { CarreraRequest } from '../models/carrera-request';
import { CarreraResponse } from '../models/carrera-response';
import { CarreraMock } from './carreras.mock';
import {
  DEMORA_MS,
  DatosEstructura,
  conflicto,
  datosInvalidos,
  noEncontrado,
  normalizar,
  siguienteId,
} from './datos-estructura';

const DUPLICADA = 'Esa carrera ya está registrada en la facultad seleccionada.';

/** Carreras (RF3.1, RF3.4 y RF3.5). En la Iteración 5: GET/POST /carreras y PUT /carreras/{id}. */
@Service()
export class Carreras {
  private readonly datos = inject(DatosEstructura);

  /** GET /carreras?idFacultad (público, para los selectores en cascada). */
  listarCarreras(idFacultad?: number | null): Observable<CarreraResponse[]> {
    const carreras = this.datos
      .carreras()
      .filter((c) => idFacultad == null || c.idFacultad === idFacultad);
    return of(carreras.map((c) => this.aRespuesta(c))).pipe(delay(DEMORA_MS));
  }

  /** POST /carreras: no se repite dentro de la misma facultad (RF3.4). */
  registrarCarrera(solicitud: CarreraRequest): Observable<CarreraResponse> {
    const error = this.validar(solicitud);
    if (error) return error;
    const nombre = solicitud.nombre.trim();
    if (this.existe(nombre, solicitud.idFacultad)) return conflicto(DUPLICADA);

    const carreras = this.datos.carreras();
    const nueva: CarreraMock = {
      idCarrera: siguienteId(carreras, (c) => c.idCarrera),
      nombre,
      estado: true,
      idFacultad: solicitud.idFacultad,
    };
    this.datos.carreras.set([...carreras, nueva]);
    return of(this.aRespuesta(nueva)).pipe(delay(DEMORA_MS));
  }

  /** PUT /carreras/{id}: nombre, estado y facultad de pertenencia (RF3.5). */
  actualizarCarrera(idCarrera: number, solicitud: CarreraRequest): Observable<CarreraResponse> {
    const actual = this.datos.carreras().find((c) => c.idCarrera === idCarrera);
    if (!actual) return noEncontrado();
    const error = this.validar(solicitud);
    if (error) return error;
    const nombre = solicitud.nombre.trim();
    if (this.existe(nombre, solicitud.idFacultad, idCarrera)) return conflicto(DUPLICADA);

    const actualizada: CarreraMock = {
      ...actual,
      nombre,
      idFacultad: solicitud.idFacultad,
      estado: solicitud.estado ?? actual.estado,
    };
    this.datos.carreras.update((lista) =>
      lista.map((c) => (c.idCarrera === idCarrera ? actualizada : c)),
    );
    return of(this.aRespuesta(actualizada)).pipe(delay(DEMORA_MS));
  }

  private validar(solicitud: CarreraRequest): Observable<never> | null {
    const errores: ErrorCampo[] = [];
    if (!solicitud.nombre.trim()) errores.push({ campo: 'nombre', mensaje: 'Es obligatorio.' });
    if (!this.datos.facultades().some((f) => f.idFacultad === solicitud.idFacultad)) {
      errores.push({ campo: 'idFacultad', mensaje: 'Es obligatorio.' });
    }
    return errores.length > 0 ? datosInvalidos(errores) : null;
  }

  private existe(nombre: string, idFacultad: number, excepto?: number): boolean {
    return this.datos
      .carreras()
      .some(
        (c) =>
          c.idCarrera !== excepto &&
          c.idFacultad === idFacultad &&
          normalizar(c.nombre) === normalizar(nombre),
      );
  }

  private aRespuesta(c: CarreraMock): CarreraResponse {
    return {
      ...c,
      facultadNombre:
        this.datos.facultades().find((f) => f.idFacultad === c.idFacultad)?.nombre ?? '',
    };
  }
}
