import { Service, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { FacultadRequest } from '../models/facultad-request';
import { FacultadResponse } from '../models/facultad-response';
import {
  DEMORA_MS,
  DatosEstructura,
  conflicto,
  datosInvalidos,
  noEncontrado,
  normalizar,
  siguienteId,
} from './datos-estructura';
import { FacultadMock } from './facultades.mock';

const DUPLICADA = 'Ya existe una facultad con ese nombre.';

/**
 * Facultades (RF3.1, RF3.2 y RF3.3). En la Iteración 5: GET/POST /facultades, PUT /facultades/{id} y
 * GET /estructura/facultades.
 */
@Service()
export class Facultades {
  private readonly datos = inject(DatosEstructura);

  /** GET /facultades (público, para los selectores): solo las activas, con sus carreras y bibliotecas activas. */
  listarFacultades(): Observable<FacultadResponse[]> {
    const activas = this.datos.facultades().filter((f) => f.estado);
    return of(activas.map((f) => this.aRespuesta(f, true))).pipe(delay(DEMORA_MS));
  }

  /**
   * GET /estructura/facultades [ESTRUCTURA_CONSULTAR, FACULTAD_ACTUALIZAR, CARRERA_ACTUALIZAR o
   * BIBLIOTECA_ACTUALIZAR]:
   * todas, también las inactivas (P3.1, P3.3 y P3.5).
   */
  listarFacultadesEstructura(): Observable<FacultadResponse[]> {
    return of(this.datos.facultades().map((f) => this.aRespuesta(f, false))).pipe(delay(DEMORA_MS));
  }

  /** POST /facultades: el nombre no puede repetirse (RF3.2). */
  registrarFacultad(solicitud: FacultadRequest): Observable<FacultadResponse> {
    const nombre = solicitud.nombre.trim();
    if (!nombre) return datosInvalidos([{ campo: 'nombre', mensaje: 'Es obligatorio.' }]);
    if (this.existe(nombre)) return conflicto(DUPLICADA);

    const facultades = this.datos.facultades();
    const nueva: FacultadMock = {
      idFacultad: siguienteId(facultades, (f) => f.idFacultad),
      nombre,
      estado: true,
    };
    this.datos.facultades.set([...facultades, nueva]);
    return of(this.aRespuesta(nueva, false)).pipe(delay(DEMORA_MS));
  }

  /** PUT /facultades/{id}: nombre y estado; conserva sus carreras (RF3.3). */
  actualizarFacultad(idFacultad: number, solicitud: FacultadRequest): Observable<FacultadResponse> {
    const actual = this.datos.facultades().find((f) => f.idFacultad === idFacultad);
    if (!actual) return noEncontrado();
    const nombre = solicitud.nombre.trim();
    if (!nombre) return datosInvalidos([{ campo: 'nombre', mensaje: 'Es obligatorio.' }]);
    if (this.existe(nombre, idFacultad)) return conflicto(DUPLICADA);

    const actualizada: FacultadMock = {
      ...actual,
      nombre,
      estado: solicitud.estado ?? actual.estado,
    };
    this.datos.facultades.update((lista) =>
      lista.map((f) => (f.idFacultad === idFacultad ? actualizada : f)),
    );
    return of(this.aRespuesta(actualizada, false)).pipe(delay(DEMORA_MS));
  }

  private existe(nombre: string, excepto?: number): boolean {
    return this.datos
      .facultades()
      .some((f) => f.idFacultad !== excepto && normalizar(f.nombre) === normalizar(nombre));
  }

  /**
   * Arma las carreras y las bibliotecas de la facultad (las de toda la facultad y las de sus carreras);
   * en el endpoint público, solo las activas.
   */
  private aRespuesta(f: FacultadMock, soloActivas: boolean): FacultadResponse {
    const carreras = this.datos
      .carreras()
      .filter((c) => c.idFacultad === f.idFacultad && (!soloActivas || c.estado));
    const idsCarreras = this.datos
      .carreras()
      .filter((c) => c.idFacultad === f.idFacultad)
      .map((c) => c.idCarrera);
    return {
      idFacultad: f.idFacultad,
      nombre: f.nombre,
      estado: f.estado,
      carreras: carreras.map((c) => c.nombre),
      bibliotecas: this.datos
        .bibliotecas()
        .filter(
          (b) =>
            (!soloActivas || b.estado) &&
            (b.idFacultad === f.idFacultad ||
              (b.idCarrera !== null && idsCarreras.includes(b.idCarrera))),
        )
        .map((b) => b.nombre),
    };
  }
}
