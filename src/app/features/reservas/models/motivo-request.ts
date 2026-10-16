/** Datos de PATCH /reservas/{id}/rechazar y /cancelar-administrativa (RF8.4 y RF8.5). */
export interface MotivoRequest {
  /** Opcional: `null` si no se registró. */
  motivo: string | null;
}
