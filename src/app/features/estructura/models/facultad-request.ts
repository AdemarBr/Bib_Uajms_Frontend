/** Cuerpo de POST /facultades (P3.2) y PUT /facultades/{id} (P3.3). El estado solo se envía al actualizar. */
export interface FacultadRequest {
  nombre: string;
  estado?: boolean;
}
