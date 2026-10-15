import { AbstractControl, Validators } from '@angular/forms';

import { ErrorRespuesta } from '../../shared/models/error-respuesta';

/** Largos máximos de docs/modelo-datos.md (tabla ejemplar). */
export const VALIDADORES_CODIGO = [Validators.required, Validators.maxLength(30)];
export const VALIDADORES_UBICACION = [Validators.maxLength(100)];

/**
 * Mensaje junto a un campo de P5.1 o P5.3: la validación del formulario si el campo tocado es inválido
 * («Es obligatorio.» o el largo máximo) o, si no, el de `errores[]` que devolvió el servicio.
 */
export function mensajeCampo(
  control: AbstractControl,
  campo: string,
  error: ErrorRespuesta | null,
): string | null {
  if (control.touched && control.invalid && control.enabled) {
    return control.hasError('maxlength')
      ? `Máximo ${control.getError('maxlength').requiredLength} caracteres.`
      : 'Es obligatorio.';
  }
  return error?.errores.find((e) => e.campo === campo)?.mensaje ?? null;
}
