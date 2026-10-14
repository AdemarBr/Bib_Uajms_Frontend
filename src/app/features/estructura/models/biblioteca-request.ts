/**
 * Cuerpo de POST /bibliotecas (P3.4) y PUT /bibliotecas/{id} (P3.5). «Toda la facultad»: idFacultad con
 * valor e idCarrera nulo; de una carrera: idCarrera con valor e idFacultad nulo. El estado solo al actualizar.
 */
export interface BibliotecaRequest {
  nombre: string;
  ubicacion: string;
  descripcion: string | null;
  idFacultad: number | null;
  idCarrera: number | null;
  estado?: boolean;
}
