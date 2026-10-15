import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { Sesion } from '../../../../core/auth/sesion';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { BadgeEstado } from '../../../../shared/components/badge-estado/badge-estado';
import { Paginador } from '../../../../shared/components/paginador/paginador';
import { OpcionSelect, Select, ValorSelect } from '../../../../shared/components/select/select';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Bibliotecas } from '../../../estructura/data-access/bibliotecas';
import { Facultades } from '../../../estructura/data-access/facultades';
import { Tarjeta } from '../../components/tarjeta/tarjeta';
import { Catalogo } from '../../data-access/catalogo';
import { Disponibilidad, FiltroCatalogo } from '../../models/filtro-catalogo';

const OPCIONES_DISPONIBILIDAD: OpcionSelect[] = [
  { valor: 'disponible', etiqueta: 'Disponible' },
  { valor: 'no_disponible', etiqueta: 'No disponible' },
];

const comoOpciones = (valores: string[]): OpcionSelect[] =>
  valores.map((v) => ({ valor: v, etiqueta: v }));

/**
 * P6.1 Buscar material bibliográfico (RF6.1), pública: buscador único con «Buscar» (RF6.1.3 y RF6.1.5),
 * filtros (RF6.1.1) y resultados con portada, título, autor y disponibilidad (RF6.1.4). Acepta `?q=` (desde
 * el buscador de Home) e `?idBiblioteca=` (desde las tarjetas de bibliotecas de Home, RF6.3.5).
 */
@Component({
  imports: [ReactiveFormsModule, RouterLink, Alerta, BadgeEstado, Paginador, Select, Tarjeta],
  selector: 'app-buscar-catalogo',
  styleUrl: './buscar-catalogo.css',
  templateUrl: './buscar-catalogo.html',
})
export class BuscarCatalogo implements OnInit {
  private readonly catalogo = inject(Catalogo);
  /** Sin sesión, la página pone su propio padding (con sesión lo pone el layout). */
  protected readonly sesion = inject(Sesion);

  /** Parámetros de consulta `?q=` e `?idBiblioteca=`. */
  readonly q = input<string>();
  readonly idBiblioteca = input<string>();

  protected readonly opcionesDisponibilidad = OPCIONES_DISPONIBILIDAD;
  /** Biblioteca y facultad: GET /bibliotecas y GET /facultades (solo activas). */
  protected readonly opcionesBiblioteca = toSignal(
    inject(Bibliotecas)
      .listarBibliotecas()
      .pipe(map((lista) => lista.map((b) => ({ valor: b.idBiblioteca, etiqueta: b.nombre })))),
    { initialValue: [] },
  );
  protected readonly opcionesFacultad = toSignal(
    inject(Facultades)
      .listarFacultades()
      .pipe(map((lista) => lista.map((f) => ({ valor: f.idFacultad, etiqueta: f.nombre })))),
    { initialValue: [] },
  );
  /** Materia, autor y clasificación: GET /catalogo/opciones-filtro (solo libros activos). */
  private readonly opcionesFiltro = toSignal(this.catalogo.obtenerOpcionesFiltro());
  protected readonly opcionesMateria = computed(() =>
    comoOpciones(this.opcionesFiltro()?.materias ?? []),
  );
  protected readonly opcionesAutor = computed(() =>
    comoOpciones(this.opcionesFiltro()?.autores ?? []),
  );
  protected readonly opcionesDewey = computed(() =>
    comoOpciones(this.opcionesFiltro()?.clasificacionesDewey ?? []),
  );

  /** Texto del buscador; se aplica al hacer clic en «Buscar» (RF6.1, paso 5). */
  protected readonly criterio = new FormControl('', { nonNullable: true });
  private readonly busqueda = signal('');

  protected readonly filtros = new FormGroup({
    idBiblioteca: new FormControl<ValorSelect>(null),
    idFacultad: new FormControl<ValorSelect>(null),
    materia: new FormControl<ValorSelect>(null),
    autor: new FormControl<ValorSelect>(null),
    disponibilidad: new FormControl<ValorSelect>(null),
    clasificacionDewey: new FormControl<ValorSelect>(null),
  });
  private readonly valoresFiltro = toSignal(
    this.filtros.valueChanges.pipe(
      map(() => this.filtros.getRawValue()),
      tap(() => this.pagina.set(0)),
    ),
    { initialValue: this.filtros.getRawValue() },
  );

  protected readonly pagina = signal(0);

  protected readonly hayFiltros = computed(() =>
    Object.values(this.valoresFiltro()).some((v) => v !== null),
  );
  private readonly hayBusqueda = computed(() => this.busqueda() !== '');

  private readonly solicitud = computed<FiltroCatalogo>(() => {
    const f = this.valoresFiltro();
    return {
      q: this.busqueda(),
      idBiblioteca: f.idBiblioteca as number | null,
      idFacultad: f.idFacultad as number | null,
      materia: f.materia as string | null,
      autor: f.autor as string | null,
      disponibilidad: f.disponibilidad as Disponibilidad | null,
      clasificacionDewey: f.clasificacionDewey as string | null,
      pagina: this.pagina(),
    };
  });

  /** Error del servicio al buscar: se muestran su título y detalle en lugar de los resultados. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly resultado = toSignal(
    toObservable(this.solicitud).pipe(
      switchMap((s) =>
        this.catalogo.buscarLibros(s).pipe(
          tap(() => this.error.set(null)),
          catchError((error: unknown) => {
            this.error.set(comoErrorRespuesta(error));
            return of(undefined);
          }),
        ),
      ),
    ),
  );

  /**
   * RF6.1.1 (filtros sin resultados; también si además hay búsqueda), RF6.1 (búsqueda sin coincidencias:
   * sugiere modificarla) y RF6 (catálogo vacío).
   */
  protected readonly mensajeVacio = computed(() => {
    if (this.hayFiltros()) return 'Ningún material cumple los criterios seleccionados.';
    if (this.hayBusqueda()) {
      return 'No se encontró material con ese criterio. Intente modificar la búsqueda.';
    }
    return 'Aún no hay material bibliográfico en el catálogo.';
  });

  ngOnInit(): void {
    const q = this.q()?.trim() ?? '';
    this.criterio.setValue(q);
    this.busqueda.set(q);
    const idBiblioteca = Number(this.idBiblioteca());
    if (idBiblioteca) this.filtros.controls.idBiblioteca.setValue(idBiblioteca);
  }

  protected buscar(): void {
    this.pagina.set(0);
    this.busqueda.set(this.criterio.value.trim());
  }

  protected limpiarFiltros(): void {
    this.filtros.reset();
  }
}
