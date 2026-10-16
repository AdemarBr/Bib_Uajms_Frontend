/**
 * POST /tesis (P10.1) y PUT /tesis/{id} (P10.4). Sin estado: se cambia con PATCH /tesis/{id}/estado.
 * En PUT el número de inventario se conserva (RF10.4).
 */
export interface TesisRequest {
  titulo: string;
  autor: string;
  tutor: string;
  gestion: number;
  numeroInventario: string;
  palabrasClave: string | null;
  idCarrera: number;
}
