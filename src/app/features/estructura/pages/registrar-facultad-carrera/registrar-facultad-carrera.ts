import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

import { Sesion } from '../../../../core/auth/sesion';
import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Select, ValorSelect } from '../../../../shared/components/select/select';
import { ErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Carreras } from '../../data-access/carreras';
import { Facultades } from '../../data-access/facultades';

type TipoRegistro = 'facultad' | 'carrera';

/** P3.2 Registrar facultad o carrera (RF3.2 y RF3.4), con el selector «Tipo de registro». */
@Component({
  imports: [ReactiveFormsModule, Select, Alerta],
  selector: 'app-registrar-facultad-carrera',
  styleUrl: './registrar-facultad-carrera.css',
  templateUrl: './registrar-facultad-carrera.html',
})
export class RegistrarFacultadCarrera {
  private readonly facultades = inject(Facultades);
  private readonly carreras = inject(Carreras);
  private readonly router = inject(Router);
  private readonly sesion = inject(Sesion);

  /** Cada tipo se ofrece solo con su permiso (en la ruta basta uno de los dos). */
  protected readonly puedeFacultad = this.sesion.tienePermiso(PERMISOS.FACULTAD_REGISTRAR);
  protected readonly puedeCarrera = this.sesion.tienePermiso(PERMISOS.CARRERA_REGISTRAR);

  protected readonly opcionesFacultad = toSignal(
    this.facultades
      .listarFacultades()
      .pipe(map((lista) => lista.map((f) => ({ valor: f.idFacultad, etiqueta: f.nombre })))),
    { initialValue: [] },
  );

  protected readonly formulario = new FormGroup({
    tipo: new FormControl<TipoRegistro>(this.puedeFacultad ? 'facultad' : 'carrera', {
      nonNullable: true,
    }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    idFacultad: new FormControl<ValorSelect>(null, { validators: [Validators.required] }),
  });

  protected readonly tipo = toSignal(this.formulario.controls.tipo.valueChanges, {
    initialValue: this.formulario.controls.tipo.value,
  });
  protected readonly enviando = signal(false);
  /** Texto del curso alternativo (registro duplicado). */
  protected readonly duplicado = signal<string | null>(null);

  constructor() {
    this.ajustarFacultad(this.formulario.controls.tipo.value);
    this.formulario.controls.tipo.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((tipo) => this.ajustarFacultad(tipo));
  }

  protected campoVacio(campo: 'nombre' | 'idFacultad'): boolean {
    const control = this.formulario.controls[campo];
    return control.enabled && control.touched && control.invalid;
  }

  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { tipo, nombre, idFacultad } = this.formulario.getRawValue();
    const solicitud: Observable<unknown> =
      tipo === 'facultad'
        ? this.facultades.registrarFacultad({ nombre })
        : this.carreras.registrarCarrera({ nombre, idFacultad: idFacultad as number });

    this.enviando.set(true);
    this.duplicado.set(null);
    solicitud.subscribe({
      next: () =>
        this.router.navigate(['/estructura'], {
          queryParams: { pestana: tipo === 'facultad' ? 'facultades' : 'carreras' },
        }),
      error: (error: ErrorRespuesta) => {
        this.enviando.set(false);
        if (error.status === 409) this.duplicado.set(error.detalle);
      },
    });
  }

  /** RF3.2.4: con «Facultad», el desplegable queda deshabilitado con «No aplica para Facultad». */
  private ajustarFacultad(tipo: TipoRegistro): void {
    const control = this.formulario.controls.idFacultad;
    this.duplicado.set(null);
    if (tipo === 'facultad') {
      control.setValue(null);
      control.disable();
    } else {
      control.enable();
    }
  }
}
