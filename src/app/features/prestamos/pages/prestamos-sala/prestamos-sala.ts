import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Paginador } from '../../../../shared/components/paginador/paginador';
import { Celda } from '../../../../shared/components/tabla/celda';
import { ColumnaTabla, Tabla } from '../../../../shared/components/tabla/tabla';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { FechaPipe } from '../../../../shared/pipes/fecha-pipe';
import { Prestamos } from '../../data-access/prestamos';

/**
 * P9.2 Préstamos en sala vigentes (RF9.1.5), solo lectura: los préstamos en sala activos, con usuario, ejemplar,
 * fecha y hora de inicio y estado (Figma 22:1974).
 */
@Component({
  imports: [Alerta, Celda, FechaPipe, Paginador, Tabla],
  selector: 'app-prestamos-sala',
  styleUrl: './prestamos-sala.css',
  templateUrl: './prestamos-sala.html',
})
export class PrestamosSala {
  private readonly prestamos = inject(Prestamos);

  /** Columnas de Figma (241:3904), de igual ancho. */
  protected readonly columnas: ColumnaTabla[] = [
    { clave: 'usuarioNombre', titulo: 'Usuario' },
    { clave: 'ejemplar', titulo: 'Ejemplar' },
    { clave: 'fechaPrestamo', titulo: 'Fecha de inicio' },
    { clave: 'estado', titulo: 'Estado' },
  ];

  protected readonly pagina = signal(0);
  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly resultado = toSignal(
    toObservable(this.pagina).pipe(
      switchMap((pagina) =>
        this.prestamos.listarPrestamos({ tipoPrestamo: 'sala', estado: 'activo', pagina }).pipe(
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
