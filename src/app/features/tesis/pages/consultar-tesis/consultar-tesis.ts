import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';

import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Paginador } from '../../../../shared/components/paginador/paginador';
import { OpcionSelect, Select, ValorSelect } from '../../../../shared/components/select/select';
import { Celda } from '../../../../shared/components/tabla/celda';
import { ColumnaTabla, Tabla } from '../../../../shared/components/tabla/tabla';
import { TienePermiso } from '../../../../shared/directives/tiene-permiso';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Carreras } from '../../../estructura/data-access/carreras';
import { Tesis } from '../../data-access/tesis';
import { FiltroTesis } from '../../models/filtro-tesis';

/**
 * P10.3 Consultar tesis registradas (RF10.3, RF10.3.1 y RF10.3.1.1; Figma 24:2371): búsqueda por título, autor o
 * número de inventario, filtros Carrera y Gestión, tabla paginada; el título enlaza a P10.4 y «Acciones» lleva a
 * P10.2 y P10.5, cada uno con el permiso de su ruta.
 */
@Component({
  imports: [ReactiveFormsModule, RouterLink, Alerta, Celda, Paginador, Select, Tabla, TienePermiso],
  selector: 'app-consultar-tesis',
  styleUrl: './consultar-tesis.css',
  templateUrl: './consultar-tesis.html',
})
export class ConsultarTesis {
  private readonly tesis = inject(Tesis);

  /** Columnas de Figma (350:705), de 160 px, más «Acciones» (decisión del estudiante). */
  protected readonly columnas: ColumnaTabla[] = [
    { clave: 'titulo', titulo: 'Título', ancho: '160px' },
    { clave: 'autor', titulo: 'Autor(es)', ancho: '160px' },
    { clave: 'carreraNombre', titulo: 'Carrera', ancho: '160px' },
    { clave: 'facultadNombre', titulo: 'Facultad', ancho: '160px' },
    { clave: 'gestion', titulo: 'Gestión', ancho: '160px' },
    { clave: 'estado', titulo: 'Estado', ancho: '160px' },
    { clave: 'acciones', titulo: 'Acciones' },
  ];

  /** Carrera: GET /carreras (solo activas). */
  protected readonly opcionesCarrera = toSignal(
    inject(Carreras)
      .listarCarreras()
      .pipe(map((lista) => lista.map((c) => ({ valor: c.idCarrera, etiqueta: c.nombre })))),
    { initialValue: [] },
  );
  /** Gestión: GET /tesis/opciones-filtro. */
  private readonly opcionesFiltro = toSignal(this.tesis.obtenerOpcionesFiltro());
  protected readonly opcionesGestion = computed<OpcionSelect[]>(() =>
    (this.opcionesFiltro()?.gestiones ?? []).map((g) => ({ valor: g, etiqueta: String(g) })),
  );

  protected readonly busqueda = new FormControl('', { nonNullable: true });
  protected readonly filtros = new FormGroup({
    idCarrera: new FormControl<ValorSelect>(null),
    gestion: new FormControl<ValorSelect>(null),
  });
  private readonly criterios = new FormGroup({ q: this.busqueda, filtros: this.filtros });

  protected readonly pagina = signal(0);

  private readonly valores = toSignal(
    this.criterios.valueChanges.pipe(
      debounceTime(250),
      map(() => this.criterios.getRawValue()),
      tap(() => this.pagina.set(0)),
    ),
    { initialValue: this.criterios.getRawValue() },
  );

  private readonly hayBusqueda = computed(() => this.valores().q.trim() !== '');
  protected readonly hayFiltros = computed(() =>
    Object.values(this.valores().filtros).some((v) => v !== null),
  );

  private readonly solicitud = computed<FiltroTesis>(() => {
    const { q, filtros: f } = this.valores();
    return {
      q: q.trim(),
      idCarrera: f.idCarrera as number | null,
      gestion: f.gestion as number | null,
      pagina: this.pagina(),
    };
  });

  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly resultado = toSignal(
    toObservable(this.solicitud).pipe(
      switchMap((s) =>
        this.tesis.listarTesis(s).pipe(
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
   * RF10.3.1.1 (filtros sin resultados, también con búsqueda), RF10.3.1.4 (solo búsqueda sin coincidencias) y
   * RF10.3 (sin tesis, invita a registrar la primera).
   */
  protected readonly mensajeVacio = computed(() => {
    if (this.hayFiltros()) return 'Ninguna tesis cumple los criterios seleccionados.';
    if (this.hayBusqueda()) return 'No se encontraron tesis con ese criterio.';
    return 'Aún no hay tesis registradas.';
  });
  protected readonly repositorioVacio = computed(() => !this.hayFiltros() && !this.hayBusqueda());

  protected readonly permisoEditar = PERMISOS.TESIS_ACTUALIZAR;
  protected readonly permisoRegistrar = PERMISOS.TESIS_REGISTRAR;
  protected readonly permisoCargar = PERMISOS.TESIS_DOCUMENTO_CARGAR;
  protected readonly permisoReemplazar = PERMISOS.TESIS_DOCUMENTO_ACTUALIZAR;

  protected limpiarFiltros(): void {
    this.filtros.reset();
  }
}
