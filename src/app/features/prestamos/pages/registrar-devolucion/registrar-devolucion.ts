import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, debounceTime, map, of, switchMap } from 'rxjs';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { BadgeEstado } from '../../../../shared/components/badge-estado/badge-estado';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { ErrorCampoPipe } from '../../../../shared/pipes/error-campo-pipe';
import { FechaPipe } from '../../../../shared/pipes/fecha-pipe';
import { hoy } from '../../../catalogo/data-access/datos-catalogo';
import { Devoluciones } from '../../data-access/devoluciones';
import { Prestamos } from '../../data-access/prestamos';
import { diasEntre } from '../../fechas-prestamo';
import { ESTADOS_DEVOLUCION, EstadoDevolucion } from '../../models/estado-devolucion';
import { PrestamoResponse } from '../../models/prestamo-response';

const MAXIMO_COINCIDENCIAS = 8;
const LARGO_OBSERVACIONES = 500;

/**
 * P9.5 Registrar devolución de libro (RF9.3, RF9.3.2, RF9.3.3 y RF9.3.4; Figma 22:2200): búsqueda del préstamo
 * vigente por código de ejemplar, usuario o número de préstamo; estado del ejemplar devuelto; «Observaciones»,
 * habilitado y obligatorio si el estado no es «Buen estado»; control de retraso (solo a domicilio).
 */
@Component({
  imports: [ReactiveFormsModule, Alerta, BadgeEstado, ErrorCampoPipe, FechaPipe],
  selector: 'app-registrar-devolucion',
  styleUrl: './registrar-devolucion.css',
  templateUrl: './registrar-devolucion.html',
})
export class RegistrarDevolucion {
  private readonly prestamos = inject(Prestamos);
  private readonly devoluciones = inject(Devoluciones);

  protected readonly estados = ESTADOS_DEVOLUCION;

  protected readonly busqueda = new FormControl('', { nonNullable: true });
  /** Préstamos vigentes coincidentes (RF9.3.2.4); null sin texto o con un préstamo elegido. */
  protected readonly coincidencias = signal<PrestamoResponse[] | null>(null);
  protected readonly prestamo = signal<PrestamoResponse | null>(null);

  protected readonly formulario = new FormGroup({
    estadoEjemplar: new FormControl<EstadoDevolucion>('Buen estado', { nonNullable: true }),
    observaciones: new FormControl(
      { value: '', disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(LARGO_OBSERVACIONES)],
      },
    ),
  });

  /** RF9.3.3: días de retraso a la fecha de hoy (solo préstamos a domicilio). */
  protected readonly diasRetraso = computed(() => {
    const p = this.prestamo();
    if (!p?.fechaLimiteDevolucion) return null;
    return Math.max(0, diasEntre(p.fechaLimiteDevolucion, hoy()));
  });

  protected readonly enviando = signal(false);
  protected readonly error = signal<ErrorRespuesta | null>(null);
  /** Alerta de éxito con el nuevo estado del ejemplar (RF9.3.4.4). */
  protected readonly exito = signal<{ titulo: string; mensaje: string } | null>(null);

  constructor() {
    this.busqueda.valueChanges
      .pipe(
        debounceTime(250),
        switchMap((texto) => {
          const q = texto.trim();
          if (!q || this.prestamo() !== null) return of(null);
          return this.prestamos
            .listarPrestamos({ estado: 'activo', q, tamanio: MAXIMO_COINCIDENCIAS })
            .pipe(
              map((pagina) => pagina.contenido),
              catchError((error: unknown) => {
                this.error.set(comoErrorRespuesta(error));
                return of(null);
              }),
            );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((lista) => this.coincidencias.set(lista));

    // RF9.3, paso 6: «Observaciones» se habilita cuando el estado no es «Buen estado».
    this.formulario.controls.estadoEjemplar.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((estado) => {
        const observaciones = this.formulario.controls.observaciones;
        if (estado === 'Buen estado') {
          observaciones.reset('');
          observaciones.disable();
        } else {
          observaciones.enable();
        }
      });
  }

  /** «EJ-00301 — Cálculo I — Docente Gómez — vence 02/08/2026» (Figma), o «— en sala». */
  protected descripcion(p: PrestamoResponse, fecha: string): string {
    const base = `${p.ejemplarCodigo} — ${p.libroTitulo} — ${p.usuarioNombre}`;
    return p.fechaLimiteDevolucion ? `${base} — vence ${fecha}` : `${base} — en sala`;
  }

  /** Al escribir de nuevo en la búsqueda se descarta el préstamo elegido. */
  protected alEscribir(): void {
    if (this.prestamo() !== null) this.prestamo.set(null);
  }

  protected elegir(prestamo: PrestamoResponse): void {
    this.prestamo.set(prestamo);
    this.coincidencias.set(null);
    this.exito.set(null);
  }

  protected mensajeObservaciones(): string | null {
    const control = this.formulario.controls.observaciones;
    if (control.touched && control.invalid && control.enabled) {
      return control.hasError('maxlength')
        ? `Máximo ${LARGO_OBSERVACIONES} caracteres.`
        : 'Las observaciones son obligatorias cuando el estado no es «Buen estado».';
    }
    return null;
  }

  protected registrar(): void {
    const prestamo = this.prestamo();
    if (!prestamo) return;
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { estadoEjemplar, observaciones } = this.formulario.getRawValue();
    this.enviando.set(true);
    this.error.set(null);
    this.devoluciones
      .registrarDevolucion({
        idPrestamo: prestamo.idPrestamo,
        estadoEjemplar,
        observaciones: observaciones.trim() || null,
      })
      .subscribe({
        next: (devolucion) => {
          this.enviando.set(false);
          this.busqueda.reset('', { emitEvent: false });
          this.prestamo.set(null);
          this.formulario.reset({ estadoEjemplar: 'Buen estado', observaciones: '' });
          this.exito.set({
            titulo: 'Devolución registrada',
            mensaje: `El ejemplar ${devolucion.ejemplarCodigo} ahora está ${devolucion.ejemplarEstado}.`,
          });
        },
        error: (error: unknown) => {
          this.enviando.set(false);
          this.error.set(comoErrorRespuesta(error));
        },
      });
  }
}
