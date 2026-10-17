import { Service, inject } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { ErrorRespuesta } from '../../../shared/models/error-respuesta';
import { Pagina } from '../../../shared/models/pagina';
import { DatosCatalogo, hoy } from '../../catalogo/data-access/datos-catalogo';
import { DEMORA_MS, normalizar } from '../../estructura/data-access/datos-estructura';
import { FiltroTesis } from '../models/filtro-tesis';
import { OpcionesFiltroTesisResponse } from '../models/opciones-filtro-tesis-response';
import { TesisDetalleResponse } from '../models/tesis-detalle-response';
import { TesisResponse } from '../models/tesis-response';
import { TIPOS_SECCION } from '../models/tipo-seccion';
import { DatosTesis, aDocumento } from './datos-tesis';
import { pdfDePrueba } from './pdf-de-prueba';

const TAMANIO_PAGINA = 20;

/**
 * Consulta pública de tesis (RF11), sin sesión. En la Iteración 5: GET /catalogo/tesis,
 * /catalogo/tesis/opciones-filtro, /catalogo/tesis/{id} y /catalogo/tesis/documentos/{id}/archivo. Solo tesis
 * activas (docs/contrato-api.md, sección 12). Las visualizaciones y aperturas se anotan en
 * `DatosCatalogo.registroUso` para RF13.
 */
@Service()
export class CatalogoTesis {
  private readonly datos = inject(DatosTesis);
  private readonly catalogo = inject(DatosCatalogo);

  /**
   * GET /catalogo/tesis?q&idCarrera&gestion (RF11.1 y RF11.1.1): `q` busca en título, autor, carrera, facultad y
   * palabras clave; de la gestión más reciente a la más antigua.
   */
  buscarTesis(filtro: FiltroTesis = {}): Observable<Pagina<TesisResponse>> {
    const q = normalizar(filtro.q ?? '');
    const coincidencias = this.activas()
      .filter(
        (t) =>
          (!q ||
            [t.titulo, t.autor, t.carreraNombre, t.facultadNombre, t.palabrasClave ?? ''].some(
              (c) => normalizar(c).includes(q),
            )) &&
          (filtro.idCarrera == null || t.idCarrera === filtro.idCarrera) &&
          (filtro.gestion == null || t.gestion === filtro.gestion),
      )
      .sort((a, b) => b.gestion - a.gestion || a.idTesis - b.idTesis);
    const pagina = filtro.pagina ?? 0;
    const tamanio = filtro.tamanio ?? TAMANIO_PAGINA;
    return of({
      contenido: coincidencias.slice(pagina * tamanio, (pagina + 1) * tamanio),
      pagina,
      tamanio,
      totalElementos: coincidencias.length,
    }).pipe(delay(DEMORA_MS));
  }

  /** GET /catalogo/tesis/opciones-filtro: gestiones de las tesis activas, de la más reciente a la más antigua. */
  obtenerOpcionesFiltro(): Observable<OpcionesFiltroTesisResponse> {
    const gestiones = [...new Set(this.activas().map((t) => t.gestion))].sort((a, b) => b - a);
    return of({ gestiones }).pipe(delay(DEMORA_MS));
  }

  /** GET /catalogo/tesis/{id} (RF11.1.2): registra la visualización (RF11.1.2.4). */
  obtenerDetalle(idTesis: number): Observable<TesisDetalleResponse> {
    const tesis = this.activas().find((t) => t.idTesis === idTesis);
    if (!tesis) {
      return error('Tesis no encontrada', 'La tesis solicitada no existe o no está disponible.');
    }
    const documentos = this.datos
      .documentos()
      .filter((d) => d.idTesis === idTesis)
      .sort((a, b) => TIPOS_SECCION.indexOf(a.tipoSeccion) - TIPOS_SECCION.indexOf(b.tipoSeccion))
      .map((d) => aDocumento(d));
    this.catalogo.registroUso.update((r) => [...r, { idTesis, fecha: hoy() }]);
    return of({ tesis, documentos }).pipe(delay(DEMORA_MS));
  }

  /**
   * GET /catalogo/tesis/documentos/{id}/archivo (RF11.1.2.1): la URL del PDF para abrirlo en otra pestaña; registra
   * la apertura (RF11.1.2.1.7). En el prototipo es un PDF de prueba con el nombre del archivo; en la Iteración 5,
   * la URL del endpoint.
   */
  abrirDocumento(idDocumento: number): Observable<string> {
    const documento = this.datos.documentos().find((d) => d.idDocumento === idDocumento);
    const tesisActiva = this.datos
      .tesis()
      .some((t) => t.idTesis === documento?.idTesis && t.estado);
    if (!documento || !tesisActiva || documento.archivoDisponible === false) {
      return error(
        'Documento no disponible',
        'El documento no se encuentra disponible para su visualización en este momento.',
      );
    }
    this.catalogo.registroUso.update((r) => [...r, { idDocumento, fecha: hoy() }]);
    const pdf = pdfDePrueba([
      `Documento de prueba: ${documento.nombreArchivo}`,
      `Sección: ${documento.tipoSeccion}`,
    ]);
    return of(URL.createObjectURL(pdf)).pipe(delay(DEMORA_MS));
  }

  private activas(): TesisResponse[] {
    return this.datos
      .tesis()
      .filter((t) => t.estado)
      .map((t) => this.datos.aRespuesta(t));
  }
}

function error(titulo: string, detalle: string): Observable<never> {
  const respuesta: ErrorRespuesta = { status: 404, titulo, detalle, errores: [] };
  return throwError(() => respuesta).pipe(delay(DEMORA_MS));
}
