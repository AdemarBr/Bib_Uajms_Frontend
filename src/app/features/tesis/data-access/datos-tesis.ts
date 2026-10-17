import { Service, inject, signal } from '@angular/core';

import { DatosEstructura } from '../../estructura/data-access/datos-estructura';
import { DocumentoTesisResponse } from '../models/documento-tesis-response';
import { TesisResponse } from '../models/tesis-response';
import { DOCUMENTOS_TESIS_MOCK, DocumentoTesisMock, TESIS_MOCK, TesisMock } from './tesis.mock';

/**
 * Tablas tesis y documento_tesis del prototipo, para la gestión (RF10) y la consulta pública (RF11), con el
 * armado de la carrera y la facultad como lo haría el backend. Solo existe en la Iteración 4.
 */
@Service()
export class DatosTesis {
  private readonly estructura = inject(DatosEstructura);

  readonly tesis = signal<TesisMock[]>(TESIS_MOCK);
  readonly documentos = signal<DocumentoTesisMock[]>(DOCUMENTOS_TESIS_MOCK);

  aRespuesta(t: TesisMock): TesisResponse {
    const carrera = this.estructura.carreras().find((c) => c.idCarrera === t.idCarrera);
    const facultad = this.estructura.facultades().find((f) => f.idFacultad === carrera?.idFacultad);
    return {
      ...t,
      carreraNombre: carrera?.nombre ?? '',
      idFacultad: facultad?.idFacultad ?? 0,
      facultadNombre: facultad?.nombre ?? '',
    };
  }
}

/** `DocumentoTesisResponse` sin los datos internos de la fila (como el backend, que no envía la ruta del archivo). */
export function aDocumento(d: DocumentoTesisMock): DocumentoTesisResponse {
  return {
    idDocumento: d.idDocumento,
    tipoSeccion: d.tipoSeccion,
    nombreArchivo: d.nombreArchivo,
    idTesis: d.idTesis,
  };
}
