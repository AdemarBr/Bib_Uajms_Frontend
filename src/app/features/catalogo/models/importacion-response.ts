/** Resumen de POST /libros/importar (RF4.2.5). */
export interface ImportacionResponse {
  incorporados: number;
  errores: ErrorImportacion[];
}

export interface ErrorImportacion {
  /** Número de fila del archivo (la cabecera es la fila 1). */
  fila: number;
  mensaje: string;
}
