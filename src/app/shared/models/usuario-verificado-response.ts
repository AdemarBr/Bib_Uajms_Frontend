/** Respuesta de POST /usuarios/validar-ru (docs/contrato-api.md, sección 4; RF1.2.7). */
export interface UsuarioVerificadoResponse {
  idUsuario: number;
  nombre: string;
  ru: string;
  carreraNombre: string | null;
  rolNombre: string;
  /** true si el sistema registró sus datos mínimos en esta validación. */
  registradoAhora: boolean;
}
