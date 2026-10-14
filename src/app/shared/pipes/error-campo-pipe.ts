import { Pipe, PipeTransform } from '@angular/core';

import { ErrorRespuesta } from '../models/error-respuesta';

/** Mensaje de `errores[]` para un campo, para mostrarlo junto a él: `error() | errorCampo: 'nombre'`. */
@Pipe({
  name: 'errorCampo',
})
export class ErrorCampoPipe implements PipeTransform {
  transform(error: ErrorRespuesta | null, campo: string): string | null {
    return error?.errores.find((e) => e.campo === campo)?.mensaje ?? null;
  }
}
