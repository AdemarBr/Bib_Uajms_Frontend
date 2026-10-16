import { Component, OnInit, computed, inject, input, signal } from '@angular/core';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { FechaPipe } from '../../../../shared/pipes/fecha-pipe';
import { Reservas } from '../../data-access/reservas';
import { EjemplarReservableResponse } from '../../models/ejemplar-reservable-response';
import { ReservaResponse } from '../../models/reserva-response';

const fecha = new FechaPipe();

/**
 * P7.1 Confirmar reserva de libro (RF7.1 a RF7.3): llega desde «Reservar» de P6.1 o P6.2 con el libro
 * elegido, verifica la disponibilidad y habilita «Confirmar reserva» solo si hay un ejemplar reservable.
 */
@Component({
  imports: [Alerta],
  selector: 'app-confirmar-reserva',
  styleUrl: './confirmar-reserva.css',
  templateUrl: './confirmar-reserva.html',
})
export class ConfirmarReserva implements OnInit {
  private readonly reservas = inject(Reservas);

  /** Parámetro `:idLibro` de la ruta. */
  readonly idLibro = input.required<string>();

  /** Ejemplar verificado (RF7.3); `null` mientras se verifica o si no se puede reservar. */
  protected readonly ejemplar = signal<EjemplarReservableResponse | null>(null);
  /** RF7.3, curso alternativo: el motivo por el que no se puede reservar (lo define el servicio). */
  protected readonly errorDisponibilidad = signal<ErrorRespuesta | null>(null);
  protected readonly enviando = signal(false);
  protected readonly registrada = signal<ReservaResponse | null>(null);
  /** Error al confirmar (p. ej. el ejemplar dejó de estar disponible, RF7.1). */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  /** «1 ejemplar disponible para reserva.» (Figma 22:1508). */
  protected readonly mensajeDisponibilidad = computed(() => {
    const n = this.ejemplar()?.ejemplaresDisponibles ?? 0;
    return n === 1
      ? '1 ejemplar disponible para reserva.'
      : `${n} ejemplares disponibles para reserva.`;
  });

  /** RF7.1.5: libro, fecha y estado de la reserva registrada (texto de Figma). */
  protected readonly confirmacion = computed(() => {
    const r = this.registrada();
    if (!r) return '';
    const estado = r.estado === 'Pendiente' ? 'Pendiente de confirmación' : r.estado;
    return `Libro: ${r.libroTitulo} · Fecha: ${fecha.transform(r.fecha)} · Estado: ${estado}.`;
  });

  ngOnInit(): void {
    this.reservas.obtenerEjemplarReservable(Number(this.idLibro())).subscribe({
      next: (ejemplar) => this.ejemplar.set(ejemplar),
      error: (error: unknown) => this.errorDisponibilidad.set(comoErrorRespuesta(error)),
    });
  }

  /** RF7.1, pasos 5 a 7: el servicio vuelve a verificar la disponibilidad antes de registrar. */
  protected confirmar(): void {
    const ejemplar = this.ejemplar();
    if (!ejemplar) return;
    this.enviando.set(true);
    this.error.set(null);
    this.reservas.registrarReserva({ idEjemplar: ejemplar.idEjemplar }).subscribe({
      next: (reserva) => {
        this.enviando.set(false);
        this.registrada.set(reserva);
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.error.set(comoErrorRespuesta(error));
      },
    });
  }
}
