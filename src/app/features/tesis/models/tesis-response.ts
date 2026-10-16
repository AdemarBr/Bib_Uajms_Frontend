/** Tesis de P10.3, P10.4 y del encabezado de P10.2 y P10.5 (docs/contrato-api.md, sección 11). */
export interface TesisResponse {
  idTesis: number;
  titulo: string;
  autor: string;
  tutor: string;
  gestion: number;
  numeroInventario: string;
  palabrasClave: string | null;
  estado: boolean;
  idCarrera: number;
  carreraNombre: string;
  /** La facultad se obtiene de la carrera; no se guarda en la tesis. */
  idFacultad: number;
  facultadNombre: string;
}
