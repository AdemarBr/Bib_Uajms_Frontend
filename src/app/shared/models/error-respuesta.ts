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

/** Único texto de error propio del frontend: no hubo respuesta del servidor (docs/contrato-api.md, sección 2). */
export const ERROR_SIN_CONEXION: ErrorRespuesta = {
  status: 0,
  titulo: 'No se pudo conectar con el servidor. Intente nuevamente.',
  detalle: '',
  errores: [],
};

/** El error tal como llega del servicio; si no tiene la forma de ErrorRespuesta, el de sin conexión. */
export function comoErrorRespuesta(error: unknown): ErrorRespuesta {
  const e = error as Partial<ErrorRespuesta> | null;
  if (e && typeof e.titulo === 'string' && typeof e.status === 'number' && e.status > 0) {
    return {
      status: e.status,
      titulo: e.titulo,
      detalle: e.detalle ?? '',
      errores: e.errores ?? [],
    };
  }
  return ERROR_SIN_CONEXION;
}
