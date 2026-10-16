import { UbicacionLibro } from './ubicacion-libro';

/** Detalle de P6.2: datos bibliográficos, disponibilidad y ubicación física (RF6.1.2.3). */
export interface LibroDetalleResponse {
  idLibro: number;
  titulo: string;
  autor: string;
  editorial: string | null;
  materia: string;
  clasificacionDewey: string | null;
  isbn: string | null;
  portadaUrl: string | null;
  ejemplaresDisponibles: number;
  ejemplaresTotales: number;
  ubicaciones: UbicacionLibro[];
}
