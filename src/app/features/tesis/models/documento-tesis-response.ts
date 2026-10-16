import { TipoSeccion } from './tipo-seccion';

/** Documento digital de una tesis (RF10.2 y RF10.5); la ruta del archivo no llega al frontend. */
export interface DocumentoTesisResponse {
  idDocumento: number;
  tipoSeccion: TipoSeccion;
  nombreArchivo: string;
  idTesis: number;
}
