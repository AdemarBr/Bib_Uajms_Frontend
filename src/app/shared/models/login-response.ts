/** Respuesta de POST /auth/login y POST /auth/refresh (docs/contrato-api.md, sección 3). */
export interface LoginResponse {
  token: string;
  /** Segundos de vida del token de acceso. */
  expiraEn: number;
  usuario: UsuarioSesion;
  rol: string;
  tipoUsuario: TipoUsuario;
  permisos: string[];
}

export interface UsuarioSesion {
  idUsuario: number;
  nombre: string;
  nombreUsuario: string;
  idBiblioteca: number | null;
  bibliotecaNombre: string | null;
  idCarrera: number | null;
  carreraNombre: string | null;
}

/** Valores de la tabla tipo_usuario (docs/modelo-datos.md). */
export type TipoUsuario = 'académico' | 'interno';
