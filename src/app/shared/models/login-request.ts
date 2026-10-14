/** POST /auth/login (docs/contrato-api.md, sección 3). Los académicos usan su RU como nombreUsuario. */
export interface LoginRequest {
  nombreUsuario: string;
  contrasena: string;
}
