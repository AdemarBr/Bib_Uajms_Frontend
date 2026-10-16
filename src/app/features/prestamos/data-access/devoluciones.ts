import { Service, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { Sesion } from '../../../core/auth/sesion';
import { Pagina } from '../../../shared/models/pagina';
import { hoy } from '../../catalogo/data-access/datos-catalogo';
import {
  DEMORA_MS,
  datosInvalidos,
  noEncontrado,
  normalizar,
  siguienteId,
} from '../../estructura/data-access/datos-estructura';
import { conflicto } from '../../reservas/data-access/reservas';
import { DevolucionRequest } from '../models/devolucion-request';
import { DevolucionResponse } from '../models/devolucion-response';
import { FiltroDevoluciones } from '../models/filtro-devoluciones';
import { DatosPrestamos } from './datos-prestamos';
import { DevolucionMock } from './prestamos.mock';

const TAMANIO_PAGINA = 20;
const LARGO_OBSERVACIONES = 500;

/**
 * Devoluciones (RF9.3). En la Iteración 5: POST /devoluciones y GET /devoluciones. Reglas, 409 y ámbito en
 * docs/contrato-api.md, sección 10.
 */
@Service()
export class Devoluciones {
  private readonly datos = inject(DatosPrestamos);
  private readonly sesion = inject(Sesion);

  /**
   * POST /devoluciones (RF9.3): cierra el préstamo y deja el ejemplar «disponible» si volvió en «Buen estado» o
   * «no disponible» si no (RF9.3.4).
   */
  registrarDevolucion(solicitud: DevolucionRequest): Observable<DevolucionResponse> {
    const prestamo = this.datos.prestamos().find((p) => p.idPrestamo === solicitud.idPrestamo);
    if (!prestamo || !this.enAmbito(this.datos.bibliotecaDe(prestamo))) return noEncontrado();
    if (prestamo.estado !== 'activo') {
      return conflicto('Préstamo no vigente', 'El préstamo ya fue devuelto.');
    }
    const observaciones = solicitud.observaciones?.trim() || null;
    const buenEstado = solicitud.estadoEjemplar === 'Buen estado';
    if (!buenEstado && !observaciones) {
      return datosInvalidos([
        {
          campo: 'observaciones',
          mensaje: 'Las observaciones son obligatorias cuando el estado no es «Buen estado».',
        },
      ]);
    }
    if (observaciones && observaciones.length > LARGO_OBSERVACIONES) {
      return datosInvalidos([
        { campo: 'observaciones', mensaje: `Máximo ${LARGO_OBSERVACIONES} caracteres.` },
      ]);
    }

    const devolucion: DevolucionMock = {
      idDevolucion: siguienteId(this.datos.devoluciones(), (d) => d.idDevolucion),
      fechaDevolucion: hoy(),
      estadoEjemplar: solicitud.estadoEjemplar,
      observaciones,
      idPrestamo: prestamo.idPrestamo,
    };
    this.datos.devoluciones.update((lista) => [...lista, devolucion]);
    this.datos.prestamos.update((lista) =>
      lista.map((p) =>
        p.idPrestamo === prestamo.idPrestamo ? { ...p, estado: 'inactivo' as const } : p,
      ),
    );
    this.datos.cambiarEstadoEjemplar(
      prestamo.idEjemplar,
      buenEstado ? 'disponible' : 'no disponible',
    );
    return of(this.datos.aDevolucion(devolucion)).pipe(delay(DEMORA_MS));
  }

  /**
   * GET /devoluciones?q&desde&hasta (RF9.3.5), de la más reciente a la más antigua. `q`: usuario, código de
   * ejemplar o título; `desde` y `hasta`: fecha de devolución.
   */
  listarDevoluciones(filtro: FiltroDevoluciones = {}): Observable<Pagina<DevolucionResponse>> {
    const q = normalizar(filtro.q ?? '');
    const coincidencias = this.datos
      .devoluciones()
      .filter((d) => {
        const prestamo = this.datos.prestamos().find((p) => p.idPrestamo === d.idPrestamo);
        return !!prestamo && this.enAmbito(this.datos.bibliotecaDe(prestamo));
      })
      .map((d) => this.datos.aDevolucion(d))
      .filter(
        (d) =>
          (!q ||
            [d.usuarioNombre, d.ejemplarCodigo, d.libroTitulo].some((c) =>
              normalizar(c).includes(q),
            )) &&
          (!filtro.desde || d.fechaDevolucion >= filtro.desde) &&
          (!filtro.hasta || d.fechaDevolucion <= filtro.hasta),
      )
      .sort(
        (a, b) =>
          b.fechaDevolucion.localeCompare(a.fechaDevolucion) || b.idDevolucion - a.idDevolucion,
      );
    const pagina = filtro.pagina ?? 0;
    const tamanio = filtro.tamanio ?? TAMANIO_PAGINA;
    return of({
      contenido: coincidencias.slice(pagina * tamanio, (pagina + 1) * tamanio),
      pagina,
      tamanio,
      totalElementos: coincidencias.length,
    }).pipe(delay(DEMORA_MS));
  }

  /** Ámbito: con biblioteca responsable, solo las devoluciones de ejemplares de esa biblioteca. */
  private enAmbito(idBiblioteca: number | null): boolean {
    const propia = this.sesion.usuario()?.idBiblioteca ?? null;
    return propia === null || idBiblioteca === propia;
  }
}
