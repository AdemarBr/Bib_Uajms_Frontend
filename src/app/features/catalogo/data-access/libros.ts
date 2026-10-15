import { Service, inject } from '@angular/core';
import { Observable, delay, from, of, switchMap, throwError } from 'rxjs';

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
import { FiltroLibros } from '../models/filtro-libros';
import { HistorialCambioLibroResponse } from '../models/historial-cambio-libro-response';
import { ErrorImportacion, ImportacionResponse } from '../models/importacion-response';
import { LibroRequest } from '../models/libro-request';
import { LibroResponse } from '../models/libro-response';
import { OpcionesFiltroLibroResponse } from '../models/opciones-filtro-libro-response';
import { DatosCatalogo } from './datos-catalogo';
import { HistorialMock } from './historial-libros.mock';
import { LibroMock } from './libros.mock';

const TAMANIO_PAGINA = 20;
const ISBN_DUPLICADO = 'Ya existe un libro con ese ISBN.';

type CampoLibro = keyof LibroRequest;

/** Campos de `LibroRequest` en el orden del formulario, con su largo máximo (docs/modelo-datos.md). */
const CAMPOS: readonly {
  campo: CampoLibro;
  largo: number;
  obligatorio: boolean;
  enFila: string;
}[] = [
  { campo: 'titulo', largo: 250, obligatorio: true, enFila: 'título' },
  { campo: 'autor', largo: 200, obligatorio: true, enFila: 'autor' },
  { campo: 'editorial', largo: 120, obligatorio: true, enFila: 'editorial' },
  { campo: 'materia', largo: 100, obligatorio: true, enFila: 'materia' },
  { campo: 'clasificacionDewey', largo: 30, obligatorio: true, enFila: 'Dewey' },
  { campo: 'isbn', largo: 20, obligatorio: false, enFila: 'ISBN' },
];

/** Tres dígitos y decimales opcionales: «005.1», «346», «515» (docs/contrato-api.md, sección 6). */
const FORMATO_DEWEY = /^\d{3}(\.\d+)?$/;

/** Cabecera exacta del archivo de importación (docs/contrato-api.md, sección 6). */
const CABECERA_IMPORTACION = [
  'titulo',
  'autor',
  'editorial',
  'materia',
  'clasificacionDewey',
  'isbn',
] as const;

type Problema = { campo: CampoLibro; tipo: 'falta' | 'largo' | 'dewey' | 'isbn' };

/**
 * Libros del catálogo (RF4). En la Iteración 5: GET/POST /libros, GET /libros/opciones-filtro,
 * GET/PUT /libros/{id}, PATCH /libros/{id}/estado, POST /libros/importar y GET /libros/{id}/historial.
 * Lo registrado o editado dura hasta recargar la página.
 */
@Service()
export class Libros {
  private readonly datos = inject(DatosCatalogo);
  private readonly estructura = inject(DatosEstructura);

  /** GET /libros?q&idBiblioteca&idFacultad&materia&autor&estado&clasificacionDewey (RF4.3, RF4.3.1 y RF4.3.1.1). */
  listarLibros(filtro: FiltroLibros = {}): Observable<Pagina<LibroResponse>> {
    const q = normalizar(filtro.q ?? '');
    const enBibliotecas = this.librosEnBibliotecas(filtro.idBiblioteca, filtro.idFacultad);
    const coincidencias = this.datos
      .libros()
      .filter(
        (l) =>
          (!q ||
            [l.titulo, l.autor].some((campo) => normalizar(campo).includes(q)) ||
            (!!l.isbn && sinGuiones(l.isbn).includes(sinGuiones(q)))) &&
          (enBibliotecas === null || enBibliotecas.has(l.idLibro)) &&
          (filtro.materia == null || l.materia === filtro.materia) &&
          (filtro.autor == null || l.autor === filtro.autor) &&
          (filtro.estado == null || l.estado === filtro.estado) &&
          (filtro.clasificacionDewey == null || l.clasificacionDewey === filtro.clasificacionDewey),
      )
      .map(aRespuesta);
    const pagina = filtro.pagina ?? 0;
    const tamanio = filtro.tamanio ?? TAMANIO_PAGINA;
    return of({
      contenido: coincidencias.slice(pagina * tamanio, (pagina + 1) * tamanio),
      pagina,
      tamanio,
      totalElementos: coincidencias.length,
    }).pipe(delay(DEMORA_MS));
  }

  /** GET /libros/opciones-filtro: valores distintos de la tabla libro, en orden alfabético. */
  obtenerOpcionesFiltro(): Observable<OpcionesFiltroLibroResponse> {
    const libros = this.datos.libros();
    const distintos = (valores: (string | null)[]) =>
      [...new Set(valores.filter((v): v is string => !!v))].sort((a, b) =>
        a.localeCompare(b, 'es'),
      );
    return of({
      materias: distintos(libros.map((l) => l.materia)),
      autores: distintos(libros.map((l) => l.autor)),
      clasificacionesDewey: distintos(libros.map((l) => l.clasificacionDewey)),
    }).pipe(delay(DEMORA_MS));
  }

  /** GET /libros/{id} */
  obtenerLibro(idLibro: number): Observable<LibroResponse> {
    const libro = this.buscar(idLibro);
    return libro ? of(aRespuesta(libro)).pipe(delay(DEMORA_MS)) : noEncontrado();
  }

  /** POST /libros (multipart: `datos` y `portada` opcional). La fecha de registro la pone el sistema (RF4.1.2). */
  registrarLibro(solicitud: LibroRequest, portada: File | null): Observable<LibroResponse> {
    const datos = limpiar(solicitud);
    const error = this.validar(datos, portada);
    if (error) return error;

    const libros = this.datos.libros();
    const nuevo: LibroMock = {
      idLibro: siguienteId(libros, (l) => l.idLibro),
      ...datos,
      portada: portada ? URL.createObjectURL(portada) : null,
      fechaIncorporacion: hoy(),
      estado: true,
    };
    this.datos.libros.set([...libros, nuevo]);
    return of(aRespuesta(nuevo)).pipe(delay(DEMORA_MS));
  }

  /** PUT /libros/{id}: cada dato modificado se anota en historial_cambio_libro (RF4.4, paso 9). */
  actualizarLibro(
    idLibro: number,
    solicitud: LibroRequest,
    portada: File | null,
  ): Observable<LibroResponse> {
    const actual = this.buscar(idLibro);
    if (!actual) return noEncontrado();
    const datos = limpiar(solicitud);
    const error = this.validar(datos, portada, idLibro);
    if (error) return error;

    const fecha = hoy();
    const cambios: Omit<HistorialMock, 'idHistorial'>[] = CAMPOS.filter(
      ({ campo }) => actual[campo] !== datos[campo],
    ).map(({ campo }) => ({
      idLibro,
      fecha,
      campoModificado: campo,
      valorAnterior: actual[campo],
      valorNuevo: datos[campo],
    }));
    if (portada) {
      cambios.push({
        idLibro,
        fecha,
        campoModificado: 'portada',
        valorAnterior: null,
        valorNuevo: null,
      });
    }
    this.datos.historial.update((historial) => {
      const id = siguienteId(historial, (h) => h.idHistorial);
      return [...historial, ...cambios.map((c, i) => ({ ...c, idHistorial: id + i }))];
    });

    const actualizado: LibroMock = {
      ...actual,
      ...datos,
      portada: portada ? URL.createObjectURL(portada) : actual.portada,
    };
    this.reemplazar(actualizado);
    return of(aRespuesta(actualizado)).pipe(delay(DEMORA_MS));
  }

  /** PATCH /libros/{id}/estado: `false` desactiva (RF4.5) y `true` activa (RF4.7); conserva su historial. */
  cambiarEstado(idLibro: number, estado: boolean): Observable<void> {
    const actual = this.buscar(idLibro);
    if (!actual) return noEncontrado();
    this.reemplazar({ ...actual, estado });
    return of(undefined).pipe(delay(DEMORA_MS));
  }

  /**
   * POST /libros/importar (RF4.2): procesa cada fila del CSV por separado; registra las válidas e informa
   * las demás con su número de fila (formato en docs/contrato-api.md, sección 6).
   */
  importarLibros(archivo: File): Observable<ImportacionResponse> {
    if (!archivo.name.toLowerCase().endsWith('.csv')) {
      return errorArchivo('Formato no admitido', 'Solo se admiten archivos CSV (.csv).');
    }
    return from(archivo.text()).pipe(
      switchMap((texto) => {
        const [cabecera, ...filas] = leerCsv(texto);
        const esperada = CABECERA_IMPORTACION.join(',');
        if (!cabecera || cabecera.map((c) => c.trim()).join(',') !== esperada) {
          return errorArchivo(
            'Archivo no válido',
            `La primera fila debe ser la cabecera ${esperada}.`,
          );
        }
        const conDatos = filas
          .map((celdas, i) => ({ celdas, fila: i + 2 }))
          .filter(({ celdas }) => celdas.some((c) => c.trim() !== ''));
        if (conDatos.length === 0) {
          return errorArchivo('Archivo no válido', 'El archivo no tiene filas de libros.');
        }
        return of(this.registrarFilas(conDatos)).pipe(delay(DEMORA_MS));
      }),
    );
  }

  /** GET /libros/{id}/historial: del cambio más reciente al más antiguo (RF4.6). */
  listarHistorial(idLibro: number): Observable<HistorialCambioLibroResponse[]> {
    if (!this.buscar(idLibro)) return noEncontrado();
    const cambios = this.datos
      .historial()
      .filter((h) => h.idLibro === idLibro)
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.idHistorial - a.idHistorial)
      .map(({ idLibro: _, ...cambio }) => cambio);
    return of(cambios).pipe(delay(DEMORA_MS));
  }

  private registrarFilas(filas: { celdas: string[]; fila: number }[]): ImportacionResponse {
    const errores: ErrorImportacion[] = [];
    const nuevos: LibroMock[] = [];
    let id = siguienteId(this.datos.libros(), (l) => l.idLibro);
    for (const { celdas, fila } of filas) {
      const [titulo, autor, editorial, materia, clasificacionDewey, isbn] =
        CABECERA_IMPORTACION.map((_, i) => celdas[i] ?? '');
      const datos = limpiar({ titulo, autor, editorial, materia, clasificacionDewey, isbn });
      const problemas = problemasDe(datos);
      if (problemas.length === 0 && this.isbnRepetido(datos.isbn, undefined, nuevos)) {
        problemas.push({ campo: 'isbn', tipo: 'isbn' });
      }
      if (problemas.length > 0) {
        errores.push({ fila, mensaje: mensajeFila(problemas[0]) });
        continue;
      }
      nuevos.push({
        idLibro: id++,
        ...datos,
        portada: null,
        fechaIncorporacion: hoy(),
        estado: true,
      });
    }
    this.datos.libros.update((libros) => [...libros, ...nuevos]);
    return { incorporados: nuevos.length, errores };
  }

  /** 400 con los campos inválidos, 409 si el ISBN ya existe; `null` si los datos son válidos. */
  private validar(
    datos: LibroRequest,
    portada: File | null,
    excepto?: number,
  ): Observable<never> | null {
    const errores: ErrorCampo[] = problemasDe(datos).map((p) => ({
      campo: p.campo,
      mensaje: mensajeCampo(p),
    }));
    if (portada && !portada.type.startsWith('image/')) {
      errores.push({ campo: 'portada', mensaje: 'Debe ser una imagen.' });
    }
    if (errores.length > 0) return datosInvalidos(errores);
    if (this.isbnRepetido(datos.isbn, excepto)) return conflicto(ISBN_DUPLICADO);
    return null;
  }

  private isbnRepetido(isbn: string | null, excepto?: number, otros: LibroMock[] = []): boolean {
    if (!isbn) return false;
    return [...this.datos.libros(), ...otros].some(
      (l) => l.idLibro !== excepto && !!l.isbn && sinGuiones(l.isbn) === sinGuiones(isbn),
    );
  }

  /**
   * Libros con algún ejemplar en la biblioteca elegida o en una biblioteca de la facultad elegida
   * (de toda la facultad o de una de sus carreras). `null` si no se filtra por ninguna de las dos.
   */
  private librosEnBibliotecas(
    idBiblioteca: number | null | undefined,
    idFacultad: number | null | undefined,
  ): Set<number> | null {
    if (idBiblioteca == null && idFacultad == null) return null;
    const carrerasDeFacultad = this.estructura
      .carreras()
      .filter((c) => c.idFacultad === idFacultad)
      .map((c) => c.idCarrera);
    const bibliotecas = this.estructura
      .bibliotecas()
      .filter(
        (b) =>
          (idBiblioteca == null || b.idBiblioteca === idBiblioteca) &&
          (idFacultad == null ||
            b.idFacultad === idFacultad ||
            (b.idCarrera !== null && carrerasDeFacultad.includes(b.idCarrera))),
      )
      .map((b) => b.idBiblioteca);
    return new Set(
      this.datos
        .ejemplares()
        .filter((e) => bibliotecas.includes(e.idBiblioteca))
        .map((e) => e.idLibro),
    );
  }

  private buscar(idLibro: number): LibroMock | undefined {
    return this.datos.libros().find((l) => l.idLibro === idLibro);
  }

  private reemplazar(libro: LibroMock): void {
    this.datos.libros.update((lista) =>
      lista.map((l) => (l.idLibro === libro.idLibro ? libro : l)),
    );
  }
}

function aRespuesta({ portada, ...libro }: LibroMock): LibroResponse {
  return { ...libro, portadaUrl: portada };
}

function limpiar(solicitud: LibroRequest): LibroRequest {
  return {
    titulo: solicitud.titulo.trim(),
    autor: solicitud.autor.trim(),
    editorial: solicitud.editorial.trim(),
    materia: solicitud.materia.trim(),
    clasificacionDewey: solicitud.clasificacionDewey.trim(),
    isbn: solicitud.isbn?.trim() || null,
  };
}

/** Problemas de los datos en el orden de los campos: falta, demasiado largo o Dewey con otro formato. */
function problemasDe(datos: LibroRequest): Problema[] {
  const problemas: Problema[] = [];
  for (const { campo, largo, obligatorio } of CAMPOS) {
    const valor = datos[campo] ?? '';
    if (obligatorio && !valor) problemas.push({ campo, tipo: 'falta' });
    else if (valor.length > largo) problemas.push({ campo, tipo: 'largo' });
    else if (campo === 'clasificacionDewey' && !FORMATO_DEWEY.test(valor)) {
      problemas.push({ campo, tipo: 'dewey' });
    }
  }
  return problemas;
}

/** Mensaje junto al campo del formulario (P4.1 y P4.4). */
function mensajeCampo({ campo, tipo }: Problema): string {
  const largo = CAMPOS.find((c) => c.campo === campo)?.largo;
  if (tipo === 'falta') return 'Es obligatorio.';
  if (tipo === 'largo') return `Máximo ${largo} caracteres.`;
  return 'No es una clasificación Dewey válida.';
}

/** Mensaje de una fila del archivo (P4.2): «falta autor.», «Dewey inválido.», «ISBN duplicado.»… */
function mensajeFila({ campo, tipo }: Problema): string {
  const nombre = CAMPOS.find((c) => c.campo === campo)?.enFila ?? campo;
  if (tipo === 'falta') return `falta ${nombre}.`;
  if (tipo === 'largo') return `${nombre} demasiado largo.`;
  if (tipo === 'dewey') return 'Dewey inválido.';
  return 'ISBN duplicado.';
}

function errorArchivo(titulo: string, detalle: string): Observable<never> {
  const error: ErrorRespuesta = { status: 400, titulo, detalle, errores: [] };
  return throwError(() => error).pipe(delay(DEMORA_MS));
}

/**
 * Filas de un CSV separado por comas: un valor puede ir entre comillas dobles (con comas o saltos de
 * línea dentro) y `""` es una comilla dentro de él.
 */
function leerCsv(texto: string): string[][] {
  const filas: string[][] = [];
  let fila: string[] = [];
  let valor = '';
  let entreComillas = false;
  const contenido = texto.replace(/^﻿/, '');
  for (let i = 0; i < contenido.length; i++) {
    const c = contenido[i];
    if (entreComillas) {
      if (c === '"' && contenido[i + 1] === '"') {
        valor += '"';
        i++;
      } else if (c === '"') {
        entreComillas = false;
      } else {
        valor += c;
      }
    } else if (c === '"') {
      entreComillas = true;
    } else if (c === ',') {
      fila.push(valor);
      valor = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && contenido[i + 1] === '\n') i++;
      filas.push([...fila, valor]);
      fila = [];
      valor = '';
    } else {
      valor += c;
    }
  }
  if (valor !== '' || fila.length > 0) filas.push([...fila, valor]);
  return filas;
}

function sinGuiones(isbn: string): string {
  return isbn.replace(/[\s-]/g, '').toLowerCase();
}

/** Fecha de hoy en ISO 8601 («2026-10-15»), en la hora local. */
function hoy(): string {
  const d = new Date();
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}
