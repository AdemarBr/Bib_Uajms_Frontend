import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { Sesion } from '../../../../core/auth/sesion';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Paginador } from '../../../../shared/components/paginador/paginador';
import { OpcionSelect, Select, ValorSelect } from '../../../../shared/components/select/select';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Tarjeta } from '../../../catalogo/components/tarjeta/tarjeta';
import { Carreras } from '../../../estructura/data-access/carreras';
import { CatalogoTesis } from '../../data-access/catalogo-tesis';
import { FiltroTesis } from '../../models/filtro-tesis';

/**
 * P11.1 Consultar tesis digitales (RF11.1 y RF11.1.1; Figma 24:2659), pública: buscador único (se lanza con
 * Enter), filtros Carrera y Gestión (se aplican al cambiar) y tarjetas con título, autor, carrera y año. La
 * búsqueda y los filtros viven en la URL (`?q&idCarrera&gestion`), así «Volver al listado» de P11.2 regresa a los
 * mismos resultados.
 */
@Component({
  imports: [ReactiveFormsModule, RouterLink, Alerta, Paginador, Select, Tarjeta],
  selector: 'app-consultar-tesis-digitales',
  styleUrl: './consultar-tesis-digitales.css',
  templateUrl: './consultar-tesis-digitales.html',
})
export class ConsultarTesisDigitales {
  private readonly catalogo = inject(CatalogoTesis);
  private readonly router = inject(Router);
  /** Sin sesión, la página pone su propio padding (con sesión lo pone el layout). */
  protected readonly sesion = inject(Sesion);

  /** Parámetros de consulta. */
  readonly q = input<string>();
  readonly idCarrera = input<string>();
  readonly gestion = input<string>();

  /** Carrera: GET /carreras (solo activas). */
  protected readonly opcionesCarrera = toSignal(
    inject(Carreras)
      .listarCarreras()
      .pipe(map((lista) => lista.map((c) => ({ valor: c.idCarrera, etiqueta: c.nombre })))),
    { initialValue: [] },
  );
  /** Gestión: GET /catalogo/tesis/opciones-filtro (solo tesis activas). */
  private readonly opcionesFiltro = toSignal(this.catalogo.obtenerOpcionesFiltro());
  protected readonly opcionesGestion = computed<OpcionSelect[]>(() =>
    (this.opcionesFiltro()?.gestiones ?? []).map((g) => ({ valor: g, etiqueta: String(g) })),
  );

  protected readonly criterio = new FormControl('', { nonNullable: true });
  protected readonly filtros = new FormGroup({
    idCarrera: new FormControl<ValorSelect>(null),
    gestion: new FormControl<ValorSelect>(null),
  });

  protected readonly pagina = signal(0);

  private readonly busqueda = computed(() => this.q()?.trim() ?? '');
  private readonly carreraElegida = computed(() => Number(this.idCarrera()) || null);
  private readonly gestionElegida = computed(() => Number(this.gestion()) || null);
  protected readonly hayFiltros = computed(
    () => this.carreraElegida() !== null || this.gestionElegida() !== null,
  );

  private readonly solicitud = computed<FiltroTesis>(() => ({
    q: this.busqueda(),
    idCarrera: this.carreraElegida(),
    gestion: this.gestionElegida(),
    pagina: this.pagina(),
  }));

  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly resultado = toSignal(
    toObservable(this.solicitud).pipe(
      switchMap((s) =>
        this.catalogo.buscarTesis(s).pipe(
          tap(() => this.error.set(null)),
          catchError((error: unknown) => {
            this.error.set(comoErrorRespuesta(error));
            return of(undefined);
          }),
        ),
      ),
    ),
  );

  /** RF11.1.1 (filtros sin resultados), RF11.1 (sin coincidencias: sugiere modificar la búsqueda) y repositorio vacío. */
  protected readonly mensajeVacio = computed(() => {
    if (this.hayFiltros()) return 'Ninguna tesis cumple los criterios seleccionados.';
    if (this.busqueda()) {
      return 'No se encontraron tesis con ese criterio. Intente modificar la búsqueda.';
    }
    return 'Aún no hay tesis digitales en el repositorio.';
  });

  /** URL actual del listado, que P11.2 usa para «Volver al listado». */
  protected readonly urlListado = computed(() => {
    this.solicitud();
    return this.router.url;
  });

  constructor() {
    // La URL manda: al llegar (o al volver con «Atrás») el buscador y los filtros muestran sus criterios.
    effect(() => {
      this.criterio.setValue(this.busqueda(), { emitEvent: false });
      this.filtros.setValue(
        { idCarrera: this.carreraElegida(), gestion: this.gestionElegida() },
        { emitEvent: false },
      );
    });
    this.filtros.valueChanges.subscribe(() => this.aplicar());
  }

  /** RF11.1, paso 5: Enter lanza la búsqueda. */
  protected buscar(): void {
    this.aplicar();
  }

  protected limpiarFiltros(): void {
    this.filtros.reset();
  }

  private aplicar(): void {
    const f = this.filtros.getRawValue();
    this.pagina.set(0);
    this.router.navigate(['/tesis'], {
      queryParams: {
        q: this.criterio.value.trim() || null,
        idCarrera: f.idCarrera,
        gestion: f.gestion,
      },
    });
  }
}
