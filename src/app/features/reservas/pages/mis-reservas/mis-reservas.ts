import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';

import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { BadgeEstado } from '../../../../shared/components/badge-estado/badge-estado';
import { ModalConfirmacion } from '../../../../shared/components/modal-confirmacion/modal-confirmacion';
import { Celda } from '../../../../shared/components/tabla/celda';
import { ColumnaTabla, Tabla } from '../../../../shared/components/tabla/tabla';
import { TienePermiso } from '../../../../shared/directives/tiene-permiso';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { FechaPipe } from '../../../../shared/pipes/fecha-pipe';
import { Reservas } from '../../data-access/reservas';
import { puedeCancelarse } from '../../models/estado-reserva';
import { ReservaResponse } from '../../models/reserva-response';

/**
 * P7.2 Mis reservas (RF7.5): estado de cada reserva con etiqueta de color (RF7.5.4) y «Cancelar» con
 * confirmación «Volver» / «Cancelar reserva» cuando el estado lo permite (RF7.4).
 */
@Component({
  imports: [Alerta, BadgeEstado, Celda, FechaPipe, ModalConfirmacion, Tabla, TienePermiso],
  selector: 'app-mis-reservas',
  styleUrl: './mis-reservas.css',
  templateUrl: './mis-reservas.html',
})
export class MisReservas {
  private readonly reservas = inject(Reservas);

  /** Columnas de Figma (22:1648): 160 px. */
  protected readonly columnas: ColumnaTabla[] = [
    { clave: 'libroTitulo', titulo: 'Libro', ancho: '160px' },
    { clave: 'fecha', titulo: 'Fecha', ancho: '160px' },
    { clave: 'estado', titulo: 'Estado', ancho: '160px' },
    { clave: 'accion', titulo: 'Acción' },
  ];

  /** Se incrementa para volver a pedir la lista después de cancelar. */
  private readonly recarga = signal(0);
  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly lista = toSignal(
    toObservable(this.recarga).pipe(
      switchMap(() =>
        this.reservas.listarMisReservas().pipe(
          tap(() => this.error.set(null)),
          catchError((error: unknown) => {
            this.error.set(comoErrorRespuesta(error));
            return of(undefined);
          }),
        ),
      ),
    ),
  );

  protected readonly puedeCancelarse = puedeCancelarse;
  protected readonly permisoCancelar = PERMISOS.RESERVA_PROPIA_CANCELAR;

  /** Reserva cuya cancelación espera confirmación. */
  protected readonly pendiente = signal<ReservaResponse | null>(null);
  protected readonly procesando = signal(false);
  /** Si la cancelación falla, el modal sigue abierto con el error del servicio. */
  protected readonly errorCancelar = signal<ErrorRespuesta | null>(null);

  /** Mensaje del modal de Figma (324:39). */
  protected readonly mensajeCancelar = computed(() => {
    const r = this.pendiente();
    return r
      ? `Se cancelará tu reserva de “${r.libroTitulo}” y el ejemplar quedará disponible para otros usuarios.`
      : '';
  });

  protected confirmarCancelacion(): void {
    const reserva = this.pendiente();
    if (!reserva) return;
    this.procesando.set(true);
    this.errorCancelar.set(null);
    this.reservas.cancelarReserva(reserva.idReserva).subscribe({
      next: () => {
        this.procesando.set(false);
        this.pendiente.set(null);
        this.recarga.update((n) => n + 1);
      },
      error: (error: unknown) => {
        this.procesando.set(false);
        this.errorCancelar.set(comoErrorRespuesta(error));
      },
    });
  }

  /** RF7.4, curso alternativo: «Volver» cierra la ventana y la reserva no cambia. */
  protected volver(): void {
    this.pendiente.set(null);
    this.errorCancelar.set(null);
  }
}
