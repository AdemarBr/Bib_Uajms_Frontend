import { Service, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { Sesion } from '../../../core/auth/sesion';
import { Pagina } from '../../../shared/models/pagina';
import { DatosCatalogo } from '../../catalogo/data-access/datos-catalogo';
import { DEMORA_MS, noEncontrado, normalizar } from '../../estructura/data-access/datos-estructura';
import { esConfirmadaVigente } from '../models/estado-reserva';
import { FiltroReservas } from '../models/filtro-reservas';
import { HistorialReservaResponse } from '../models/historial-reserva-response';
import { MotivoRequest } from '../models/motivo-request';
import { ReservaResponse } from '../models/reserva-response';
import { DatosReservas } from './datos-reservas';
import { ReservaMock } from './reservas.mock';
import { conflicto } from './reservas';

const TAMANIO_PAGINA = 20;

/**
 * Administración de reservas (RF8). En la Iteración 5: GET /reservas, GET /reservas/{id},
 * PATCH /reservas/{id}/confirmar, /rechazar y /cancelar-administrativa, y GET /reservas/historial.
 * Ámbito (RF8.2): con biblioteca responsable, solo las reservas de esa biblioteca. Reglas en
 * docs/contrato-api.md, sección 9.
 */
@Service()
export class AdministrarReservas {
  private readonly datos = inject(DatosReservas);
  private readonly catalogo = inject(DatosCatalogo);
  private readonly sesion = inject(Sesion);

  /** Biblioteca responsable del usuario de la sesión; `null` si puede ver todas (RF8.2, curso alternativo). */
  bibliotecaDelUsuario(): number | null {
    return this.sesion.usuario()?.idBiblioteca ?? null;
  }

  /** GET /reservas?idBiblioteca&estado&desde&hasta&q (RF8.1 y RF8.2), de la más reciente a la más antigua. */
  listarReservas(filtro: FiltroReservas = {}): Observable<Pagina<ReservaResponse>> {
    const q = normalizar(filtro.q ?? '');
    const idBiblioteca = this.bibliotecaDelUsuario() ?? filtro.idBiblioteca ?? null;
    const coincidencias = this.datos
      .reservas()
      .map((r) => this.datos.aRespuesta(r))
      .filter(
        (r) =>
          (!q ||
            [r.usuarioNombre, r.libroTitulo, r.bibliotecaNombre].some((c) =>
              normalizar(c).includes(q),
            )) &&
          (idBiblioteca === null || r.idBiblioteca === idBiblioteca) &&
          (filtro.estado == null || r.estado === filtro.estado) &&
          enPeriodo(r.fecha, filtro),
      )
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.idReserva - a.idReserva);
    return of(paginar(coincidencias, filtro)).pipe(delay(DEMORA_MS));
  }

  /** GET /reservas/{id}: solo una reserva Confirmada sin atender sigue vigente para prestar (RF8.8.3). */
  obtenerReservaVigente(idReserva: number): Observable<ReservaResponse> {
    const reserva = this.buscar(idReserva);
    if (!reserva) return noEncontrado();
    if (!esConfirmadaVigente(reserva)) {
      return conflicto('Reserva no vigente', 'La reserva ya no se encuentra vigente.');
    }
    return of(this.datos.aRespuesta(reserva)).pipe(delay(DEMORA_MS));
  }

  /** PATCH /reservas/{id}/confirmar (RF8.3): solo pendientes con el ejemplar disponible; lo aparta. */
  confirmar(idReserva: number): Observable<ReservaResponse> {
    const reserva = this.buscar(idReserva);
    if (!reserva) return noEncontrado();
    if (reserva.estado !== 'Pendiente') return yaAtendida();
    const ejemplar = this.catalogo.ejemplares().find((e) => e.idEjemplar === reserva.idEjemplar);
    if (ejemplar?.estado !== 'disponible') {
      return conflicto('Ejemplar no disponible', 'El ejemplar ya no se encuentra disponible.');
    }
    this.datos.cambiarEstadoEjemplar(reserva.idEjemplar, 'reservado');
    return this.responder(this.datos.cambiarEstado(reserva, 'Confirmada'));
  }

  /** PATCH /reservas/{id}/rechazar (RF8.4): solo pendientes; el motivo es opcional. */
  rechazar(idReserva: number, solicitud: MotivoRequest): Observable<ReservaResponse> {
    const reserva = this.buscar(idReserva);
    if (!reserva) return noEncontrado();
    if (reserva.estado !== 'Pendiente') return yaAtendida();
    return this.responder(this.datos.cambiarEstado(reserva, 'Rechazada', limpiar(solicitud)));
  }

  /** PATCH /reservas/{id}/cancelar-administrativa (RF8.5): solo confirmadas sin atender; libera el ejemplar. */
  cancelarAdministrativa(idReserva: number, solicitud: MotivoRequest): Observable<ReservaResponse> {
    const reserva = this.buscar(idReserva);
    if (!reserva) return noEncontrado();
    if (!esConfirmadaVigente(reserva)) {
      return conflicto('Reserva no activa', 'La reserva ya no está activa.');
    }
    this.datos.cambiarEstadoEjemplar(reserva.idEjemplar, 'disponible');
    return this.responder(this.datos.cambiarEstado(reserva, 'Cancelada', limpiar(solicitud)));
  }

  /** GET /reservas/historial?desde&hasta (RF8.7): una fila por cambio de estado, del más reciente al más antiguo. */
  listarHistorial(filtro: FiltroReservas = {}): Observable<Pagina<HistorialReservaResponse>> {
    const idBiblioteca = this.bibliotecaDelUsuario();
    const cambios = this.datos
      .historial()
      .map((h) => {
        const reserva = this.datos.aRespuesta(this.buscar(h.idReserva)!);
        return {
          ...h,
          usuarioNombre: reserva.usuarioNombre,
          libroTitulo: reserva.libroTitulo,
          bibliotecaNombre: reserva.bibliotecaNombre,
          idBiblioteca: reserva.idBiblioteca,
        };
      })
      .filter(
        (h) =>
          (idBiblioteca === null || h.idBiblioteca === idBiblioteca) && enPeriodo(h.fecha, filtro),
      )
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.idHistorialReserva - a.idHistorialReserva)
      .map(({ idBiblioteca: _, ...h }) => h);
    return of(paginar(cambios, filtro)).pipe(delay(DEMORA_MS));
  }

  private buscar(idReserva: number): ReservaMock | undefined {
    return this.datos.reservas().find((r) => r.idReserva === idReserva);
  }

  private responder(reserva: ReservaMock): Observable<ReservaResponse> {
    return of(this.datos.aRespuesta(reserva)).pipe(delay(DEMORA_MS));
  }
}

function yaAtendida(): Observable<never> {
  return conflicto('Reserva ya atendida', 'La reserva ya fue atendida.');
}

function limpiar(solicitud: MotivoRequest): string | null {
  return solicitud.motivo?.trim() || null;
}

function enPeriodo(fecha: string, filtro: FiltroReservas): boolean {
  return (!filtro.desde || fecha >= filtro.desde) && (!filtro.hasta || fecha <= filtro.hasta);
}

function paginar<T>(filas: T[], filtro: FiltroReservas): Pagina<T> {
  const pagina = filtro.pagina ?? 0;
  const tamanio = filtro.tamanio ?? TAMANIO_PAGINA;
  return {
    contenido: filas.slice(pagina * tamanio, (pagina + 1) * tamanio),
    pagina,
    tamanio,
    totalElementos: filas.length,
  };
}
