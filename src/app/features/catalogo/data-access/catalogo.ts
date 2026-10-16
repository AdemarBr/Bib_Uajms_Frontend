import { Service, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { Pagina } from '../../../shared/models/pagina';
import {
  DEMORA_MS,
  DatosEstructura,
  noEncontrado,
  normalizar,
} from '../../estructura/data-access/datos-estructura';
import { FiltroCatalogo } from '../models/filtro-catalogo';
import { LibroCatalogoResponse } from '../models/libro-catalogo-response';
import { LibroDetalleResponse } from '../models/libro-detalle-response';
import { NovedadResponse } from '../models/novedad-response';
import { OpcionesFiltroLibroResponse } from '../models/opciones-filtro-libro-response';
import { DatosCatalogo, hoy } from './datos-catalogo';
import { LibroMock } from './libros.mock';

const TAMANIO_PAGINA = 20;
/** `biblioteca.catalogo.cantidad-novedades`: sin valor fijado; el prototipo muestra 4, como Figma 9:7. */
const CANTIDAD_NOVEDADES = 4;

/**
 * Catálogo público (RF6), sin sesión. En la Iteración 5: GET /catalogo/libros, /catalogo/opciones-filtro,
 * /catalogo/libros/{id} y /catalogo/novedades. Solo muestra libros activos (RF4.5 y RF4.7); la
 * disponibilidad se calcula con los ejemplares de `DatosCatalogo`, los mismos que administra RF5.
 */
@Service()
export class Catalogo {
  private readonly datos = inject(DatosCatalogo);
  private readonly estructura = inject(DatosEstructura);

  /** GET /catalogo/libros?q&idBiblioteca&idFacultad&materia&autor&disponibilidad&clasificacionDewey. */
  buscarLibros(filtro: FiltroCatalogo = {}): Observable<Pagina<LibroCatalogoResponse>> {
    const q = normalizar(filtro.q ?? '');
    const deFacultad =
      filtro.idFacultad == null
        ? null
        : this.estructura.idsBibliotecasDeFacultad(filtro.idFacultad);
    const coincidencias = this.activos()
      .filter((l) => {
        const ejemplares = this.ejemplaresDe(l.idLibro);
        const disponibles = ejemplares.filter((e) => e.estado === 'disponible').length;
        return (
          (!q ||
            [l.titulo, l.autor, l.materia, l.clasificacionDewey ?? ''].some((c) =>
              normalizar(c).includes(q),
            )) &&
          (filtro.idBiblioteca == null ||
            ejemplares.some((e) => e.idBiblioteca === filtro.idBiblioteca)) &&
          (deFacultad === null || ejemplares.some((e) => deFacultad.includes(e.idBiblioteca))) &&
          (filtro.materia == null || l.materia === filtro.materia) &&
          (filtro.autor == null || l.autor === filtro.autor) &&
          (filtro.clasificacionDewey == null ||
            l.clasificacionDewey === filtro.clasificacionDewey) &&
          (filtro.disponibilidad == null ||
            (filtro.disponibilidad === 'disponible') === disponibles > 0)
        );
      })
      .map((l) => this.aResultado(l));
    const pagina = filtro.pagina ?? 0;
    const tamanio = filtro.tamanio ?? TAMANIO_PAGINA;
    return of({
      contenido: coincidencias.slice(pagina * tamanio, (pagina + 1) * tamanio),
      pagina,
      tamanio,
      totalElementos: coincidencias.length,
    }).pipe(delay(DEMORA_MS));
  }

  /** GET /catalogo/opciones-filtro: valores distintos de los libros activos, en orden alfabético. */
  obtenerOpcionesFiltro(): Observable<OpcionesFiltroLibroResponse> {
    const libros = this.activos();
    const distintos = (valores: (string | null)[]) =>
      [...new Set(valores.filter((v): v is string => !!v))].sort((a, b) =>
        a.localeCompare(b, 'es'),
      );
    return of({
      materias: distintos(libros.map((l) => l.materia)),
      autores: distintos(libros.map((l) => l.autor)),
      clasificacionesDewey: distintos(libros.map((l) => l.clasificacionDewey)),
    }).pipe(delay(DEMORA_MS));
  }

  /** GET /catalogo/libros/{id}: registra la fecha de la visualización en registro_uso (RF6.1.2.5). */
  obtenerDetalle(idLibro: number): Observable<LibroDetalleResponse> {
    const libro = this.activos().find((l) => l.idLibro === idLibro);
    if (!libro) return noEncontrado();
    this.datos.registroUso.update((registros) => [...registros, { idLibro, fecha: hoy() }]);

    const ejemplares = this.ejemplaresDe(idLibro);
    const bibliotecas = this.estructura.bibliotecas();
    // Solo bibliotecas con algún ejemplar con ubicación física: sin ninguna, RF6.1.2.2 (curso alternativo).
    const conUbicacion = ejemplares.filter((e) => e.ubicacionFisica);
    const ubicaciones = [...new Set(conUbicacion.map((e) => e.idBiblioteca))]
      .map((idBiblioteca) => {
        const deBiblioteca = ejemplares.filter((e) => e.idBiblioteca === idBiblioteca);
        return {
          idBiblioteca,
          bibliotecaNombre: bibliotecas.find((b) => b.idBiblioteca === idBiblioteca)?.nombre ?? '',
          disponibles: deBiblioteca.filter((e) => e.estado === 'disponible').length,
          total: deBiblioteca.length,
        };
      })
      .sort((a, b) => a.bibliotecaNombre.localeCompare(b.bibliotecaNombre, 'es'));
    const { portada, fechaIncorporacion: _, estado: __, ...datos } = libro;
    return of({
      ...datos,
      portadaUrl: portada,
      ...this.cifras(idLibro),
      ubicaciones,
    }).pipe(delay(DEMORA_MS));
  }

  /** GET /catalogo/novedades: los libros activos incorporados más recientemente (RF6.2). */
  listarNovedades(): Observable<NovedadResponse[]> {
    const novedades = [...this.activos()]
      .sort(
        (a, b) => b.fechaIncorporacion.localeCompare(a.fechaIncorporacion) || b.idLibro - a.idLibro,
      )
      .slice(0, CANTIDAD_NOVEDADES)
      .map((l) => ({
        idLibro: l.idLibro,
        titulo: l.titulo,
        autor: l.autor,
        materia: l.materia,
        portadaUrl: l.portada,
        fechaIncorporacion: l.fechaIncorporacion,
      }));
    return of(novedades).pipe(delay(DEMORA_MS));
  }

  private activos(): LibroMock[] {
    return this.datos.libros().filter((l) => l.estado);
  }

  private ejemplaresDe(idLibro: number) {
    return this.datos.ejemplares().filter((e) => e.idLibro === idLibro);
  }

  private cifras(idLibro: number) {
    const ejemplares = this.ejemplaresDe(idLibro);
    return {
      ejemplaresDisponibles: ejemplares.filter((e) => e.estado === 'disponible').length,
      ejemplaresTotales: ejemplares.length,
    };
  }

  private aResultado(l: LibroMock): LibroCatalogoResponse {
    return {
      idLibro: l.idLibro,
      titulo: l.titulo,
      autor: l.autor,
      portadaUrl: l.portada,
      ...this.cifras(l.idLibro),
    };
  }
}
