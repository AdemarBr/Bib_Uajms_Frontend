/** Plazo máximo del préstamo a domicilio al registrarlo (docs/reglas-negocio.md, «Préstamos y plazos»). */
export const PLAZO_MAXIMO_PRESTAMO_DIAS = 30;

/** Días que suma cada ampliación a max(fecha límite vigente, hoy) (RF9.2.8; docs/contrato-api.md, sección 10). */
export const DIAS_AMPLIACION_PRESTAMO = 7;

/**
 * Roles internos que exigen biblioteca responsable (RF2.5, decisión del estudiante). Para los demás
 * roles internos (Administrador general y Responsable de tesis y solvencias) el campo queda sin asignar.
 */
export const ROLES_CON_BIBLIOTECA: readonly string[] = [
  'Bibliotecario',
  'Catalogador',
  'Administrador de biblioteca',
];
