import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ValorSelect } from '../../shared/components/select/select';
import { ErrorRespuesta } from '../../shared/models/error-respuesta';
import { CarreraResponse } from '../estructura/models/carrera-response';
import { gestionValida } from './data-access/tesis';
import { TesisRequest } from './models/tesis-request';
import { TesisResponse } from './models/tesis-response';

const MENSAJE_GESTION = 'La gestión debe tener 4 dígitos y no ser posterior al año actual.';

function texto(largo: number, obligatorio = true) {
  const validadores = [Validators.maxLength(largo)];
  if (obligatorio) validadores.push(Validators.required);
  return new FormControl('', { nonNullable: true, validators: validadores });
}

function validarGestion(control: AbstractControl<string>): ValidationErrors | null {
  const valor = control.value.trim();
  if (!valor) return null;
  return /^\d{4}$/.test(valor) && gestionValida(Number(valor)) ? null : { gestion: true };
}

/**
 * Formulario de P10.1 y P10.4: título, autor, tutor, carrera, gestión y número de inventario obligatorios;
 * palabras clave opcionales; largos de docs/modelo-datos.md (tabla tesis). `idFacultad` no se envía: solo
 * filtra las carreras (docs/contrato-api.md, sección 11).
 */
export function crearFormularioTesis() {
  return new FormGroup({
    titulo: texto(250),
    autor: texto(150),
    tutor: texto(150),
    idCarrera: new FormControl<ValorSelect>(null, { validators: [Validators.required] }),
    idFacultad: new FormControl<ValorSelect>(null),
    gestion: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, validarGestion],
    }),
    numeroInventario: texto(30),
    palabrasClave: texto(250, false),
  });
}

export type FormularioTesis = ReturnType<typeof crearFormularioTesis>;
export type CampoFormularioTesis = keyof FormularioTesis['controls'];

/**
 * Cascada de P10.1 y P10.4 (decisión del estudiante): la facultad filtra las carreras; elegir una carrera
 * completa su facultad; cambiar a una facultad a la que no pertenece la carrera elegida la vacía.
 */
export function conectarCarreraFacultad(
  formulario: FormularioTesis,
  carreras: () => readonly CarreraResponse[],
  destroyRef: DestroyRef,
): void {
  const { idCarrera, idFacultad } = formulario.controls;
  idCarrera.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe((id) => {
    const carrera = carreras().find((c) => c.idCarrera === id);
    if (carrera && idFacultad.value !== carrera.idFacultad) {
      idFacultad.setValue(carrera.idFacultad);
    }
  });
  idFacultad.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe((id) => {
    const carrera = carreras().find((c) => c.idCarrera === idCarrera.value);
    if (id !== null && carrera && carrera.idFacultad !== id) idCarrera.setValue(null);
  });
}

export function llenarFormulario(formulario: FormularioTesis, tesis: TesisResponse): void {
  formulario.setValue({
    titulo: tesis.titulo,
    autor: tesis.autor,
    tutor: tesis.tutor,
    idCarrera: tesis.idCarrera,
    idFacultad: tesis.idFacultad,
    gestion: String(tesis.gestion),
    numeroInventario: tesis.numeroInventario,
    palabrasClave: tesis.palabrasClave ?? '',
  });
}

export function aSolicitud(formulario: FormularioTesis): TesisRequest {
  const v = formulario.getRawValue();
  return {
    titulo: v.titulo.trim(),
    autor: v.autor.trim(),
    tutor: v.tutor.trim(),
    gestion: Number(v.gestion.trim()),
    numeroInventario: v.numeroInventario.trim(),
    palabrasClave: v.palabrasClave.trim() || null,
    idCarrera: v.idCarrera as number,
  };
}

/**
 * Mensaje junto a un campo: la validación del formulario si el campo tocado es inválido o, si no, el de
 * `errores[]` que devolvió el servicio.
 */
export function errorCampo(
  formulario: FormularioTesis,
  campo: CampoFormularioTesis,
  error: ErrorRespuesta | null,
): string | null {
  const control = formulario.controls[campo];
  if (control.touched && control.invalid && control.enabled) {
    if (control.hasError('required')) return 'Es obligatorio.';
    if (control.hasError('maxlength')) {
      return `Máximo ${control.getError('maxlength').requiredLength} caracteres.`;
    }
    return MENSAJE_GESTION;
  }
  return error?.errores.find((e) => e.campo === campo)?.mensaje ?? null;
}
