import { DocumentoTesisResponse } from './documento-tesis-response';
import { TesisResponse } from './tesis-response';

/** Detalle de P11.2 (GET /catalogo/tesis/{id}, docs/contrato-api.md, sección 12). */
export interface TesisDetalleResponse {
  tesis: TesisResponse;
  /** En el orden de RF10.2.3. */
  documentos: DocumentoTesisResponse[];
}
