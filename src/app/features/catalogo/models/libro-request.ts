/** Datos de POST /libros y PUT /libros/{id} (parte `datos` del multipart; la portada va aparte). */
export interface LibroRequest {
  titulo: string;
  autor: string;
  editorial: string;
  materia: string;
  clasificacionDewey: string;
  isbn: string | null;
}
