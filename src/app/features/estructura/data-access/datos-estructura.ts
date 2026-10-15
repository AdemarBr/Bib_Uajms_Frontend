import { Service, signal } from '@angular/core';
import { Observable, delay, throwError } from 'rxjs';

import { ErrorCampo, ErrorRespuesta } from '../../../shared/models/error-respuesta';
import { BIBLIOTECAS_MOCK, BibliotecaMock } from './bibliotecas.mock';
import { CARRERAS_MOCK, CarreraMock } from './carreras.mock';
import { FACULTADES_MOCK, FacultadMock } from './facultades.mock';

export const DEMORA_MS = 300;

/**
 * Tablas facultad, carrera y biblioteca del prototipo, compartidas por los servicios Facultades,
 * Carreras y Bibliotecas para que cada respuesta arme los nombres relacionados como lo haría el backend.
 * Solo existe en la Iteración 4: en la Iteración 5 desaparece y los servicios llaman a la API.
 */
@Service()
export class DatosEstructura {
  readonly facultades = signal<FacultadMock[]>(FACULTADES_MOCK);
  readonly carreras = signal<CarreraMock[]>(CARRERAS_MOCK);
  readonly bibliotecas = signal<BibliotecaMock[]>(BIBLIOTECAS_MOCK);

  /** Bibliotecas de una facultad: las de toda la facultad y las de sus carreras (filtros de P4.3 y P5.2). */
  idsBibliotecasDeFacultad(idFacultad: number): number[] {
    const carreras = this.carreras()
      .filter((c) => c.idFacultad === idFacultad)
      .map((c) => c.idCarrera);
    return this.bibliotecas()
      .filter(
        (b) =>
          b.idFacultad === idFacultad || (b.idCarrera !== null && carreras.includes(b.idCarrera)),
      )
      .map((b) => b.idBiblioteca);
  }
}

/** Minúsculas y sin tildes, para detectar nombres duplicados. */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Siguiente id de una tabla. */
export function siguienteId<T>(filas: readonly T[], id: (fila: T) => number): number {
  return Math.max(0, ...filas.map(id)) + 1;
}

/** 409: el registro duplica otro (cursos alternativos de RF3.2, RF3.3, RF3.4 y RF3.6). */
export function conflicto(detalle: string): Observable<never> {
  const error: ErrorRespuesta = { status: 409, titulo: 'Registro duplicado', detalle, errores: [] };
  return throwError(() => error).pipe(delay(DEMORA_MS));
}

/** 400 con los campos inválidos. */
export function datosInvalidos(errores: ErrorCampo[]): Observable<never> {
  const error: ErrorRespuesta = {
    status: 400,
    titulo: 'Datos inválidos',
    detalle: 'Revise los campos marcados.',
    errores,
  };
  return throwError(() => error).pipe(delay(DEMORA_MS));
}

export function noEncontrado(): Observable<never> {
  const error: ErrorRespuesta = {
    status: 404,
    titulo: 'Registro no encontrado',
    detalle: 'El registro solicitado no existe.',
    errores: [],
  };
  return throwError(() => error).pipe(delay(DEMORA_MS));
}
