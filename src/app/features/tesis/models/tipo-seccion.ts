/** Secciones de `documento_tesis.tipo_seccion` en el orden de RF10.2.3. */
export const TIPOS_SECCION = [
  'Preliminares',
  'Resumen',
  'Marco Teórico',
  'Bibliografía',
  'Anexos',
] as const;

export type TipoSeccion = (typeof TIPOS_SECCION)[number];
