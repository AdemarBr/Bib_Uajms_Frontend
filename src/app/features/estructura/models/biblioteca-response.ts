/** Biblioteca física (GET /bibliotecas, docs/contrato-api.md, sección 5). */
export interface BibliotecaResponse {
  idBiblioteca: number;
  nombre: string;
  ubicacion: string;
  descripcion: string | null;
  estado: boolean;
  idFacultad: number | null;
  facultadNombre: string | null;
  idCarrera: number | null;
  carreraNombre: string | null;
  /** (calculado) Con `true`, P3.5 deshabilita Facultad y Carrera (RF3.7.5). */
  esBibliotecaCentral: boolean;
}
