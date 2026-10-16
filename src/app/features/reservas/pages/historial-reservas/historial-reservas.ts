import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Paginador } from '../../../../shared/components/paginador/paginador';
import { Celda } from '../../../../shared/components/tabla/celda';
import { ColumnaTabla, Tabla } from '../../../../shared/components/tabla/tabla';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { FechaPipe } from '../../../../shared/pipes/fecha-pipe';
import { AdministrarReservas } from '../../data-access/administrar-reservas';

/**
 * P8.2 Historial de reservas (RF8.7), solo lectura: una fila por cambio de estado (`historial_estado_reserva`)
 * con usuario, libro, fecha, biblioteca y el estado nuevo; filtro por periodo («Desde» y «Hasta»).
 */
@Component({
  imports: [ReactiveFormsModule, Alerta, Celda, FechaPipe, Paginador, Tabla],
  selector: 'app-historial-reservas',
  styleUrl: './historial-reservas.css',
  templateUrl: './historial-reservas.html',
})
export class HistorialReservas {
  private readonly reservas = inject(AdministrarReservas);

  /** Columnas de Figma (22:1821), de igual ancho. */
  protected readonly columnas: ColumnaTabla[] = [
    { clave: 'usuarioNombre', titulo: 'Usuario' },
    { clave: 'libroTitulo', titulo: 'Libro' },
    { clave: 'fecha', titulo: 'Fecha' },
    { clave: 'bibliotecaNombre', titulo: 'Biblioteca' },
    { clave: 'estadoNuevo', titulo: 'Estado' },
  ];

  protected readonly periodo = new FormGroup({
    desde: new FormControl('', { nonNullable: true }),
    hasta: new FormControl('', { nonNullable: true }),
  });
  protected readonly pagina = signal(0);
  private readonly valores = toSignal(
    this.periodo.valueChanges.pipe(
      map(() => this.periodo.getRawValue()),
      tap(() => this.pagina.set(0)),
    ),
    { initialValue: this.periodo.getRawValue() },
  );

  private readonly solicitud = computed(() => ({
    desde: this.valores().desde || null,
    hasta: this.valores().hasta || null,
    pagina: this.pagina(),
  }));

  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly resultado = toSignal(
    toObservable(this.solicitud).pipe(
      switchMap((s) =>
        this.reservas.listarHistorial(s).pipe(
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
