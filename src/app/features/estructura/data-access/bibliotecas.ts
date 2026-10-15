import { Service, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { ErrorCampo } from '../../../shared/models/error-respuesta';
import { BibliotecaRequest } from '../models/biblioteca-request';
import { BibliotecaResponse } from '../models/biblioteca-response';
import { BibliotecaMock, ID_BIBLIOTECA_CENTRAL } from './bibliotecas.mock';
import {
  DEMORA_MS,
  DatosEstructura,
  conflicto,
  datosInvalidos,
  noEncontrado,
  normalizar,
  siguienteId,
} from './datos-estructura';

const DUPLICADA = 'Ya existe una biblioteca con ese nombre.';

/**
 * Bibliotecas físicas (RF3.1, RF3.6 y RF3.7). En la Iteración 5: GET/POST /bibliotecas,
 * PUT /bibliotecas/{id} y GET /estructura/bibliotecas. Una biblioteca es de una facultad o de una
 * carrera, nunca de las dos.
 */
@Service()
export class Bibliotecas {
  private readonly datos = inject(DatosEstructura);

  /** GET /bibliotecas (público: selectores y página de inicio): solo las activas. */
  listarBibliotecas(): Observable<BibliotecaResponse[]> {
    const activas = this.datos.bibliotecas().filter((b) => b.estado);
    return of(activas.map((b) => this.aRespuesta(b))).pipe(delay(DEMORA_MS));
  }

  /**
   * GET /estructura/bibliotecas [ESTRUCTURA_CONSULTAR o BIBLIOTECA_ACTUALIZAR]: todas, también las
   * inactivas (P3.1 y P3.5).
   */
  listarBibliotecasEstructura(): Observable<BibliotecaResponse[]> {
    return of(this.datos.bibliotecas().map((b) => this.aRespuesta(b))).pipe(delay(DEMORA_MS));
  }

  /** POST /bibliotecas: siempre de una facultad o de una carrera (RF3.6.4). */
  registrarBiblioteca(solicitud: BibliotecaRequest): Observable<BibliotecaResponse> {
    const error = this.validar(solicitud, true);
    if (error) return error;
    if (this.existe(solicitud.nombre)) return conflicto(DUPLICADA);

    const bibliotecas = this.datos.bibliotecas();
    const nueva: BibliotecaMock = {
      idBiblioteca: siguienteId(bibliotecas, (b) => b.idBiblioteca),
      ...limpiar(solicitud),
      estado: true,
    };
    this.datos.bibliotecas.set([...bibliotecas, nueva]);
    return of(this.aRespuesta(nueva)).pipe(delay(DEMORA_MS));
  }

  /**
   * PUT /bibliotecas/{id}. De la Central solo se actualizan nombre, ubicación y descripción y su estado
   * sigue activo (RF3.7.5); la de Postgrado sigue sin facultad ni carrera.
   */
  actualizarBiblioteca(
    idBiblioteca: number,
    solicitud: BibliotecaRequest,
  ): Observable<BibliotecaResponse> {
    const actual = this.datos.bibliotecas().find((b) => b.idBiblioteca === idBiblioteca);
    if (!actual) return noEncontrado();
    const sinPertenencia = actual.idFacultad === null && actual.idCarrera === null;
    const error = this.validar(solicitud, !sinPertenencia);
    if (error) return error;
    if (this.existe(solicitud.nombre, idBiblioteca)) return conflicto(DUPLICADA);

    const datos = limpiar(solicitud);
    let actualizada: BibliotecaMock;
    if (idBiblioteca === ID_BIBLIOTECA_CENTRAL) {
      const { nombre, ubicacion, descripcion } = datos;
      actualizada = { ...actual, nombre, ubicacion, descripcion };
    } else {
      actualizada = { ...actual, ...datos, estado: solicitud.estado ?? actual.estado };
      if (sinPertenencia) actualizada = { ...actualizada, idFacultad: null, idCarrera: null };
    }
    this.datos.bibliotecas.update((lista) =>
      lista.map((b) => (b.idBiblioteca === idBiblioteca ? actualizada : b)),
    );
    return of(this.aRespuesta(actualizada)).pipe(delay(DEMORA_MS));
  }

  private validar(
    solicitud: BibliotecaRequest,
    exigePertenencia: boolean,
  ): Observable<never> | null {
    const errores: ErrorCampo[] = [];
    if (!solicitud.nombre.trim()) errores.push({ campo: 'nombre', mensaje: 'Es obligatorio.' });
    if (!solicitud.ubicacion.trim()) {
      errores.push({ campo: 'ubicacion', mensaje: 'Es obligatorio.' });
    }
    const unaSola = (solicitud.idFacultad === null) !== (solicitud.idCarrera === null);
    if (exigePertenencia && !unaSola) {
      errores.push({ campo: 'idFacultad', mensaje: 'Es obligatorio.' });
    }
    return errores.length > 0 ? datosInvalidos(errores) : null;
  }

  private existe(nombre: string, excepto?: number): boolean {
    return this.datos
      .bibliotecas()
      .some((b) => b.idBiblioteca !== excepto && normalizar(b.nombre) === normalizar(nombre));
  }

  private aRespuesta(b: BibliotecaMock): BibliotecaResponse {
    return {
      ...b,
      facultadNombre:
        this.datos.facultades().find((f) => f.idFacultad === b.idFacultad)?.nombre ?? null,
      carreraNombre: this.datos.carreras().find((c) => c.idCarrera === b.idCarrera)?.nombre ?? null,
      esBibliotecaCentral: b.idBiblioteca === ID_BIBLIOTECA_CENTRAL,
    };
  }
}

function limpiar(solicitud: BibliotecaRequest) {
  return {
    nombre: solicitud.nombre.trim(),
    ubicacion: solicitud.ubicacion.trim(),
    descripcion: solicitud.descripcion?.trim() || null,
    idFacultad: solicitud.idFacultad,
    idCarrera: solicitud.idCarrera,
  };
}
