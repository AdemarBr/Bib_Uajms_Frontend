/** Valores de los desplegables de materia, autor y clasificación de P4.3 (GET /libros/opciones-filtro). */
export interface OpcionesFiltroLibroResponse {
  materias: string[];
  autores: string[];
  clasificacionesDewey: string[];
}
