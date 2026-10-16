import { Service, inject } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { Sesion } from '../../../core/auth/sesion';
import { ErrorRespuesta } from '../../../shared/models/error-respuesta';
import { DatosCatalogo, hoy } from '../../catalogo/data-access/datos-catalogo';
import {
  DEMORA_MS,
  DatosEstructura,
  noEncontrado,
  siguienteId,
} from '../../estructura/data-access/datos-estructura';
import { USUARIOS_MOCK } from '../../usuarios/data-access/usuarios.mock';
import { EjemplarReservableResponse } from '../models/ejemplar-reservable-response';
import { EstadoReserva, puedeCancelarse } from '../models/estado-reserva';
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
  private readonly estructura = inject(DatosEstructura);
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
      bibliotecaNombre: this.nombreBiblioteca(ejemplar.idBiblioteca),
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

    const fecha = hoy();
    const nueva: ReservaMock = {
      idReserva: siguienteId(this.datos.reservas(), (r) => r.idReserva),
      fecha,
      estado: 'Pendiente',
      atendida: false,
      motivo: null,
      idUsuario,
      idEjemplar: ejemplar.idEjemplar,
    };
    this.datos.reservas.update((lista) => [...lista, nueva]);
    this.anotar(nueva.idReserva, null, 'Pendiente');
    return of(this.aRespuesta(nueva)).pipe(delay(DEMORA_MS));
  }

  /** GET /reservas/mias (RF7.5): de la más reciente a la más antigua. */
  listarMisReservas(): Observable<ReservaResponse[]> {
    const idUsuario = this.sesion.usuario()?.idUsuario;
    const mias = this.datos
      .reservas()
      .filter((r) => r.idUsuario === idUsuario)
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.idReserva - a.idReserva)
      .map((r) => this.aRespuesta(r));
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
      this.catalogo.ejemplares.update((lista) =>
        lista.map((e) =>
          e.idEjemplar === reserva.idEjemplar ? { ...e, estado: 'disponible' } : e,
        ),
      );
    }
    const cancelada: ReservaMock = { ...reserva, estado: 'Cancelada' };
    this.datos.reservas.update((lista) =>
      lista.map((r) => (r.idReserva === idReserva ? cancelada : r)),
    );
    this.anotar(idReserva, reserva.estado, 'Cancelada');
    return of(this.aRespuesta(cancelada)).pipe(delay(DEMORA_MS));
  }

  /** Reserva Pendiente o Confirmada del usuario de la sesión para un ejemplar de ese libro. */
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
          r.idUsuario === idUsuario &&
          (r.estado === 'Pendiente' || r.estado === 'Confirmada') &&
          ejemplaresDelLibro.includes(r.idEjemplar),
      );
  }

  private anotar(
    idReserva: number,
    estadoAnterior: EstadoReserva | null,
    estadoNuevo: EstadoReserva,
  ): void {
    this.datos.historial.update((historial) => [
      ...historial,
      {
        idHistorialReserva: siguienteId(historial, (h) => h.idHistorialReserva),
        fecha: hoy(),
        estadoAnterior,
        estadoNuevo,
        idReserva,
      },
    ]);
  }

  private nombreBiblioteca(idBiblioteca: number): string {
    return this.estructura.bibliotecas().find((b) => b.idBiblioteca === idBiblioteca)?.nombre ?? '';
  }

  /** Arma la respuesta con el usuario, el ejemplar, el libro y la biblioteca (join como en el backend). */
  private aRespuesta(r: ReservaMock): ReservaResponse {
    const ejemplar = this.catalogo.ejemplares().find((e) => e.idEjemplar === r.idEjemplar);
    const libro = this.catalogo.libros().find((l) => l.idLibro === ejemplar?.idLibro);
    return {
      ...r,
      usuarioNombre: USUARIOS_MOCK.find((u) => u.idUsuario === r.idUsuario)?.nombre ?? '',
      ejemplarCodigo: ejemplar?.codigoEjemplar ?? '',
      idLibro: libro?.idLibro ?? 0,
      libroTitulo: libro?.titulo ?? '',
      idBiblioteca: ejemplar?.idBiblioteca ?? 0,
      bibliotecaNombre: ejemplar ? this.nombreBiblioteca(ejemplar.idBiblioteca) : '',
    };
  }
}

function conflicto(titulo: string, detalle: string): Observable<never> {
  const error: ErrorRespuesta = { status: 409, titulo, detalle, errores: [] };
  return throwError(() => error).pipe(delay(DEMORA_MS));
}

function reservaDuplicada(): Observable<never> {
  return conflicto('Reserva duplicada', 'Ya tiene una reserva activa de este libro.');
}
