/** Facultad de la pestaña Facultades de P3.1: Nombre, Carreras, Biblioteca y Estado (RF3.1.7). */
export interface FacultadResponse {
  idFacultad: number;
  nombre: string;
  estado: boolean;
  carreras: string[];
  bibliotecas: string[];
}
