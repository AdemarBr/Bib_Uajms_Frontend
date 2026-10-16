import { DestroyRef, Directive, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, debounceTime, filter, map, of, switchMap } from 'rxjs';

import { ErrorRespuesta, comoErrorRespuesta } from '../../shared/models/error-respuesta';
import { Catalogo } from '../catalogo/data-access/catalogo';
import { LibroCatalogoResponse } from '../catalogo/models/libro-catalogo-response';
import { AdministrarReservas } from '../reservas/data-access/administrar-reservas';
import { ReservaResponse } from '../reservas/models/reserva-response';
import { Prestamos } from './data-access/prestamos';
import { EjemplarPrestableResponse } from './models/ejemplar-prestable-response';
import { PrestamoResponse } from './models/prestamo-response';
import { PrestamoSalaRequest } from './models/prestamo-sala-request';

const MAXIMO_COINCIDENCIAS = 8;

/** Usuario verificado por RU (RF9.1.9 y RF9.2.13) o precargado desde la reserva (RF9.1.6 y RF9.2.10). */
export interface UsuarioPrestamo {
  ru: string;
  nombre: string;
  carreraNombre: string | null;
}

/**
 * Lógica común de P9.1 (en sala) y P9.3 (a domicilio): validación del RU con Enter o al salir del campo, sin
 * repetirla si el RU no cambió; búsqueda del libro por título, autor o ISBN; lista de ejemplares disponibles;
 * precarga desde una reserva confirmada (`?idReserva`, RF8.8); ventana «¿Cancelar el préstamo?» y registro.
 */
@Directive()
export abstract class RegistroPrestamo {
  protected readonly prestamos = inject(Prestamos);
  private readonly catalogo = inject(Catalogo);
  private readonly reservas = inject(AdministrarReservas);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** `?idReserva=N` desde «Prestar» de P8.1. */
  readonly idReserva = input<string>();

  protected readonly ru = new FormControl('', { nonNullable: true });
  /** Último RU enviado a validar: no se repite la validación si no cambió. */
  private ultimoRu = '';
  protected readonly validandoRu = signal(false);
  protected readonly usuario = signal<UsuarioPrestamo | null>(null);
  protected readonly errorRu = signal<ErrorRespuesta | null>(null);

  protected readonly busquedaLibro = new FormControl('', { nonNullable: true });
  /** Libros coincidentes (RF9.1.2, paso 2); null sin texto o con un libro ya elegido. */
  protected readonly coincidencias = signal<LibroCatalogoResponse[] | null>(null);
  protected readonly libro = signal<{ idLibro: number; titulo: string } | null>(null);
  protected readonly ejemplares = signal<EjemplarPrestableResponse[] | null>(null);
  protected readonly idEjemplar = signal<number | null>(null);
  protected readonly ejemplarElegido = computed(
    () => this.ejemplares()?.find((e) => e.idEjemplar === this.idEjemplar()) ?? null,
  );

  /** Reserva confirmada de la que viene el préstamo (RF8.8). */
  protected readonly reserva = signal<ReservaResponse | null>(null);

  protected readonly confirmandoCancelacion = signal(false);
  protected readonly enviando = signal(false);
  protected readonly error = signal<ErrorRespuesta | null>(null);
  /** Alerta de éxito con el nuevo estado del ejemplar (RF9.1.4.3 y RF9.2.6.3). */
  protected readonly exito = signal<{ titulo: string; mensaje: string } | null>(null);

  protected readonly listoParaRegistrar = computed(
    () => this.usuario() !== null && this.idEjemplar() !== null,
  );

  constructor() {
    this.busquedaLibro.valueChanges
      .pipe(
        debounceTime(250),
        switchMap((texto) => {
          const q = texto.trim();
          if (!q || this.libro() !== null) return of(null);
          return this.catalogo.buscarLibros({ q, tamanio: MAXIMO_COINCIDENCIAS }).pipe(
            map((pagina) => pagina.contenido),
            catchError((error: unknown) => {
              this.error.set(comoErrorRespuesta(error));
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((lista) => this.coincidencias.set(lista));

    // RF9.1.6 y RF9.2.10: con `?idReserva`, usuario y ejemplar precargados, sin pedir el RU.
    toObservable(this.idReserva)
      .pipe(
        map((id) => Number(id)),
        filter((id) => Number.isInteger(id) && id > 0),
        switchMap((id) =>
          this.reservas.obtenerReservaVigente(id).pipe(
            catchError((error: unknown) => {
              this.error.set(comoErrorRespuesta(error));
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((reserva) => {
        if (reserva) this.precargar(reserva);
      });
  }

  /** Registra el préstamo con los datos comunes; P9.3 agrega fecha límite y celular. */
  protected abstract enviar(datos: PrestamoSalaRequest): Observable<PrestamoResponse>;

  /** Validación propia del formulario de cada pantalla antes de enviar. */
  protected validarFormulario(): boolean {
    return true;
  }

  /** Limpia los campos propios de cada pantalla. */
  protected reiniciarPropios(): void {}

  /** RF9.1, paso 4: Enter o salir del campo; no se repite si el RU no cambió. */
  protected validarRu(): void {
    const ru = this.ru.value.trim();
    if (!ru || ru === this.ultimoRu) return;
    this.ultimoRu = ru;
    this.usuario.set(null);
    this.errorRu.set(null);
    this.validandoRu.set(true);
    this.prestamos
      .validarRu(ru)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (u) => {
          this.validandoRu.set(false);
          if (this.ru.value.trim() !== ru) return;
          this.usuario.set({ ru: u.ru, nombre: u.nombre, carreraNombre: u.carreraNombre });
        },
        error: (error: unknown) => {
          this.validandoRu.set(false);
          this.errorRu.set(comoErrorRespuesta(error));
        },
      });
  }

  /** Al escribir otro RU se descarta el usuario verificado. */
  protected alEscribirRu(): void {
    if (this.ru.value.trim() !== this.ultimoRu) {
      this.usuario.set(null);
      this.errorRu.set(null);
    }
  }

  /** Al escribir de nuevo en «Buscar libro» se descarta el libro elegido. */
  protected alEscribirLibro(): void {
    if (this.libro() === null) return;
    this.libro.set(null);
    this.ejemplares.set(null);
    this.idEjemplar.set(null);
  }

  protected elegirLibro(libro: { idLibro: number; titulo: string }): void {
    this.libro.set({ idLibro: libro.idLibro, titulo: libro.titulo });
    this.busquedaLibro.setValue(libro.titulo, { emitEvent: false });
    this.coincidencias.set(null);
    this.cargarEjemplares(libro.idLibro, null);
  }

  protected elegirEjemplar(idEjemplar: number): void {
    this.idEjemplar.set(idEjemplar);
  }

  protected registrar(): void {
    const usuario = this.usuario();
    const idEjemplar = this.idEjemplar();
    if (!usuario || idEjemplar === null || !this.validarFormulario()) return;
    this.enviando.set(true);
    this.error.set(null);
    this.exito.set(null);
    this.enviar({ ru: usuario.ru, idEjemplar, idReserva: this.reserva()?.idReserva ?? null })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (prestamo) => {
          this.enviando.set(false);
          const veniaDeReserva = this.reserva() !== null;
          this.reiniciar();
          this.exito.set({
            titulo: 'Préstamo registrado',
            mensaje: `El ejemplar ${prestamo.ejemplarCodigo} ahora está ${prestamo.ejemplarEstado}.`,
          });
          if (veniaDeReserva) this.router.navigate([], { queryParams: {}, replaceUrl: true });
        },
        error: (error: unknown) => {
          this.enviando.set(false);
          const respuesta = comoErrorRespuesta(error);
          this.error.set(respuesta);
          // 409: el ejemplar o la reserva cambiaron mientras tanto; se vuelve a pedir la lista de ejemplares.
          const libro = this.libro();
          if (respuesta.status === 409 && libro) {
            this.cargarEjemplares(libro.idLibro, this.reserva()?.idReserva ?? null, idEjemplar);
          }
        },
      });
  }

  /** RF9.1.8 y RF9.2.12: «Cancelar préstamo» descarta los datos; desde una reserva vuelve a P8.1. */
  protected confirmarCancelacion(): void {
    this.confirmandoCancelacion.set(false);
    if (this.reserva()) {
      this.router.navigate(['/reservas']);
      return;
    }
    this.reiniciar();
    this.exito.set(null);
  }

  private reiniciar(): void {
    this.ru.reset('');
    this.ru.enable();
    this.ultimoRu = '';
    this.usuario.set(null);
    this.errorRu.set(null);
    this.busquedaLibro.reset('', { emitEvent: false });
    this.coincidencias.set(null);
    this.libro.set(null);
    this.ejemplares.set(null);
    this.idEjemplar.set(null);
    this.reserva.set(null);
    this.error.set(null);
    this.reiniciarPropios();
  }

  private precargar(reserva: ReservaResponse): void {
    this.reserva.set(reserva);
    const ru = reserva.usuarioRu ?? '';
    this.ru.setValue(ru);
    this.ru.disable();
    this.ultimoRu = ru;
    this.usuario.set({
      ru,
      nombre: reserva.usuarioNombre,
      carreraNombre: reserva.usuarioCarreraNombre,
    });
    this.libro.set({ idLibro: reserva.idLibro, titulo: reserva.libroTitulo });
    this.busquedaLibro.setValue(reserva.libroTitulo, { emitEvent: false });
    this.cargarEjemplares(reserva.idLibro, reserva.idReserva, reserva.idEjemplar);
  }

  private cargarEjemplares(
    idLibro: number,
    idReserva: number | null,
    preseleccion: number | null = null,
  ): void {
    this.ejemplares.set(null);
    this.idEjemplar.set(null);
    this.prestamos
      .listarEjemplaresDisponibles(idLibro, idReserva)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (lista) => {
          if (this.libro()?.idLibro !== idLibro) return;
          this.ejemplares.set(lista);
          if (preseleccion !== null && lista.some((e) => e.idEjemplar === preseleccion)) {
            this.idEjemplar.set(preseleccion);
          }
        },
        error: (error: unknown) => this.error.set(comoErrorRespuesta(error)),
      });
  }
}
