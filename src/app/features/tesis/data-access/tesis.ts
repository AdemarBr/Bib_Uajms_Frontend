import { Service, inject } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { ErrorCampo, ErrorRespuesta } from '../../../shared/models/error-respuesta';
import { Pagina } from '../../../shared/models/pagina';
import {
  DEMORA_MS,
  DatosEstructura,
  conflicto,
  datosInvalidos,
  noEncontrado,
  normalizar,
  siguienteId,
} from '../../estructura/data-access/datos-estructura';
import { DocumentoTesisResponse } from '../models/documento-tesis-response';
import { FiltroTesis } from '../models/filtro-tesis';
import { OpcionesFiltroTesisResponse } from '../models/opciones-filtro-tesis-response';
import { TesisRequest } from '../models/tesis-request';
import { TesisResponse } from '../models/tesis-response';
import { TipoSeccion } from '../models/tipo-seccion';
import { DatosTesis, aDocumento } from './datos-tesis';
import { TesisMock } from './tesis.mock';

const TAMANIO_PAGINA = 20;
const LARGOS = { titulo: 250, autor: 150, tutor: 150, numeroInventario: 30, palabrasClave: 250 };
const INVENTARIO_DUPLICADO = 'Ya existe una tesis con ese número de inventario.';
const MAXIMO_ARCHIVO_BYTES = 20 * 1024 * 1024;

/**
 * Gestión de tesis (RF10). En la Iteración 5: GET/POST /tesis, GET /tesis/opciones-filtro, GET/PUT /tesis/{id},
 * PATCH /tesis/{id}/estado y GET/POST/PUT /tesis/{id}/documentos. Reglas en docs/contrato-api.md, sección 11.
 * Lo registrado o editado dura hasta recargar la página.
 */
@Service()
export class Tesis {
  private readonly datos = inject(DatosTesis);
  private readonly estructura = inject(DatosEstructura);

  /** GET /tesis?q&idCarrera&gestion (RF10.3, RF10.3.1 y RF10.3.1.1): de la gestión más reciente a la más antigua. */
  listarTesis(filtro: FiltroTesis = {}): Observable<Pagina<TesisResponse>> {
    const q = normalizar(filtro.q ?? '');
    const coincidencias = this.datos
      .tesis()
      .filter(
        (t) =>
          (!q || [t.titulo, t.autor, t.numeroInventario].some((c) => normalizar(c).includes(q))) &&
          (filtro.idCarrera == null || t.idCarrera === filtro.idCarrera) &&
          (filtro.gestion == null || t.gestion === filtro.gestion),
      )
      .sort((a, b) => b.gestion - a.gestion || a.idTesis - b.idTesis)
      .map((t) => this.datos.aRespuesta(t));
    const pagina = filtro.pagina ?? 0;
    const tamanio = filtro.tamanio ?? TAMANIO_PAGINA;
    return of({
      contenido: coincidencias.slice(pagina * tamanio, (pagina + 1) * tamanio),
      pagina,
      tamanio,
      totalElementos: coincidencias.length,
    }).pipe(delay(DEMORA_MS));
  }

  /** GET /tesis/opciones-filtro: gestiones distintas, de la más reciente a la más antigua. */
  obtenerOpcionesFiltro(): Observable<OpcionesFiltroTesisResponse> {
    const gestiones = [...new Set(this.datos.tesis().map((t) => t.gestion))].sort((a, b) => b - a);
    return of({ gestiones }).pipe(delay(DEMORA_MS));
  }

  /** GET /tesis/{id}. */
  obtenerTesis(idTesis: number): Observable<TesisResponse> {
    const tesis = this.buscar(idTesis);
    if (!tesis) return noEncontrado();
    return of(this.datos.aRespuesta(tesis)).pipe(delay(DEMORA_MS));
  }

  /** POST /tesis (RF10.1): número de inventario único; la tesis queda activa. */
  registrarTesis(solicitud: TesisRequest): Observable<TesisResponse> {
    const datos = limpiar(solicitud);
    const errores = this.validar(datos, null);
    if (errores.length) return datosInvalidos(errores);
    const inventario = normalizar(datos.numeroInventario);
    if (this.datos.tesis().some((t) => normalizar(t.numeroInventario) === inventario)) {
      return conflicto(INVENTARIO_DUPLICADO);
    }
    const nueva: TesisMock = {
      idTesis: siguienteId(this.datos.tesis(), (t) => t.idTesis),
      ...datos,
      estado: true,
    };
    this.datos.tesis.update((lista) => [...lista, nueva]);
    return of(this.datos.aRespuesta(nueva)).pipe(delay(DEMORA_MS));
  }

  /** PUT /tesis/{id} (RF10.4): conserva el número de inventario y el estado. */
  actualizarTesis(idTesis: number, solicitud: TesisRequest): Observable<TesisResponse> {
    const actual = this.buscar(idTesis);
    if (!actual) return noEncontrado();
    const datos = limpiar(solicitud);
    const errores = this.validar(datos, actual).filter((e) => e.campo !== 'numeroInventario');
    if (errores.length) return datosInvalidos(errores);
    const actualizada: TesisMock = {
      ...actual,
      ...datos,
      numeroInventario: actual.numeroInventario,
    };
    this.reemplazar(actualizada);
    return of(this.datos.aRespuesta(actualizada)).pipe(delay(DEMORA_MS));
  }

  /** PATCH /tesis/{id}/estado (RF10.6 y RF10.7). */
  cambiarEstado(idTesis: number, estado: boolean): Observable<void> {
    const actual = this.buscar(idTesis);
    if (!actual) return noEncontrado();
    this.reemplazar({ ...actual, estado });
    return of(undefined).pipe(delay(DEMORA_MS));
  }

  /** GET /tesis/{id}/documentos, en el orden de las secciones. */
  listarDocumentos(idTesis: number): Observable<DocumentoTesisResponse[]> {
    if (!this.buscar(idTesis)) return noEncontrado();
    const documentos = this.datos.documentos().filter((d) => d.idTesis === idTesis);
    return of(documentos.map((d) => aDocumento(d))).pipe(delay(DEMORA_MS));
  }

  /** POST /tesis/{id}/documentos (RF10.2): un documento por sección; solo PDF de hasta 20 MB. */
  cargarDocumento(
    idTesis: number,
    tipoSeccion: TipoSeccion,
    archivo: File,
  ): Observable<DocumentoTesisResponse> {
    if (!this.buscar(idTesis)) return noEncontrado();
    const invalido = validarArchivo(archivo);
    if (invalido) return invalido;
    const documentos = this.datos.documentos();
    if (documentos.some((d) => d.idTesis === idTesis && d.tipoSeccion === tipoSeccion)) {
      return error(
        409,
        'Sección ya cargada',
        'La sección ya tiene un documento cargado. Reemplácelo desde «Actualizar documento».',
      );
    }
    const nuevo: DocumentoTesisResponse = {
      idDocumento: siguienteId(documentos, (d) => d.idDocumento),
      tipoSeccion,
      nombreArchivo: archivo.name,
      idTesis,
    };
    this.datos.documentos.set([...documentos, nuevo]);
    return of(nuevo).pipe(delay(DEMORA_MS));
  }

  /** PUT /tesis/{id}/documentos/{idDocumento} (RF10.5): reemplaza solo ese documento. */
  reemplazarDocumento(
    idTesis: number,
    idDocumento: number,
    archivo: File,
  ): Observable<DocumentoTesisResponse> {
    const actual = this.datos
      .documentos()
      .find((d) => d.idDocumento === idDocumento && d.idTesis === idTesis);
    if (!actual) return noEncontrado();
    const invalido = validarArchivo(archivo);
    if (invalido) return invalido;
    const reemplazado = { ...actual, nombreArchivo: archivo.name, archivoDisponible: true };
    this.datos.documentos.update((lista) =>
      lista.map((d) => (d.idDocumento === idDocumento ? reemplazado : d)),
    );
    return of(aDocumento(reemplazado)).pipe(delay(DEMORA_MS));
  }

  private buscar(idTesis: number): TesisMock | undefined {
    return this.datos.tesis().find((t) => t.idTesis === idTesis);
  }

  private reemplazar(tesis: TesisMock): void {
    this.datos.tesis.update((lista) => lista.map((t) => (t.idTesis === tesis.idTesis ? tesis : t)));
  }

  /** Validación del contrato (sección 11); `actual` es la tesis que se actualiza (P10.4). */
  private validar(datos: TesisRequest, actual: TesisMock | null): ErrorCampo[] {
    const errores: ErrorCampo[] = [];
    for (const campo of ['titulo', 'autor', 'tutor', 'numeroInventario'] as const) {
      if (!datos[campo]) errores.push({ campo, mensaje: 'Es obligatorio.' });
    }
    for (const [campo, largo] of Object.entries(LARGOS) as [keyof typeof LARGOS, number][]) {
      if ((datos[campo]?.length ?? 0) > largo) {
        errores.push({ campo, mensaje: `Máximo ${largo} caracteres.` });
      }
    }
    if (!gestionValida(datos.gestion)) {
      errores.push({
        campo: 'gestion',
        mensaje: 'La gestión debe tener 4 dígitos y no ser posterior al año actual.',
      });
    }
    const carrera = this.estructura.carreras().find((c) => c.idCarrera === datos.idCarrera);
    if (!carrera) {
      errores.push({ campo: 'idCarrera', mensaje: 'Es obligatorio.' });
    } else if (!carrera.estado && carrera.idCarrera !== actual?.idCarrera) {
      errores.push({ campo: 'idCarrera', mensaje: 'La carrera seleccionada no está activa.' });
    }
    return errores;
  }
}

/** Gestión de 4 dígitos, no posterior al año actual (RF10.1 y RF10.4; decisión del estudiante). */
export function gestionValida(gestion: number | null | undefined): boolean {
  return (
    gestion != null &&
    Number.isInteger(gestion) &&
    gestion >= 1000 &&
    gestion <= new Date().getFullYear()
  );
}

function limpiar(s: TesisRequest): TesisRequest {
  return {
    titulo: s.titulo.trim(),
    autor: s.autor.trim(),
    tutor: s.tutor.trim(),
    gestion: s.gestion,
    numeroInventario: s.numeroInventario.trim(),
    palabrasClave: s.palabrasClave?.trim() || null,
    idCarrera: s.idCarrera,
  };
}

/** Solo PDF de hasta 20 MB (RF10.2 y RF10.5; decisión del estudiante). */
function validarArchivo(archivo: File): Observable<never> | null {
  const esPdf = archivo.type === 'application/pdf' || /\.pdf$/i.test(archivo.name);
  if (!esPdf) return archivoInvalido('Solo se admiten archivos PDF.');
  if (archivo.size > MAXIMO_ARCHIVO_BYTES) {
    return archivoInvalido('El archivo supera el tamaño máximo de 20 MB.');
  }
  return null;
}

function archivoInvalido(mensaje: string): Observable<never> {
  return error(400, 'Archivo no válido', mensaje, [{ campo: 'archivo', mensaje }]);
}

function error(
  status: number,
  titulo: string,
  detalle: string,
  errores: ErrorCampo[] = [],
): Observable<never> {
  const respuesta: ErrorRespuesta = { status, titulo, detalle, errores };
  return throwError(() => respuesta).pipe(delay(DEMORA_MS));
}
