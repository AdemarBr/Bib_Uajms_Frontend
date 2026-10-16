import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Paginador } from '../../../../shared/components/paginador/paginador';
import { Celda } from '../../../../shared/components/tabla/celda';
import { ColumnaTabla, Tabla } from '../../../../shared/components/tabla/tabla';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { FechaPipe } from '../../../../shared/pipes/fecha-pipe';
import { Devoluciones } from '../../data-access/devoluciones';

/**
 * P9.6 Consultar historial de devoluciones (RF9.3.5; Figma 24:3), solo lectura: búsqueda por usuario o ejemplar
 * y rango de fechas («Desde» y «Hasta», como P8.2), de la devolución más reciente a la más antigua.
 */
@Component({
  imports: [ReactiveFormsModule, Alerta, Celda, FechaPipe, Paginador, Tabla],
  selector: 'app-historial-devoluciones',
  styleUrl: './historial-devoluciones.css',
  templateUrl: './historial-devoluciones.html',
})
export class HistorialDevoluciones {
  private readonly devoluciones = inject(Devoluciones);

  /** Columnas de Figma (281:5342), de igual ancho. */
  protected readonly columnas: ColumnaTabla[] = [
    { clave: 'usuarioNombre', titulo: 'Usuario' },
    { clave: 'ejemplar', titulo: 'Ejemplar' },
    { clave: 'fechaPrestamo', titulo: 'Fecha de préstamo' },
    { clave: 'fechaDevolucion', titulo: 'Fecha de devolución' },
    { clave: 'estadoEjemplar', titulo: 'Estado' },
    { clave: 'observaciones', titulo: 'Observaciones' },
  ];

  protected readonly filtros = new FormGroup({
    q: new FormControl('', { nonNullable: true }),
    desde: new FormControl('', { nonNullable: true }),
    hasta: new FormControl('', { nonNullable: true }),
  });
  protected readonly pagina = signal(0);
  private readonly valores = toSignal(
    this.filtros.valueChanges.pipe(
      debounceTime(250),
      map(() => this.filtros.getRawValue()),
      tap(() => this.pagina.set(0)),
    ),
    { initialValue: this.filtros.getRawValue() },
  );

  private readonly solicitud = computed(() => ({
    q: this.valores().q.trim(),
    desde: this.valores().desde || null,
    hasta: this.valores().hasta || null,
    pagina: this.pagina(),
  }));

  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly resultado = toSignal(
    toObservable(this.solicitud).pipe(
      switchMap((s) =>
        this.devoluciones.listarDevoluciones(s).pipe(
          tap(() => this.error.set(null)),
          catchError((error: unknown) => {
            this.error.set(comoErrorRespuesta(error));
            return of(undefined);
          }),
        ),
      ),
    ),
  );
}
