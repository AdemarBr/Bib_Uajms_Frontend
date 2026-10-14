/** Plazo máximo del préstamo a domicilio al registrarlo (docs/reglas-negocio.md, «Préstamos y plazos»). */
export const PLAZO_MAXIMO_PRESTAMO_DIAS = 30;

/**
 * Roles internos que exigen biblioteca responsable (RF2.5, decisión del estudiante). Para los demás
 * roles internos (Administrador general y Responsable de tesis y solvencias) el campo queda sin asignar.
 */
export const ROLES_CON_BIBLIOTECA: readonly string[] = [
  'Bibliotecario',
  'Catalogador',
  'Administrador de biblioteca',
];
