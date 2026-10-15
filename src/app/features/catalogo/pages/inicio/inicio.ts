import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { Sesion } from '../../../../core/auth/sesion';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { FechaPipe } from '../../../../shared/pipes/fecha-pipe';
import { Bibliotecas } from '../../../estructura/data-access/bibliotecas';
import { BibliotecaResponse } from '../../../estructura/models/biblioteca-response';
import { Tarjeta } from '../../components/tarjeta/tarjeta';
import { Catalogo } from '../../data-access/catalogo';
import { NovedadResponse } from '../../models/novedad-response';

/**
 * P.1 Home, con y sin sesión: buscador del catálogo (RF6.1.5), novedades bibliográficas (RF6.2) y
 * bibliotecas disponibles (RF6.3). Si una sección no carga, muestra el error del servicio.
 */
@Component({
  imports: [ReactiveFormsModule, RouterLink, Alerta, FechaPipe, Tarjeta],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  private readonly router = inject(Router);
  /** Sin sesión, la página pone su propio padding (con sesión lo pone el layout). */
  protected readonly sesion = inject(Sesion);

  /** Tarjetas de 256 px con sesión (Figma 396:132) y de 280 px sin sesión (9:7). */
  protected readonly anchoTarjeta = computed(() => (this.sesion.haySesion() ? 256 : 280));

  protected readonly criterio = new FormControl('', { nonNullable: true });

  /** Error de cada sección: se muestran su título y detalle en lugar de las tarjetas. */
  protected readonly errorNovedades = signal<ErrorRespuesta | null>(null);
  protected readonly errorBibliotecas = signal<ErrorRespuesta | null>(null);

  /** `undefined` mientras carga o si falla. */
  protected readonly novedades = toSignal<NovedadResponse[] | undefined>(
    inject(Catalogo)
      .listarNovedades()
      .pipe(
        catchError((error: unknown) => {
          this.errorNovedades.set(comoErrorRespuesta(error));
          return of(undefined);
        }),
      ),
  );
  /** GET /bibliotecas: solo las activas (RF6.3.1). */
  protected readonly bibliotecas = toSignal<BibliotecaResponse[] | undefined>(
    inject(Bibliotecas)
      .listarBibliotecas()
      .pipe(
        catchError((error: unknown) => {
          this.errorBibliotecas.set(comoErrorRespuesta(error));
          return of(undefined);
        }),
      ),
  );

  /** RF6.1.5: el mismo buscador de P6.1; lleva a sus resultados. */
  protected buscar(): void {
    const q = this.criterio.value.trim();
    this.router.navigate(['/catalogo'], { queryParams: q ? { q } : {} });
  }
}
