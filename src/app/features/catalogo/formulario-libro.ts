import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ErrorRespuesta } from '../../shared/models/error-respuesta';
import { LibroRequest } from './models/libro-request';
import { LibroResponse } from './models/libro-response';

/** Tres dígitos y decimales opcionales: «005.1», «346», «515». */
const FORMATO_DEWEY = /^\d{3}(\.\d+)?$/;

function texto(largo: number, obligatorio = true) {
  const validadores = [Validators.maxLength(largo)];
  if (obligatorio) validadores.push(Validators.required);
  return new FormControl('', { nonNullable: true, validators: validadores });
}

/**
 * Formulario de P4.1 y P4.4: todos los campos obligatorios salvo el ISBN (Figma) y largos máximos de
 * docs/modelo-datos.md. La portada no es un control: se elige aparte con «Subir imagen».
 */
export function crearFormularioLibro() {
  const formulario = new FormGroup({
    titulo: texto(250),
    autor: texto(200),
    editorial: texto(120),
    materia: texto(100),
    clasificacionDewey: texto(30),
    isbn: texto(20, false),
  });
  formulario.controls.clasificacionDewey.addValidators(Validators.pattern(FORMATO_DEWEY));
  return formulario;
}

export type FormularioLibro = ReturnType<typeof crearFormularioLibro>;
export type CampoFormularioLibro = keyof FormularioLibro['controls'];

export function llenarFormulario(formulario: FormularioLibro, libro: LibroResponse): void {
  formulario.setValue({
    titulo: libro.titulo,
    autor: libro.autor,
    editorial: libro.editorial ?? '',
    materia: libro.materia,
    clasificacionDewey: libro.clasificacionDewey ?? '',
    isbn: libro.isbn ?? '',
  });
}

export function aSolicitud(formulario: FormularioLibro): LibroRequest {
  const v = formulario.getRawValue();
  return {
    titulo: v.titulo.trim(),
    autor: v.autor.trim(),
    editorial: v.editorial.trim(),
    materia: v.materia.trim(),
    clasificacionDewey: v.clasificacionDewey.trim(),
    isbn: v.isbn.trim() || null,
  };
}

/**
 * Mensaje junto a un campo: la validación del formulario si el campo tocado es inválido o, si no,
 * el de `errores[]` que devolvió el servicio.
 */
export function errorCampo(
  formulario: FormularioLibro,
  campo: CampoFormularioLibro,
  error: ErrorRespuesta | null,
): string | null {
  const control = formulario.controls[campo];
  if (control.touched && control.invalid) {
    if (control.hasError('required')) return 'Es obligatorio.';
    if (control.hasError('maxlength')) {
      return `Máximo ${control.getError('maxlength').requiredLength} caracteres.`;
    }
    return 'No es una clasificación Dewey válida.';
  }
  return error?.errores.find((e) => e.campo === campo)?.mensaje ?? null;
}

/** El archivo elegido con «Subir imagen» debe ser una imagen (validación de formato del frontend). */
export function esImagen(archivo: File): boolean {
  return archivo.type.startsWith('image/');
}
