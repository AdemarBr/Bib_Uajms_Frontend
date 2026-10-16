/** POST /prestamos/{id}/ampliaciones: fechaNueva = max(fecha límite vigente, hoy) + 7 (RF9.2.8). */
export interface AmpliacionRequest {
  fechaNueva: string;
}
