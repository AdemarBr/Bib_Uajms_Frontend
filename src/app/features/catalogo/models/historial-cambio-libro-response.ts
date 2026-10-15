/** Cambio de P4.5 (RF4.6.4). `campoModificado` es el nombre del campo de `LibroRequest` o `portada`. */
export interface HistorialCambioLibroResponse {
  idHistorial: number;
  fecha: string;
  campoModificado: string;
  valorAnterior: string | null;
  valorNuevo: string | null;
}
