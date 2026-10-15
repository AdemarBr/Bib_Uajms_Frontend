import { Service, inject } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { Sesion } from '../../../core/auth/sesion';
import { PERMISOS } from '../../../core/config/permisos';
import { ErrorCampo, ErrorRespuesta } from '../../../shared/models/error-respuesta';
import { Pagina } from '../../../shared/models/pagina';
import { DatosCatalogo } from '../../catalogo/data-access/datos-catalogo';
import {
  DEMORA_MS,
  DatosEstructura,
  conflicto,
  datosInvalidos,
  noEncontrado,
  normalizar,
  siguienteId,
} from '../../estructura/data-access/datos-estructura';
import { EjemplarActualizarRequest } from '../models/ejemplar-actualizar-request';
import { EjemplarRequest } from '../models/ejemplar-request';
import { EjemplarResponse } from '../models/ejemplar-response';
import { ESTADOS_EJEMPLAR } from '../models/estado-ejemplar';
import { FiltroEjemplares } from '../models/filtro-ejemplares';
import { OpcionesFiltroEjemplarResponse } from '../models/opciones-filtro-ejemplar-response';
import { EjemplarMock } from './ejemplares.mock';

const TAMANIO_PAGINA = 20;
const CODIGO_EN_USO = 'El código de ejemplar ya se encuentra en uso.';
const LARGO_CODIGO = 30;
const LARGO_UBICACION = 100;

/**
 * Ejemplares de los libros (RF5). En la Iteración 5: GET/POST /ejemplares, GET /ejemplares/opciones-filtro
 * y GET/PUT /ejemplares/{id}. Usa las tablas de `DatosCatalogo`, las mismas que `Libros`.
 * Lo registrado o editado dura hasta recargar la página.
 */
@Service()
export class Ejemplares {
  private readonly datos = inject(DatosCatalogo);
  private readonly estructura = inject(DatosEstructura);
  private readonly sesion = inject(Sesion);

  /**
   * GET /ejemplares?q&idBiblioteca&idFacultad&estado&disponible&ubicacion&sinUbicacion
   * (RF5.3, RF5.3.1 y RF5.3.1.1).
   */
  listarEjemplares(filtro: FiltroEjemplares = {}): Observable<Pagina<EjemplarResponse>> {
    const q = normalizar(filtro.q ?? '');
    const deFacultad =
      filtro.idFacultad == null
        ? null
        : this.estructura.idsBibliotecasDeFacultad(filtro.idFacultad);
    const coincidencias = this.datos
      .ejemplares()
      .map((e) => this.aRespuesta(e))
      .filter(
        (e) =>
          (!q || [e.codigoEjemplar, e.libroTitulo].some((c) => normalizar(c).includes(q))) &&
          (filtro.idBiblioteca == null || e.idBiblioteca === filtro.idBiblioteca) &&
          (deFacultad === null || deFacultad.includes(e.idBiblioteca)) &&
          (filtro.estado == null || e.estado === filtro.estado) &&
          (filtro.disponible == null || e.disponible === filtro.disponible) &&
          (filtro.ubicacion == null || e.ubicacionFisica === filtro.ubicacion) &&
          (!filtro.sinUbicacion || e.ubicacionFisica === null),
      );
    const pagina = filtro.pagina ?? 0;
    const tamanio = filtro.tamanio ?? TAMANIO_PAGINA;
    return of({
      contenido: coincidencias.slice(pagina * tamanio, (pagina + 1) * tamanio),
      pagina,
      tamanio,
      totalElementos: coincidencias.length,
    }).pipe(delay(DEMORA_MS));
  }

  /** GET /ejemplares/opciones-filtro: ubicaciones distintas registradas, en orden alfabético. */
  obtenerOpcionesFiltro(): Observable<OpcionesFiltroEjemplarResponse> {
    const ubicaciones = this.datos
      .ejemplares()
      .map((e) => e.ubicacionFisica)
      .filter((u): u is string => !!u);
    return of({
      ubicaciones: [...new Set(ubicaciones)].sort((a, b) => a.localeCompare(b, 'es')),
    }).pipe(delay(DEMORA_MS));
  }

  /** GET /ejemplares/{id} (P5.3). */
  obtenerEjemplar(idEjemplar: number): Observable<EjemplarResponse> {
    const ejemplar = this.buscar(idEjemplar);
    return ejemplar ? of(this.aRespuesta(ejemplar)).pipe(delay(DEMORA_MS)) : noEncontrado();
  }

  /** POST /ejemplares: el código no puede repetirse (RF5.1 y RF5.2). */
  registrarEjemplar(solicitud: EjemplarRequest): Observable<EjemplarResponse> {
    const errores = this.validarComunes(solicitud, null);
    const libro = this.datos.libros().find((l) => l.idLibro === solicitud.idLibro);
    if (!libro || !libro.estado) errores.push({ campo: 'idLibro', mensaje: 'Es obligatorio.' });
    if (errores.length > 0) return datosInvalidos(errores);
    if (this.codigoEnUso(solicitud.codigoEjemplar)) return conflicto(CODIGO_EN_USO);

    const ejemplares = this.datos.ejemplares();
    const nuevo: EjemplarMock = {
      idEjemplar: siguienteId(ejemplares, (e) => e.idEjemplar),
      codigoEjemplar: solicitud.codigoEjemplar.trim(),
      ubicacionFisica: solicitud.ubicacionFisica?.trim() || null,
      estado: 'disponible',
      soloSala: true,
      idLibro: solicitud.idLibro,
      idBiblioteca: solicitud.idBiblioteca,
    };
    this.datos.ejemplares.set([...ejemplares, nuevo]);
    return of(this.aRespuesta(nuevo)).pipe(delay(DEMORA_MS));
  }

  /**
   * PUT /ejemplares/{id}: código, biblioteca, ubicación y estado (RF5.4 y RF5.5). Cambiar el estado
   * exige además EJEMPLAR_CAMBIAR_ESTADO (403 sin él).
   */
  actualizarEjemplar(
    idEjemplar: number,
    solicitud: EjemplarActualizarRequest,
  ): Observable<EjemplarResponse> {
    const actual = this.buscar(idEjemplar);
    if (!actual) return noEncontrado();
    if (
      solicitud.estado !== actual.estado &&
      !this.sesion.tienePermiso(PERMISOS.EJEMPLAR_CAMBIAR_ESTADO)
    ) {
      const error: ErrorRespuesta = {
        status: 403,
        titulo: 'Acceso denegado',
        detalle: 'No tiene permiso para cambiar el estado del ejemplar.',
        errores: [],
      };
      return throwError(() => error).pipe(delay(DEMORA_MS));
    }
    const errores = this.validarComunes(solicitud, actual.idBiblioteca);
    if (!ESTADOS_EJEMPLAR.includes(solicitud.estado)) {
      errores.push({ campo: 'estado', mensaje: 'Es obligatorio.' });
    }
    if (errores.length > 0) return datosInvalidos(errores);
    if (this.codigoEnUso(solicitud.codigoEjemplar, idEjemplar)) return conflicto(CODIGO_EN_USO);

    const actualizado: EjemplarMock = {
      ...actual,
      codigoEjemplar: solicitud.codigoEjemplar.trim(),
      idBiblioteca: solicitud.idBiblioteca,
      ubicacionFisica: solicitud.ubicacionFisica?.trim() || null,
      estado: solicitud.estado,
    };
    this.datos.ejemplares.update((lista) =>
      lista.map((e) => (e.idEjemplar === idEjemplar ? actualizado : e)),
    );
    return of(this.aRespuesta(actualizado)).pipe(delay(DEMORA_MS));
  }

  /**
   * Código obligatorio, largos de docs/modelo-datos.md y biblioteca activa, salvo que el ejemplar conserve
   * la que ya tenía (`idBibliotecaActual`), como con los usuarios en P2.3.
   */
  private validarComunes(
    solicitud: { codigoEjemplar: string; ubicacionFisica: string | null; idBiblioteca: number },
    idBibliotecaActual: number | null,
  ): ErrorCampo[] {
    const errores: ErrorCampo[] = [];
    const codigo = solicitud.codigoEjemplar.trim();
    if (!codigo) errores.push({ campo: 'codigoEjemplar', mensaje: 'Es obligatorio.' });
    else if (codigo.length > LARGO_CODIGO) {
      errores.push({ campo: 'codigoEjemplar', mensaje: `Máximo ${LARGO_CODIGO} caracteres.` });
    }
    if ((solicitud.ubicacionFisica?.trim().length ?? 0) > LARGO_UBICACION) {
      errores.push({ campo: 'ubicacionFisica', mensaje: `Máximo ${LARGO_UBICACION} caracteres.` });
    }
    const biblioteca = this.estructura
      .bibliotecas()
      .find((b) => b.idBiblioteca === solicitud.idBiblioteca);
    if (!biblioteca) errores.push({ campo: 'idBiblioteca', mensaje: 'Es obligatorio.' });
    else if (!biblioteca.estado && biblioteca.idBiblioteca !== idBibliotecaActual) {
      errores.push({
        campo: 'idBiblioteca',
        mensaje: 'La biblioteca seleccionada no está activa.',
      });
    }
    return errores;
  }

  private codigoEnUso(codigo: string, excepto?: number): boolean {
    return this.datos
      .ejemplares()
      .some((e) => e.idEjemplar !== excepto && normalizar(e.codigoEjemplar) === normalizar(codigo));
  }

  private buscar(idEjemplar: number): EjemplarMock | undefined {
    return this.datos.ejemplares().find((e) => e.idEjemplar === idEjemplar);
  }

  /** Arma el `EjemplarResponse` con el título del libro y el nombre actual de la biblioteca. */
  private aRespuesta(e: EjemplarMock): EjemplarResponse {
    return {
      ...e,
      disponible: e.estado === 'disponible',
      libroTitulo: this.datos.libros().find((l) => l.idLibro === e.idLibro)?.titulo ?? '',
      bibliotecaNombre:
        this.estructura.bibliotecas().find((b) => b.idBiblioteca === e.idBiblioteca)?.nombre ?? '',
    };
  }
}
