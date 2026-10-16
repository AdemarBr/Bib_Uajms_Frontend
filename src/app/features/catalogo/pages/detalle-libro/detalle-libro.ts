import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EMPTY, catchError, switchMap, tap } from 'rxjs';

import { Sesion } from '../../../../core/auth/sesion';
import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { BadgeEstado } from '../../../../shared/components/badge-estado/badge-estado';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Catalogo } from '../../data-access/catalogo';
import { LibroDetalleResponse } from '../../models/libro-detalle-response';

/**
 * P6.2 Detalle del libro (RF6.1.2), pública: portada (RF6.1.2.3), datos bibliográficos, disponibilidad
 * (RF6.1.2.1), ubicación física (RF6.1.2.2) y «Reservar» (RF6.1.2.4). Abrirla registra la visualización.
 */
@Component({
  imports: [Alerta, BadgeEstado],
  selector: 'app-detalle-libro',
  styleUrl: './detalle-libro.css',
  templateUrl: './detalle-libro.html',
})
export class DetalleLibro {
  private readonly catalogo = inject(Catalogo);
  private readonly router = inject(Router);
  /** Sin sesión, la página pone su propio padding (con sesión lo pone el layout). */
  protected readonly sesion = inject(Sesion);

  /** Parámetro `:id` de la ruta. */
  readonly id = input.required<string>();

  protected readonly libro = signal<LibroDetalleResponse | null>(null);
  protected readonly error = signal<ErrorRespuesta | null>(null);

  /** «Autor: …  ·  Editorial: …  ·  Materia: …» (Figma 22:1448). */
  protected readonly datosBibliograficos = computed(() => {
    const l = this.libro();
    if (!l) return '';
    return [
      `Autor: ${l.autor}`,
      l.editorial ? `Editorial: ${l.editorial}` : null,
      `Materia: ${l.materia}`,
    ]
      .filter(Boolean)
      .join('  ·  ');
  });

  /** RF6.1.2.1: «Disponible (2 de 3 ejemplares)» o «No disponible (0 de 3 ejemplares)». */
  protected readonly disponibilidad = computed(() => {
    const l = this.libro();
    if (!l) return '';
    const estado = l.ejemplaresDisponibles > 0 ? 'Disponible' : 'No disponible';
    const ejemplares = l.ejemplaresTotales === 1 ? 'ejemplar' : 'ejemplares';
    return `${estado} (${l.ejemplaresDisponibles} de ${l.ejemplaresTotales} ${ejemplares})`;
  });

  /**
   * RF6.1.2.4: un visitante ve «Reservar» (lo lleva a iniciar sesión y vuelve); con sesión, solo quien
   * tiene RESERVA_REALIZAR.
   */
  protected readonly puedeReservar = computed(
    () => !this.sesion.haySesion() || this.sesion.tienePermiso(PERMISOS.RESERVA_REALIZAR),
  );

  /**
   * Carga el libro de `:id` y vuelve a cargarlo si cambia sin salir de la pantalla (por ejemplo, con
   * «atrás» o «adelante» entre dos detalles, que reutilizan este componente).
   */
  constructor() {
    toObservable(this.id)
      .pipe(
        tap(() => {
          this.libro.set(null);
          this.error.set(null);
        }),
        switchMap((id) =>
          this.catalogo.obtenerDetalle(Number(id)).pipe(
            catchError((error: unknown) => {
              this.error.set(comoErrorRespuesta(error));
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((libro) => this.libro.set(libro));
  }

  /** P7.1 Confirmar reserva de libro (RF7.1). */
  protected reservar(): void {
    this.router.navigate(['/mis-reservas/nueva', this.id()]);
  }
}
