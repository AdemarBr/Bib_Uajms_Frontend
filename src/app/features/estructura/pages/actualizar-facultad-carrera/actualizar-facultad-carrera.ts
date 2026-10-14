import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Sesion } from '../../../../core/auth/sesion';
import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Interruptor } from '../../../../shared/components/interruptor/interruptor';
import { Select, ValorSelect } from '../../../../shared/components/select/select';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { ErrorCampoPipe } from '../../../../shared/pipes/error-campo-pipe';
import { Carreras } from '../../data-access/carreras';
import { Facultades } from '../../data-access/facultades';

type TipoRegistro = 'facultad' | 'carrera';

/**
 * P3.3 Actualizar facultad o carrera (RF3.3 y RF3.5). Los campos quedan deshabilitados y vacíos hasta
 * elegir el registro; las carreras relacionadas de una facultad son de solo lectura.
 */
@Component({
  imports: [ReactiveFormsModule, Select, Interruptor, Alerta, ErrorCampoPipe],
  selector: 'app-actualizar-facultad-carrera',
  styleUrl: './actualizar-facultad-carrera.css',
  templateUrl: './actualizar-facultad-carrera.html',
})
export class ActualizarFacultadCarrera {
  private readonly facultadesServicio = inject(Facultades);
  private readonly carrerasServicio = inject(Carreras);
  private readonly router = inject(Router);
  private readonly sesion = inject(Sesion);

  protected readonly puedeFacultad = this.sesion.tienePermiso(PERMISOS.FACULTAD_ACTUALIZAR);
  protected readonly puedeCarrera = this.sesion.tienePermiso(PERMISOS.CARRERA_ACTUALIZAR);

  private readonly facultades = toSignal(this.facultadesServicio.listarFacultades(), {
    initialValue: [],
  });
  private readonly carreras = toSignal(this.carrerasServicio.listarCarreras(), {
    initialValue: [],
  });

  protected readonly formulario = new FormGroup({
    tipo: new FormControl<TipoRegistro>(this.puedeFacultad ? 'facultad' : 'carrera', {
      nonNullable: true,
    }),
    seleccion: new FormControl<ValorSelect>(null),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    idFacultad: new FormControl<ValorSelect>(null, { validators: [Validators.required] }),
    estado: new FormControl(true, { nonNullable: true }),
  });

  protected readonly tipo = toSignal(this.formulario.controls.tipo.valueChanges, {
    initialValue: this.formulario.controls.tipo.value,
  });
  private readonly seleccion = toSignal(this.formulario.controls.seleccion.valueChanges, {
    initialValue: null,
  });
  protected readonly estado = toSignal(this.formulario.controls.estado.valueChanges, {
    initialValue: true,
  });

  protected readonly opcionesFacultad = computed(() =>
    this.facultades().map((f) => ({ valor: f.idFacultad, etiqueta: f.nombre })),
  );
  protected readonly opcionesSeleccion = computed(() =>
    this.tipo() === 'facultad'
      ? this.opcionesFacultad()
      : this.carreras().map((c) => ({ valor: c.idCarrera, etiqueta: c.nombre })),
  );
  protected readonly elegido = computed(() => this.seleccion() !== null);
  /** RF3.3.3: carreras relacionadas de la facultad elegida (solo lectura). */
  protected readonly carrerasRelacionadas = computed(() => {
    const facultad = this.facultades().find((f) => f.idFacultad === this.seleccion());
    if (!facultad) return '';
    return facultad.carreras.length > 0 ? facultad.carreras.join(', ') : '—';
  });

  protected readonly enviando = signal(false);
  /** Error del servicio (p. ej. 409 de registro duplicado): se muestran su título, detalle y errores por campo. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  constructor() {
    this.limpiar();
    const c = this.formulario.controls;
    c.tipo.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      c.seleccion.setValue(null, { emitEvent: false });
      this.limpiar();
    });
    c.seleccion.valueChanges.pipe(takeUntilDestroyed()).subscribe((id) => this.cargar(id));
  }

  protected campoVacio(campo: 'nombre' | 'idFacultad'): boolean {
    const control = this.formulario.controls[campo];
    return control.enabled && control.touched && control.invalid;
  }

  protected cambiarEstado(activo: boolean): void {
    this.formulario.controls.estado.setValue(activo);
  }

  /** El curso alternativo conserva los datos anteriores: no se aplica nada si hay errores o duplicado. */
  protected guardar(): void {
    if (!this.elegido() || this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { tipo, seleccion, nombre, idFacultad, estado } = this.formulario.getRawValue();
    const id = seleccion as number;
    const solicitud: Observable<unknown> =
      tipo === 'facultad'
        ? this.facultadesServicio.actualizarFacultad(id, { nombre, estado })
        : this.carrerasServicio.actualizarCarrera(id, {
            nombre,
            idFacultad: idFacultad as number,
            estado,
          });

    this.enviando.set(true);
    this.error.set(null);
    solicitud.subscribe({
      next: () =>
        this.router.navigate(['/estructura'], {
          queryParams: { pestana: tipo === 'facultad' ? 'facultades' : 'carreras' },
        }),
      error: (error: unknown) => {
        this.enviando.set(false);
        this.error.set(comoErrorRespuesta(error));
      },
    });
  }

  /** Precarga el registro elegido (RF3.3, paso 4, y RF3.5, paso 4). */
  private cargar(id: ValorSelect): void {
    this.error.set(null);
    const c = this.formulario.controls;
    if (c.tipo.value === 'facultad') {
      const facultad = this.facultades().find((f) => f.idFacultad === id);
      if (!facultad) return this.limpiar();
      c.nombre.reset(facultad.nombre);
      c.estado.setValue(facultad.estado);
      c.nombre.enable();
      c.estado.enable();
    } else {
      const carrera = this.carreras().find((x) => x.idCarrera === id);
      if (!carrera) return this.limpiar();
      c.nombre.reset(carrera.nombre);
      c.idFacultad.reset(carrera.idFacultad);
      c.estado.setValue(carrera.estado);
      c.nombre.enable();
      c.idFacultad.enable();
      c.estado.enable();
    }
  }

  /** Sin registro elegido: campos vacíos y deshabilitados. */
  private limpiar(): void {
    const c = this.formulario.controls;
    this.error.set(null);
    c.nombre.reset('');
    c.idFacultad.reset(null);
    c.estado.setValue(true);
    c.nombre.disable();
    c.idFacultad.disable();
    c.estado.disable();
  }
}
