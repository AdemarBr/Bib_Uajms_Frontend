import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, of, switchMap, tap } from 'rxjs';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Interruptor } from '../../../../shared/components/interruptor/interruptor';
import { OpcionSelect, Select, ValorSelect } from '../../../../shared/components/select/select';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { ErrorCampoPipe } from '../../../../shared/pipes/error-campo-pipe';
import { Bibliotecas } from '../../data-access/bibliotecas';
import { Carreras } from '../../data-access/carreras';
import { Facultades } from '../../data-access/facultades';
import { BibliotecaResponse } from '../../models/biblioteca-response';
import { CarreraResponse } from '../../models/carrera-response';
import { TODA_LA_FACULTAD, aPertenencia, opcionesCarrera } from '../../pertenencia-biblioteca';

/**
 * Cómo se tratan Facultad, Carrera y Estado según la biblioteca elegida:
 * - `central`: Facultad y Carrera «No aplica — Biblioteca Central» y estado activo fijo (RF3.7.5);
 * - `sinPertenencia` (Postgrado): Facultad y Carrera «No aplica», estado editable;
 * - `normal`: desplegables en cascada como en P3.4.
 */
type Modo = 'ninguna' | 'central' | 'sinPertenencia' | 'normal';

/** P3.5 Actualizar biblioteca física (RF3.7). Campos deshabilitados y vacíos hasta elegir la biblioteca. */
@Component({
  imports: [ReactiveFormsModule, Select, Interruptor, Alerta, ErrorCampoPipe],
  selector: 'app-actualizar-biblioteca',
  styleUrl: './actualizar-biblioteca.css',
  templateUrl: './actualizar-biblioteca.html',
})
export class ActualizarBiblioteca {
  private readonly bibliotecasServicio = inject(Bibliotecas);
  private readonly carrerasServicio = inject(Carreras);
  private readonly router = inject(Router);

  private readonly bibliotecas = toSignal(this.bibliotecasServicio.listarBibliotecas(), {
    initialValue: [],
  });
  /** Todas las carreras, para conocer la facultad de una biblioteca de carrera. */
  private readonly todasLasCarreras = toSignal(this.carrerasServicio.listarCarreras(), {
    initialValue: [],
  });

  protected readonly opcionesBiblioteca = computed(() =>
    this.bibliotecas().map((b) => ({ valor: b.idBiblioteca, etiqueta: b.nombre })),
  );
  protected readonly opcionesFacultad = toSignal(
    inject(Facultades)
      .listarFacultades()
      .pipe(map((lista) => lista.map((f) => ({ valor: f.idFacultad, etiqueta: f.nombre })))),
    { initialValue: [] },
  );
  protected readonly opcionesCarrera = signal<OpcionSelect[]>([]);

  protected readonly formulario = new FormGroup({
    idBiblioteca: new FormControl<ValorSelect>(null),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    ubicacion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descripcion: new FormControl('', { nonNullable: true }),
    idFacultad: new FormControl<ValorSelect>(null, { validators: [Validators.required] }),
    carrera: new FormControl<ValorSelect>(null, { validators: [Validators.required] }),
    estado: new FormControl(true, { nonNullable: true }),
  });

  protected readonly modo = signal<Modo>('ninguna');
  protected readonly estado = toSignal(this.formulario.controls.estado.valueChanges, {
    initialValue: true,
  });
  protected readonly carreraHabilitada = signal(false);
  protected readonly enviando = signal(false);
  /** Error del servicio (p. ej. 409 de registro duplicado): se muestran su título, detalle y errores por campo. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  /** Texto de Facultad y Carrera cuando no aplican (RF3.7.5 y decisión para Postgrado). */
  protected readonly textoNoAplica = computed(() => {
    switch (this.modo()) {
      case 'central':
        return 'No aplica — Biblioteca Central';
      case 'sinPertenencia':
        return 'No aplica';
      default:
        return null;
    }
  });

  constructor() {
    this.limpiar();
    const c = this.formulario.controls;
    c.idBiblioteca.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((id) => this.cargar(this.bibliotecas().find((b) => b.idBiblioteca === id)));

    // RF3.7, paso 6: el mismo comportamiento en cascada del registro.
    c.idFacultad.valueChanges
      .pipe(
        tap(() => {
          c.carrera.reset(null);
          c.carrera.disable();
          this.carreraHabilitada.set(false);
        }),
        switchMap((id) => this.cargarCarreras(id)),
        takeUntilDestroyed(),
      )
      .subscribe((carreras) => this.mostrarCarreras(carreras));
  }

  protected campoVacio(campo: 'nombre' | 'ubicacion' | 'idFacultad' | 'carrera'): boolean {
    const control = this.formulario.controls[campo];
    return control.enabled && control.touched && control.invalid;
  }

  protected cambiarEstado(activo: boolean): void {
    this.formulario.controls.estado.setValue(activo);
  }

  protected guardar(): void {
    const modo = this.modo();
    if (modo === 'ninguna' || this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const v = this.formulario.getRawValue();
    const pertenencia =
      modo === 'normal'
        ? aPertenencia(v.idFacultad, v.carrera)
        : { idFacultad: null, idCarrera: null };
    this.enviando.set(true);
    this.error.set(null);
    this.bibliotecasServicio
      .actualizarBiblioteca(v.idBiblioteca as number, {
        nombre: v.nombre,
        ubicacion: v.ubicacion,
        descripcion: v.descripcion || null,
        ...pertenencia,
        ...(modo === 'central' ? {} : { estado: v.estado }),
      })
      .subscribe({
        next: () =>
          this.router.navigate(['/estructura'], { queryParams: { pestana: 'bibliotecas' } }),
        error: (error: unknown) => {
          this.enviando.set(false);
          this.error.set(comoErrorRespuesta(error));
        },
      });
  }

  /** Precarga la biblioteca elegida (RF3.7, paso 2). */
  private cargar(biblioteca: BibliotecaResponse | undefined): void {
    if (!biblioteca) return this.limpiar();
    const c = this.formulario.controls;
    this.error.set(null);
    c.nombre.reset(biblioteca.nombre);
    c.ubicacion.reset(biblioteca.ubicacion);
    c.descripcion.reset(biblioteca.descripcion ?? '');
    c.estado.setValue(biblioteca.estado);
    c.nombre.enable();
    c.ubicacion.enable();
    c.descripcion.enable();

    const sinPertenencia = biblioteca.idFacultad === null && biblioteca.idCarrera === null;
    if (biblioteca.esBibliotecaCentral || sinPertenencia) {
      this.modo.set(biblioteca.esBibliotecaCentral ? 'central' : 'sinPertenencia');
      c.idFacultad.reset(null, { emitEvent: false });
      c.carrera.reset(null);
      c.idFacultad.disable({ emitEvent: false });
      c.carrera.disable();
      this.carreraHabilitada.set(false);
      if (biblioteca.esBibliotecaCentral) {
        c.estado.setValue(true);
        c.estado.disable();
      } else {
        c.estado.enable();
      }
      return;
    }

    this.modo.set('normal');
    c.estado.enable();
    const idFacultad =
      biblioteca.idFacultad ??
      this.todasLasCarreras().find((x) => x.idCarrera === biblioteca.idCarrera)?.idFacultad ??
      null;
    c.idFacultad.enable({ emitEvent: false });
    c.idFacultad.reset(idFacultad, { emitEvent: false });
    this.cargarCarreras(idFacultad).subscribe((carreras) => {
      this.mostrarCarreras(carreras);
      c.carrera.reset(biblioteca.idCarrera ?? TODA_LA_FACULTAD);
    });
  }

  private cargarCarreras(idFacultad: ValorSelect): Observable<CarreraResponse[] | null> {
    return idFacultad === null
      ? of(null)
      : this.carrerasServicio.listarCarreras(idFacultad as number);
  }

  private mostrarCarreras(carreras: CarreraResponse[] | null): void {
    if (carreras === null) return;
    this.opcionesCarrera.set(opcionesCarrera(carreras));
    this.formulario.controls.carrera.enable();
    this.carreraHabilitada.set(true);
  }

  /** Sin biblioteca elegida: campos vacíos y deshabilitados. */
  private limpiar(): void {
    const c = this.formulario.controls;
    this.modo.set('ninguna');
    this.error.set(null);
    this.carreraHabilitada.set(false);
    c.nombre.reset('');
    c.ubicacion.reset('');
    c.descripcion.reset('');
    c.idFacultad.reset(null, { emitEvent: false });
    c.carrera.reset(null);
    c.estado.setValue(true);
    for (const control of [c.nombre, c.ubicacion, c.descripcion, c.carrera, c.estado]) {
      control.disable();
    }
    c.idFacultad.disable({ emitEvent: false });
  }
}
