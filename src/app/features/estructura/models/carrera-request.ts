/** Cuerpo de POST /carreras (P3.2) y PUT /carreras/{id} (P3.3). El estado solo se envía al actualizar. */
export interface CarreraRequest {
  nombre: string;
  idFacultad: number;
  estado?: boolean;
}
