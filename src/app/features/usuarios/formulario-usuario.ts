import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ROLES_CON_BIBLIOTECA } from '../../core/config/constantes';
import { modulosDePermisos } from '../../core/config/permisos';
import { ValorSelect } from '../../shared/components/select/select';
import { ErrorRespuesta } from '../../shared/models/error-respuesta';
import { RolResponse } from './models/rol-response';
import { UsuarioInternoRequest } from './models/usuario-interno-request';

/** Formulario de usuario interno de P2.1 y P2.3 (nombre, correo, rol y biblioteca responsable). */
export function crearFormularioUsuario() {
  return new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    correo: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    idRol: new FormControl<ValorSelect>(null, { validators: [Validators.required] }),
    idBiblioteca: new FormControl<ValorSelect>(null, { validators: [Validators.required] }),
  });
}

export type FormularioUsuario = ReturnType<typeof crearFormularioUsuario>;

/**
 * RF2.5 (curso alternativo): si el rol elegido no requiere biblioteca, el campo queda sin asignar y
 * deshabilitado («No aplica»). Devuelve si el campo quedó en «No aplica».
 */
export function ajustarBiblioteca(
  formulario: FormularioUsuario,
  rol: RolResponse | undefined,
  puedeAsignar = true,
): boolean {
  const control = formulario.controls.idBiblioteca;
  const noAplica = !!rol && !ROLES_CON_BIBLIOTECA.includes(rol.nombre);
  if (noAplica) {
    control.setValue(null);
    control.disable();
  } else if (puedeAsignar) {
    control.enable();
  } else {
    control.disable();
  }
  return noAplica;
}

export function aSolicitud(formulario: FormularioUsuario): UsuarioInternoRequest {
  const v = formulario.getRawValue();
  return {
    nombre: v.nombre.trim(),
    correo: v.correo.trim() || null,
    idRol: v.idRol as number,
    idBiblioteca: (v.idBiblioteca as number | null) ?? null,
  };
}

/**
 * Mensaje junto a un campo: la validación del formulario si el campo tocado es inválido
 * («Es obligatorio.» o el del correo) o, si no, el de `errores[]` que devolvió el servicio.
 */
export function errorCampo(
  formulario: FormularioUsuario,
  campo: keyof FormularioUsuario['controls'],
  error: ErrorRespuesta | null,
): string | null {
  const control = formulario.controls[campo];
  if (control.touched && control.invalid && control.enabled) {
    return control.hasError('email') ? 'No es un correo válido.' : 'Es obligatorio.';
  }
  return error?.errores.find((e) => e.campo === campo)?.mensaje ?? null;
}

/** RF2.4.4: «Permisos del rol: módulo, módulo y módulo.» a partir de los módulos de la matriz. */
export function descripcionPermisos(rol: RolResponse | undefined): string | null {
  if (!rol) return null;
  const modulos = modulosDePermisos(rol.permisos.map((p) => p.codigo)).map((m) => m.toLowerCase());
  if (modulos.length === 0) return null;
  const lista =
    modulos.length === 1 ? modulos[0] : `${modulos.slice(0, -1).join(', ')} y ${modulos.at(-1)}`;
  return `Permisos del rol: ${lista}.`;
}
