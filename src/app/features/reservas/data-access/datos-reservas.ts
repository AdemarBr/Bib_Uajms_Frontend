import { Service, inject, signal } from '@angular/core';

import { DatosCatalogo, hoy } from '../../catalogo/data-access/datos-catalogo';
import { DatosEstructura, siguienteId } from '../../estructura/data-access/datos-estructura';
import { USUARIOS_MOCK } from '../../usuarios/data-access/usuarios.mock';
import { EstadoReserva } from '../models/estado-reserva';
import { ReservaResponse } from '../models/reserva-response';
import {
  HISTORIAL_RESERVAS_MOCK,
  HistorialReservaMock,
  RESERVAS_MOCK,
  ReservaMock,
} from './reservas.mock';

/**
 * Tablas reserva e historial_estado_reserva del prototipo, compartidas por las reservas propias (RF7) y la
 * administración de reservas (RF8), con el armado de las respuestas como lo haría el backend (join con
 * usuario, ejemplar, libro y biblioteca). Solo existe en la Iteración 4, igual que `DatosCatalogo`.
 */
@Service()
export class DatosReservas {
  private readonly catalogo = inject(DatosCatalogo);
  private readonly estructura = inject(DatosEstructura);

  readonly reservas = signal<ReservaMock[]>(RESERVAS_MOCK);
  readonly historial = signal<HistorialReservaMock[]>(HISTORIAL_RESERVAS_MOCK);

  /** `ReservaResponse` con el usuario, el ejemplar, el libro y la biblioteca. */
  aRespuesta(r: ReservaMock): ReservaResponse {
    const ejemplar = this.catalogo.ejemplares().find((e) => e.idEjemplar === r.idEjemplar);
    const libro = this.catalogo.libros().find((l) => l.idLibro === ejemplar?.idLibro);
    return {
      ...r,
      usuarioNombre: nombreUsuario(r.idUsuario),
      ejemplarCodigo: ejemplar?.codigoEjemplar ?? '',
      idLibro: libro?.idLibro ?? 0,
      libroTitulo: libro?.titulo ?? '',
      idBiblioteca: ejemplar?.idBiblioteca ?? 0,
      bibliotecaNombre: ejemplar ? this.nombreBiblioteca(ejemplar.idBiblioteca) : '',
    };
  }

  nombreBiblioteca(idBiblioteca: number): string {
    return this.estructura.bibliotecas().find((b) => b.idBiblioteca === idBiblioteca)?.nombre ?? '';
  }

  /** Cambia el estado (y el motivo, si se indica) y lo anota en historial_estado_reserva con la fecha de hoy. */
  cambiarEstado(
    reserva: ReservaMock,
    estadoNuevo: EstadoReserva,
    motivo?: string | null,
  ): ReservaMock {
    const actualizada: ReservaMock = {
      ...reserva,
      estado: estadoNuevo,
      motivo: motivo === undefined ? reserva.motivo : motivo,
    };
    this.reservas.update((lista) =>
      lista.map((r) => (r.idReserva === reserva.idReserva ? actualizada : r)),
    );
    this.anotar(reserva.idReserva, reserva.estado, estadoNuevo);
    return actualizada;
  }

  anotar(
    idReserva: number,
    estadoAnterior: EstadoReserva | null,
    estadoNuevo: EstadoReserva,
  ): void {
    this.historial.update((historial) => [
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

  /** Cambia el estado de un ejemplar (confirmar lo aparta; cancelar lo libera). */
  cambiarEstadoEjemplar(idEjemplar: number, estado: 'disponible' | 'reservado'): void {
    this.catalogo.ejemplares.update((lista) =>
      lista.map((e) => (e.idEjemplar === idEjemplar ? { ...e, estado } : e)),
    );
  }
}

export function nombreUsuario(idUsuario: number): string {
  return USUARIOS_MOCK.find((u) => u.idUsuario === idUsuario)?.nombre ?? '';
}
