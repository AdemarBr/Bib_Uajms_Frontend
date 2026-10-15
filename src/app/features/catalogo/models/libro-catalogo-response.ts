/** Resultado de P6.1: portada, título, autor y disponibilidad (RF6.1.4; docs/contrato-api.md, sección 7). */
export interface LibroCatalogoResponse {
  idLibro: number;
  titulo: string;
  autor: string;
  portadaUrl: string | null;
  ejemplaresDisponibles: number;
  ejemplaresTotales: number;
}
