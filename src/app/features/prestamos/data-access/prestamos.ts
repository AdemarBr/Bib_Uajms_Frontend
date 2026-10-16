import { Service, inject } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';

import { Sesion } from '../../../core/auth/sesion';
import { validarRuSimulado } from '../../../core/auth/servicio-institucional.mock';
import { ErrorCampo } from '../../../shared/models/error-respuesta';
import { Pagina } from '../../../shared/models/pagina';
import { UsuarioVerificadoResponse } from '../../../shared/models/usuario-verificado-response';
import { DatosCatalogo, hoy } from '../../catalogo/data-access/datos-catalogo';
import { EjemplarMock } from '../../ejemplares/data-access/ejemplares.mock';
import {
  DEMORA_MS,
  datosInvalidos,
  noEncontrado,
  normalizar,
  siguienteId,
} from '../../estructura/data-access/datos-estructura';
import { DatosReservas } from '../../reservas/data-access/datos-reservas';
import { conflicto } from '../../reservas/data-access/reservas';
import { esConfirmadaVigente } from '../../reservas/models/estado-reserva';
import { dma, fechaAmpliada, rangoFechaLimite } from '../fechas-prestamo';
import { AmpliacionRequest } from '../models/ampliacion-request';
import { AmpliacionResponse } from '../models/ampliacion-response';
import { EjemplarPrestableResponse } from '../models/ejemplar-prestable-response';
import { FiltroPrestamos } from '../models/filtro-prestamos';
import { PrestamoDomicilioRequest } from '../models/prestamo-domicilio-request';
import { PrestamoResponse, TipoPrestamo } from '../models/prestamo-response';
import { PrestamoSalaRequest } from '../models/prestamo-sala-request';
import { DatosPrestamos } from './datos-prestamos';
import { PrestamoMock } from './prestamos.mock';

const TAMANIO_PAGINA = 20;

/**
 * Préstamos en sala y a domicilio (RF9.1 y RF9.2). En la Iteración 5: POST /usuarios/validar-ru,
 * GET /prestamos/ejemplares-disponibles, POST /prestamos/sala y /prestamos/domicilio, GET /prestamos y
 * POST /prestamos/{id}/ampliaciones. Reglas, 409 y ámbito en docs/contrato-api.md, sección 10.
 */
@Service()
export class Prestamos {
  private readonly datos = inject(DatosPrestamos);
  private readonly catalogo = inject(DatosCatalogo);
  private readonly reservas = inject(DatosReservas);
  private readonly sesion = inject(Sesion);

  /** Biblioteca responsable del usuario de la sesión; `null` si puede ver y prestar en todas (ámbito). */
  bibliotecaDelUsuario(): number | null {
    return this.sesion.usuario()?.idBiblioteca ?? null;
  }

  /**
   * POST /usuarios/validar-ru (RF9.1 y RF9.2, paso 4): si el usuario vigente aún no está en `usuario`, se
   * registra con sus datos mínimos (docs/reglas-negocio.md).
   */
  validarRu(ru: string): Observable<UsuarioVerificadoResponse> {
    return validarRuSimulado(ru).pipe(
      tap((u) => {
        if (this.datos.academicos().some((a) => a.idUsuario === u.idUsuario)) return;
        this.datos.academicos.update((lista) => [
          ...lista,
          { idUsuario: u.idUsuario, nombre: u.nombre, ru: u.ru, estado: true },
        ]);
      }),
    );
  }

  /**
   * GET /prestamos/ejemplares-disponibles?idLibro&idReserva (RF9.1.2 y RF9.2.2): los ejemplares disponibles del
   * libro en el ámbito del usuario y, con una reserva confirmada vigente, también el que ella aparta.
   */
  listarEjemplaresDisponibles(
    idLibro: number,
    idReserva: number | null = null,
  ): Observable<EjemplarPrestableResponse[]> {
    const libro = this.catalogo.libros().find((l) => l.idLibro === idLibro);
    if (!libro) return noEncontrado();
    const apartado = this.reservaVigente(idReserva)?.idEjemplar ?? null;
    const ejemplares = this.catalogo
      .ejemplares()
      .filter(
        (e) =>
          e.idLibro === idLibro &&
          (e.idEjemplar === apartado || (e.estado === 'disponible' && this.enAmbito(e))),
      )
      .map((e) => ({
        idEjemplar: e.idEjemplar,
        codigoEjemplar: e.codigoEjemplar,
        libroTitulo: libro.titulo,
        autor: libro.autor,
        ubicacionFisica: e.ubicacionFisica,
        estado: e.estado,
        soloSala: e.soloSala,
      }));
    return of(ejemplares).pipe(delay(DEMORA_MS));
  }

  /** POST /prestamos/sala (RF9.1): el ejemplar queda «prestado». */
  registrarPrestamoSala(solicitud: PrestamoSalaRequest): Observable<PrestamoResponse> {
    return this.registrar('sala', solicitud, null, null);
  }

  /** POST /prestamos/domicilio (RF9.2): con fecha límite y celular de contacto; el ejemplar queda «prestado». */
  registrarPrestamoDomicilio(solicitud: PrestamoDomicilioRequest): Observable<PrestamoResponse> {
    const errores: ErrorCampo[] = [];
    const { minima, maxima } = rangoFechaLimite();
    const fecha = solicitud.fechaLimiteDevolucion;
    if (!fecha || fecha < minima || fecha > maxima) {
      errores.push({
        campo: 'fechaLimiteDevolucion',
        mensaje: `La fecha de devolución debe estar entre el ${dma(minima)} y el ${dma(maxima)}.`,
      });
    }
    if (!/^\d{8}$/.test(solicitud.celularContacto ?? '')) {
      errores.push({
        campo: 'celularContacto',
        mensaje: 'El celular de contacto debe tener 8 dígitos.',
      });
    }
    if (errores.length) return datosInvalidos(errores);
    return this.registrar('domicilio', solicitud, fecha, solicitud.celularContacto);
  }

  /**
   * GET /prestamos?tipoPrestamo&estado&q (P9.2, P9.4 y P9.5), del más reciente al más antiguo. `q`: código de
   * ejemplar, usuario o número de préstamo (RF9.3.6).
   */
  listarPrestamos(filtro: FiltroPrestamos = {}): Observable<Pagina<PrestamoResponse>> {
    const q = normalizar(filtro.q ?? '');
    const idBiblioteca = this.bibliotecaDelUsuario();
    const coincidencias = this.datos
      .prestamos()
      .filter(
        (p) =>
          (idBiblioteca === null || this.datos.bibliotecaDe(p) === idBiblioteca) &&
          (filtro.tipoPrestamo == null || p.tipoPrestamo === filtro.tipoPrestamo) &&
          (filtro.estado == null || p.estado === filtro.estado),
      )
      .map((p) => this.datos.aRespuesta(p))
      .filter(
        (p) =>
          !q ||
          [p.ejemplarCodigo, p.usuarioNombre, p.usuarioRu ?? '', String(p.idPrestamo)].some((c) =>
            normalizar(c).includes(q),
          ),
      )
      .sort((a, b) => b.fechaPrestamo.localeCompare(a.fechaPrestamo));
    const pagina = filtro.pagina ?? 0;
    const tamanio = filtro.tamanio ?? TAMANIO_PAGINA;
    return of({
      contenido: coincidencias.slice(pagina * tamanio, (pagina + 1) * tamanio),
      pagina,
      tamanio,
      totalElementos: coincidencias.length,
    }).pipe(delay(DEMORA_MS));
  }

  /** POST /prestamos/{id}/ampliaciones (RF9.2.8): vencido o no, sin límite de ampliaciones. */
  ampliarPlazo(idPrestamo: number, solicitud: AmpliacionRequest): Observable<AmpliacionResponse> {
    const prestamo = this.datos.prestamos().find((p) => p.idPrestamo === idPrestamo);
    if (!prestamo || !this.enAmbitoPrestamo(prestamo)) return noEncontrado();
    if (
      prestamo.tipoPrestamo !== 'domicilio' ||
      prestamo.estado !== 'activo' ||
      !prestamo.fechaLimiteDevolucion
    ) {
      return conflicto('Préstamo no ampliable', 'Solo se amplían préstamos a domicilio vigentes.');
    }
    const fechaAnterior = prestamo.fechaLimiteDevolucion;
    const fechaNueva = fechaAmpliada(fechaAnterior);
    if (solicitud.fechaNueva !== fechaNueva) {
      return datosInvalidos([
        {
          campo: 'fechaNueva',
          mensaje: 'La fecha propuesta ya no es válida. Vuelva a abrir la ampliación.',
        },
      ]);
    }
    const ampliacion: AmpliacionResponse = {
      idAmpliacion: siguienteId(this.datos.ampliaciones(), (a) => a.idAmpliacion),
      fechaAnterior,
      fechaNueva,
      idPrestamo,
    };
    this.datos.ampliaciones.update((lista) => [...lista, ampliacion]);
    this.datos.prestamos.update((lista) =>
      lista.map((p) =>
        p.idPrestamo === idPrestamo ? { ...p, fechaLimiteDevolucion: fechaNueva } : p,
      ),
    );
    return of(ampliacion).pipe(delay(DEMORA_MS));
  }

  private registrar(
    tipoPrestamo: TipoPrestamo,
    solicitud: PrestamoSalaRequest,
    fechaLimiteDevolucion: string | null,
    celularContacto: string | null,
  ): Observable<PrestamoResponse> {
    const usuario = this.datos.academicos().find((u) => u.ru === solicitud.ru);
    if (!usuario?.estado) {
      return conflicto(
        'Usuario no habilitado',
        'El usuario no está habilitado para solicitar préstamos.',
      );
    }

    const reserva = solicitud.idReserva === null ? null : this.reservaVigente(solicitud.idReserva);
    if (solicitud.idReserva !== null && reserva?.idUsuario !== usuario.idUsuario) {
      return conflicto('Reserva no vigente', 'La reserva ya no se encuentra vigente.');
    }

    const ejemplar = this.catalogo.ejemplares().find((e) => e.idEjemplar === solicitud.idEjemplar);
    const esApartado = !!reserva && ejemplar?.idEjemplar === reserva.idEjemplar;
    const libroReservado = this.catalogo
      .ejemplares()
      .find((e) => e.idEjemplar === reserva?.idEjemplar)?.idLibro;
    const disponible =
      !!ejemplar &&
      (esApartado ||
        (ejemplar.estado === 'disponible' &&
          this.enAmbito(ejemplar) &&
          (!reserva || ejemplar.idLibro === libroReservado)));
    if (!ejemplar || !disponible) {
      return conflicto('Ejemplar no disponible', 'El ejemplar no está disponible.');
    }
    if (tipoPrestamo === 'domicilio' && ejemplar.soloSala) {
      return conflicto(
        'Ejemplar de uso exclusivo en sala',
        'El ejemplar es de uso exclusivo en sala.',
      );
    }

    const prestamo: PrestamoMock = {
      idPrestamo: siguienteId(this.datos.prestamos(), (p) => p.idPrestamo),
      fechaPrestamo: `${hoy()}T${horaActual()}`,
      estado: 'activo',
      tipoPrestamo,
      fechaLimiteDevolucion,
      celularContacto,
      idUsuario: usuario.idUsuario,
      idEjemplar: ejemplar.idEjemplar,
      idReserva: reserva?.idReserva ?? null,
    };
    this.datos.prestamos.update((lista) => [...lista, prestamo]);
    this.datos.cambiarEstadoEjemplar(ejemplar.idEjemplar, 'prestado');
    if (reserva) {
      // RF9.1.6: si se prestó otro ejemplar del libro, el apartado por la reserva vuelve a estar disponible.
      if (!esApartado) this.datos.cambiarEstadoEjemplar(reserva.idEjemplar, 'disponible');
      this.reservas.marcarAtendida(reserva.idReserva);
    }
    return of(this.datos.aRespuesta(prestamo)).pipe(delay(DEMORA_MS));
  }

  /** Reserva Confirmada sin atender, o `undefined`. */
  private reservaVigente(idReserva: number | null) {
    if (idReserva === null) return undefined;
    const reserva = this.reservas.reservas().find((r) => r.idReserva === idReserva);
    return reserva && esConfirmadaVigente(reserva) ? reserva : undefined;
  }

  private enAmbito(ejemplar: EjemplarMock): boolean {
    const idBiblioteca = this.bibliotecaDelUsuario();
    return idBiblioteca === null || ejemplar.idBiblioteca === idBiblioteca;
  }

  private enAmbitoPrestamo(prestamo: PrestamoMock): boolean {
    const idBiblioteca = this.bibliotecaDelUsuario();
    return idBiblioteca === null || this.datos.bibliotecaDe(prestamo) === idBiblioteca;
  }
}

/** «09:15:00» en la hora local. */
function horaActual(): string {
  const d = new Date();
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${dos(d.getHours())}:${dos(d.getMinutes())}:${dos(d.getSeconds())}`;
}
