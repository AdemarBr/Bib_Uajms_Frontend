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
import { Bibliotecas } from '../../../estructura/data-access/bibliotecas';
import { Facultades } from '../../../estructura/data-access/facultades';
import { Libros } from '../../data-access/libros';
import { FiltroLibros } from '../../models/filtro-libros';

const OPCIONES_ESTADO: OpcionSelect[] = [
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'inactivo', etiqueta: 'Inactivo' },
];

const comoOpciones = (valores: string[]): OpcionSelect[] =>
  valores.map((v) => ({ valor: v, etiqueta: v }));

/**
 * P4.3 Consultar libros registrados (RF4.3): búsqueda por título, autor o ISBN (RF4.3.1), filtros
 * (RF4.3.1.1), tabla paginada y enlace del título a P4.4 (RF4.3.5).
 */
@Component({
  imports: [ReactiveFormsModule, RouterLink, Alerta, Celda, Paginador, Select, Tabla, TienePermiso],
  selector: 'app-consultar-libros',
  styleUrl: './consultar-libros.css',
  templateUrl: './consultar-libros.html',
})
export class ConsultarLibros {
  private readonly libros = inject(Libros);

  protected readonly columnas: ColumnaTabla[] = [
    { clave: 'titulo', titulo: 'Título' },
    { clave: 'autor', titulo: 'Autor' },
    { clave: 'materia', titulo: 'Materia' },
    { clave: 'clasificacionDewey', titulo: 'Clasificación Dewey' },
    { clave: 'estado', titulo: 'Estado' },
  ];

  protected readonly opcionesEstado = OPCIONES_ESTADO;
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
  /** Materia, autor y clasificación: GET /libros/opciones-filtro. */
  private readonly opcionesFiltro = toSignal(this.libros.obtenerOpcionesFiltro());
  protected readonly opcionesMateria = computed(() =>
    comoOpciones(this.opcionesFiltro()?.materias ?? []),
  );
  protected readonly opcionesAutor = computed(() =>
    comoOpciones(this.opcionesFiltro()?.autores ?? []),
  );
  protected readonly opcionesDewey = computed(() =>
    comoOpciones(this.opcionesFiltro()?.clasificacionesDewey ?? []),
  );

  protected readonly busqueda = new FormControl('', { nonNullable: true });
  protected readonly filtros = new FormGroup({
    idBiblioteca: new FormControl<ValorSelect>(null),
    idFacultad: new FormControl<ValorSelect>(null),
    materia: new FormControl<ValorSelect>(null),
    autor: new FormControl<ValorSelect>(null),
    estado: new FormControl<ValorSelect>(null),
    clasificacionDewey: new FormControl<ValorSelect>(null),
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

  private readonly solicitud = computed<FiltroLibros>(() => {
    const { q, filtros: f } = this.valores();
    return {
      q: q.trim(),
      idBiblioteca: f.idBiblioteca as number | null,
      idFacultad: f.idFacultad as number | null,
      materia: f.materia as string | null,
      autor: f.autor as string | null,
      estado: f.estado === null ? null : f.estado === 'activo',
      clasificacionDewey: f.clasificacionDewey as string | null,
      pagina: this.pagina(),
    };
  });

  /** Error del servicio al listar: se muestran su título y detalle en lugar de la tabla. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly resultado = toSignal(
    toObservable(this.solicitud).pipe(
      switchMap((s) =>
        this.libros.listarLibros(s).pipe(
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
   * RF4.3.1.1 (filtros sin resultados; también si además hay búsqueda), RF4.3.1.4 (solo búsqueda sin
   * coincidencias) y RF4.3 (catálogo vacío, que invita a registrar o importar libros).
   */
  protected readonly mensajeVacio = computed(() => {
    if (this.hayFiltros()) return 'Ningún libro cumple los criterios seleccionados.';
    if (this.hayBusqueda()) return 'No se encontraron libros con ese criterio.';
    return 'No hay libros registrados en el catálogo.';
  });
  protected readonly catalogoVacio = computed(() => !this.hayFiltros() && !this.hayBusqueda());

  /** El título enlaza a P4.4 solo con el permiso de esa ruta; si no, se ve como texto plano. */
  protected readonly permisoEditar = PERMISOS.LIBRO_ACTUALIZAR;
  protected readonly permisoRegistrar = PERMISOS.LIBRO_REGISTRAR;
  protected readonly permisoImportar = PERMISOS.LIBRO_IMPORTAR;

  protected limpiarFiltros(): void {
    this.filtros.reset();
  }
}
