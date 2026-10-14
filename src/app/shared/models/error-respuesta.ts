/** Cuerpo de todas las respuestas 4xx y 5xx (docs/contrato-api.md, sección 2). */
export interface ErrorRespuesta {
  status: number;
  titulo: string;
  detalle: string;
  errores: ErrorCampo[];
}

export interface ErrorCampo {
  campo: string;
  mensaje: string;
}
