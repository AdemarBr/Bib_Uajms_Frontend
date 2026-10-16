/** POST /prestamos/domicilio (P9.3): fecha límite entre mañana y hoy + 30 días; celular de 8 dígitos. */
export interface PrestamoDomicilioRequest {
  ru: string;
  idEjemplar: number;
  fechaLimiteDevolucion: string;
  celularContacto: string;
  idReserva: number | null;
}
