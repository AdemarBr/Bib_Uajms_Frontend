import { EstadoEjemplar } from '../../ejemplares/models/estado-ejemplar';

export type EstadoPrestamo = 'activo' | 'inactivo';
export type TipoPrestamo = 'sala' | 'domicilio';

/** Préstamo de P9.2, P9.4 y P9.5 (docs/contrato-api.md, sección 10). */
export interface PrestamoResponse {
  idPrestamo: number;
  fechaPrestamo: string;
  estado: EstadoPrestamo;
  tipoPrestamo: TipoPrestamo;
  /** Solo a domicilio. */
  fechaLimiteDevolucion: string | null;
  celularContacto: string | null;
  idUsuario: number;
  usuarioNombre: string;
  usuarioRu: string | null;
  idEjemplar: number;
  ejemplarCodigo: string;
  /** Estado actual del ejemplar (RF9.1.4.3 y RF9.2.6.3). */
  ejemplarEstado: EstadoEjemplar;
  libroTitulo: string;
  idReserva: number | null;
  /** (calculado) Fecha límite anterior a hoy. */
  vencido: boolean;
  /** (calculado) */
  cantidadAmpliaciones: number;
}
