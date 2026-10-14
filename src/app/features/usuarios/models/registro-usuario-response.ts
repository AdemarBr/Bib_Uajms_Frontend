/** Respuesta de POST /usuarios: la contraseña generada se muestra una sola vez (RF2.1.6). */
export interface RegistroUsuarioResponse {
  usuario: { idUsuario: number; nombreUsuario: string };
  contrasenaGenerada: string;
}
