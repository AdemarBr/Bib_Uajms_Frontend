import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';

import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { ModalConfirmacion } from '../../../../shared/components/modal-confirmacion/modal-confirmacion';
import { Paginador } from '../../../../shared/components/paginador/paginador';
import { Celda } from '../../../../shared/components/tabla/celda';
import { ColumnaTabla, Tabla } from '../../../../shared/components/tabla/tabla';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { TienePermiso } from '../../../../shared/directives/tiene-permiso';
import { FechaPipe } from '../../../../shared/pipes/fecha-pipe';
import { Prestamos } from '../../data-access/prestamos';
import { fechaAmpliada } from '../../fechas-prestamo';
import { PrestamoResponse } from '../../models/prestamo-response';

/**
 * P9.4 Préstamos a domicilio vigentes (RF9.2.7 y RF9.2.8; Figma 22:2118): fecha límite con «Vencido» o
 * «Vigente», cantidad de ampliaciones y «Ampliar plazo» (PRESTAMO_AMPLIAR), que abre la ventana con la fecha
 * vigente, las ampliaciones y la nueva fecha propuesta: max(fecha límite, hoy) + 7 días, de solo lectura.
 */
@Component({
  imports: [Alerta, Celda, FechaPipe, ModalConfirmacion, Paginador, Tabla, TienePermiso],
  selector: 'app-prestamos-domicilio',
  styleUrl: './prestamos-domicilio.css',
  templateUrl: './prestamos-domicilio.html',
})
export class PrestamosDomicilio {
  private readonly prestamos = inject(Prestamos);

  /** Columnas de Figma (140:134), de 160 px. */
  protected readonly columnas: ColumnaTabla[] = [
    { clave: 'usuarioNombre', titulo: 'Usuario', ancho: '160px' },
    { clave: 'ejemplar', titulo: 'Ejemplar', ancho: '160px' },
    { clave: 'fechaPrestamo', titulo: 'Fecha de préstamo', ancho: '160px' },
    { clave: 'fechaLimiteDevolucion', titulo: 'Fecha límite', ancho: '160px' },
    { clave: 'cantidadAmpliaciones', titulo: 'Ampliaciones', ancho: '160px' },
    { clave: 'acciones', titulo: 'Acciones', ancho: '160px' },
  ];

  protected readonly permisoAmpliar = PERMISOS.PRESTAMO_AMPLIAR;
  protected readonly pagina = signal(0);
  /** Se incrementa para volver a pedir la lista después de una ampliación. */
  private readonly recarga = signal(0);
  private readonly solicitud = computed(() => ({ pagina: this.pagina(), recarga: this.recarga() }));
  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly resultado = toSignal(
    toObservable(this.solicitud).pipe(
      switchMap(({ pagina }) =>
        this.prestamos
          .listarPrestamos({ tipoPrestamo: 'domicilio', estado: 'activo', pagina })
          .pipe(
            tap(() => this.error.set(null)),
            catchError((error: unknown) => {
              this.error.set(comoErrorRespuesta(error));
              return of(undefined);
            }),
          ),
      ),
    ),
  );

  /** Préstamo de la ventana «Ampliar plazo de préstamo» y la fecha propuesta al abrirla. */
  protected readonly ampliando = signal<{ prestamo: PrestamoResponse; fechaNueva: string } | null>(
    null,
  );
  protected readonly procesando = signal(false);
  /** Un error al ampliar se muestra dentro de la ventana, que sigue abierta. */
  protected readonly errorAmpliacion = signal<ErrorRespuesta | null>(null);

  protected ampliaciones(cantidad: number): string {
    if (cantidad === 0) return 'Sin ampliaciones';
    return cantidad === 1 ? '1 ampliación' : `${cantidad} ampliaciones`;
  }

  protected abrirAmpliacion(prestamo: PrestamoResponse): void {
    this.errorAmpliacion.set(null);
    this.ampliando.set({
      prestamo,
      fechaNueva: fechaAmpliada(prestamo.fechaLimiteDevolucion ?? ''),
    });
  }

  protected cerrar(): void {
    this.ampliando.set(null);
    this.errorAmpliacion.set(null);
  }

  protected confirmarAmpliacion(): void {
    const a = this.ampliando();
    if (!a) return;
    this.procesando.set(true);
    this.errorAmpliacion.set(null);
    this.prestamos.ampliarPlazo(a.prestamo.idPrestamo, { fechaNueva: a.fechaNueva }).subscribe({
      next: () => {
        this.procesando.set(false);
        this.ampliando.set(null);
        this.recarga.update((n) => n + 1);
      },
      error: (error: unknown) => {
        this.procesando.set(false);
        this.errorAmpliacion.set(comoErrorRespuesta(error));
      },
    });
  }
}
