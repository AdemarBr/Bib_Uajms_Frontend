import { Service, inject } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { Sesion } from '../../../core/auth/sesion';
import { ErrorRespuesta } from '../../../shared/models/error-respuesta';
import { DatosCatalogo, hoy } from '../../catalogo/data-access/datos-catalogo';
import {
  DEMORA_MS,
  noEncontrado,
  siguienteId,
} from '../../estructura/data-access/datos-estructura';
import { EjemplarReservableResponse } from '../models/ejemplar-reservable-response';
import { esActiva, puedeCancelarse } from '../models/estado-reserva';
import { ReservaRequest } from '../models/reserva-request';
import { ReservaResponse } from '../models/reserva-response';
import { DatosReservas } from './datos-reservas';
import { ReservaMock } from './reservas.mock';

/**
 * Reservas propias del usuario académico (RF7). En la Iteración 5: GET /catalogo/libros/{id}/ejemplar-reservable,
 * POST /reservas, GET /reservas/mias y PATCH /reservas/{id}/cancelar; el backend toma el usuario del token,
 * aquí se toma de `Sesion`. Reglas en docs/contrato-api.md, sección 9.
 */
@Service()
export class Reservas {
  private readonly datos = inject(DatosReservas);
  private readonly catalogo = inject(DatosCatalogo);
  private readonly sesion = inject(Sesion);

  /** GET /catalogo/libros/{id}/ejemplar-reservable (RF7.3): el primer ejemplar disponible del libro. */
  obtenerEjemplarReservable(idLibro: number): Observable<EjemplarReservableResponse> {
    const libro = this.catalogo.libros().find((l) => l.idLibro === idLibro && l.estado);
    if (!libro) return noEncontrado();
    if (this.tieneReservaActiva(idLibro)) return reservaDuplicada();
    const disponibles = this.catalogo
      .ejemplares()
      .filter((e) => e.idLibro === idLibro && e.estado === 'disponible')
      .sort((a, b) => a.idEjemplar - b.idEjemplar);
    if (disponibles.length === 0) {
      return conflicto(
        'Sin ejemplares disponibles',
        'El libro no tiene ejemplares disponibles para reserva en este momento.',
      );
    }
    const ejemplar = disponibles[0];
    return of({
      idLibro,
      libroTitulo: libro.titulo,
      ejemplaresDisponibles: disponibles.length,
      idEjemplar: ejemplar.idEjemplar,
      codigoEjemplar: ejemplar.codigoEjemplar,
      bibliotecaNombre: this.datos.nombreBiblioteca(ejemplar.idBiblioteca),
    }).pipe(delay(DEMORA_MS));
  }

  /**
   * POST /reservas (RF7.1): vuelve a verificar la disponibilidad. La reserva queda Pendiente y no aparta el
   * ejemplar (se aparta al confirmarla, RF8.3).
   */
  registrarReserva(solicitud: ReservaRequest): Observable<ReservaResponse> {
    const idUsuario = this.sesion.usuario()?.idUsuario;
    if (idUsuario === undefined) return noEncontrado();
    const ejemplar = this.catalogo.ejemplares().find((e) => e.idEjemplar === solicitud.idEjemplar);
    const libro = this.catalogo.libros().find((l) => l.idLibro === ejemplar?.idLibro);
    if (!ejemplar || !libro?.estado || ejemplar.estado !== 'disponible') {
      return conflicto('Ejemplar no disponible', 'El ejemplar ya no se encuentra disponible.');
    }
    if (this.tieneReservaActiva(libro.idLibro)) return reservaDuplicada();

    const nueva: ReservaMock = {
      idReserva: siguienteId(this.datos.reservas(), (r) => r.idReserva),
      fecha: hoy(),
      estado: 'Pendiente',
      atendida: false,
      motivo: null,
      idUsuario,
      idEjemplar: ejemplar.idEjemplar,
    };
    this.datos.reservas.update((lista) => [...lista, nueva]);
    this.datos.anotar(nueva.idReserva, null, 'Pendiente');
    return of(this.datos.aRespuesta(nueva)).pipe(delay(DEMORA_MS));
  }

  /** GET /reservas/mias (RF7.5): de la más reciente a la más antigua. */
  listarMisReservas(): Observable<ReservaResponse[]> {
    const idUsuario = this.sesion.usuario()?.idUsuario;
    const mias = this.datos
      .reservas()
      .filter((r) => r.idUsuario === idUsuario)
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.idReserva - a.idReserva)
      .map((r) => this.datos.aRespuesta(r));
    return of(mias).pipe(delay(DEMORA_MS));
  }

  /**
   * PATCH /reservas/{id}/cancelar (RF7.4): solo reservas propias en estado que lo permita. Si estaba
   * Confirmada, su ejemplar vuelve a estar disponible.
   */
  cancelarReserva(idReserva: number): Observable<ReservaResponse> {
    const idUsuario = this.sesion.usuario()?.idUsuario;
    const reserva = this.datos
      .reservas()
      .find((r) => r.idReserva === idReserva && r.idUsuario === idUsuario);
    if (!reserva) return noEncontrado();
    if (!puedeCancelarse(reserva)) {
      return conflicto(
        'Reserva no cancelable',
        'La reserva ya no puede cancelarse debido a su estado actual.',
      );
    }
    if (reserva.estado === 'Confirmada') {
      this.datos.cambiarEstadoEjemplar(reserva.idEjemplar, 'disponible');
    }
    const cancelada = this.datos.cambiarEstado(reserva, 'Cancelada');
    return of(this.datos.aRespuesta(cancelada)).pipe(delay(DEMORA_MS));
  }

  /** Reserva activa (Pendiente, o Confirmada sin atender) del usuario de la sesión para ese libro. */
  private tieneReservaActiva(idLibro: number): boolean {
    const idUsuario = this.sesion.usuario()?.idUsuario;
    const ejemplaresDelLibro = this.catalogo
      .ejemplares()
      .filter((e) => e.idLibro === idLibro)
      .map((e) => e.idEjemplar);
    return this.datos
      .reservas()
      .some(
        (r) =>
          r.idUsuario === idUsuario && esActiva(r) && ejemplaresDelLibro.includes(r.idEjemplar),
      );
  }
}

export function conflicto(titulo: string, detalle: string): Observable<never> {
  const error: ErrorRespuesta = { status: 409, titulo, detalle, errores: [] };
  return throwError(() => error).pipe(delay(DEMORA_MS));
}

function reservaDuplicada(): Observable<never> {
  return conflicto('Reserva duplicada', 'Ya tiene una reserva activa de este libro.');
}
