/** Cuerpo de POST /usuarios (P2.1) y PUT /usuarios/{id} (P2.3). El usuario y la contraseña los genera el sistema (RF2.1). */
export interface UsuarioInternoRequest {
  nombre: string;
  correo: string | null;
  idRol: number;
  idBiblioteca: number | null;
}
