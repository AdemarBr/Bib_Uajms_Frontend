import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';

import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { BadgeEstado } from '../../../../shared/components/badge-estado/badge-estado';
import { Paginador } from '../../../../shared/components/paginador/paginador';
import { OpcionSelect, Select, ValorSelect } from '../../../../shared/components/select/select';
import { Celda } from '../../../../shared/components/tabla/celda';
import { ColumnaTabla, Tabla } from '../../../../shared/components/tabla/tabla';
import { TienePermiso } from '../../../../shared/directives/tiene-permiso';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { EstadoEjemplarPipe } from '../../../../shared/pipes/estado-ejemplar-pipe';
import { Bibliotecas } from '../../../estructura/data-access/bibliotecas';
import { Facultades } from '../../../estructura/data-access/facultades';
import { Ejemplares } from '../../data-access/ejemplares';
import { ESTADOS_EJEMPLAR, EstadoEjemplar } from '../../models/estado-ejemplar';
import { FiltroEjemplares } from '../../models/filtro-ejemplares';

/** Valor de la opción «Sin ubicación asignada» del filtro Ubicación (se envía como `sinUbicacion=true`). */
const SIN_UBICACION = '__sin-ubicacion__';

const estadoEjemplar = new EstadoEjemplarPipe();

const OPCIONES_ESTADO: OpcionSelect[] = ESTADOS_EJEMPLAR.map((e) => ({
  valor: e,
  etiqueta: estadoEjemplar.transform(e),
}));

const OPCIONES_DISPONIBILIDAD: OpcionSelect[] = [
  { valor: 'si', etiqueta: 'Disponible' },
  { valor: 'no', etiqueta: 'No disponible' },
];

/**
 * P5.2 Consultar ejemplares registrados (RF5.3): búsqueda por código o título (RF5.3.1), filtros
 * (RF5.3.1.1), disponibilidad con etiqueta de color (RF5.6), ubicación (RF5.7) y enlace del código a P5.3.
 */
@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Alerta,
    BadgeEstado,
    Celda,
    EstadoEjemplarPipe,
    Paginador,
    Select,
    Tabla,
    TienePermiso,
  ],
  selector: 'app-consultar-ejemplares',
  styleUrl: './consultar-ejemplares.css',
  templateUrl: './consultar-ejemplares.html',
})
export class ConsultarEjemplares {
  private readonly ejemplares = inject(Ejemplares);

  protected readonly columnas: ColumnaTabla[] = [
    { clave: 'codigoEjemplar', titulo: 'Código' },
    { clave: 'libroTitulo', titulo: 'Libro' },
    { clave: 'bibliotecaNombre', titulo: 'Biblioteca' },
    { clave: 'ubicacionFisica', titulo: 'Ubicación' },
    { clave: 'estado', titulo: 'Estado' },
    { clave: 'disponible', titulo: 'Disponibilidad' },
  ];

  protected readonly opcionesEstado = OPCIONES_ESTADO;
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
  /** Ubicación: «Sin ubicación asignada» y las de GET /ejemplares/opciones-filtro. */
  protected readonly opcionesUbicacion = toSignal(
    this.ejemplares
      .obtenerOpcionesFiltro()
      .pipe(
        map((o) => [
          { valor: SIN_UBICACION, etiqueta: 'Sin ubicación asignada' },
          ...o.ubicaciones.map((u) => ({ valor: u, etiqueta: u })),
        ]),
      ),
    { initialValue: [] },
  );

  protected readonly busqueda = new FormControl('', { nonNullable: true });
  protected readonly filtros = new FormGroup({
    idBiblioteca: new FormControl<ValorSelect>(null),
    idFacultad: new FormControl<ValorSelect>(null),
    estado: new FormControl<ValorSelect>(null),
    disponible: new FormControl<ValorSelect>(null),
    ubicacion: new FormControl<ValorSelect>(null),
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

  private readonly solicitud = computed<FiltroEjemplares>(() => {
    const { q, filtros: f } = this.valores();
    const sinUbicacion = f.ubicacion === SIN_UBICACION;
    return {
      q: q.trim(),
      idBiblioteca: f.idBiblioteca as number | null,
      idFacultad: f.idFacultad as number | null,
      estado: f.estado as EstadoEjemplar | null,
      disponible: f.disponible === null ? null : f.disponible === 'si',
      ubicacion: sinUbicacion ? null : (f.ubicacion as string | null),
      sinUbicacion: sinUbicacion || null,
      pagina: this.pagina(),
    };
  });

  /** Error del servicio al listar: se muestran su título y detalle en lugar de la tabla. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly resultado = toSignal(
    toObservable(this.solicitud).pipe(
      switchMap((s) =>
        this.ejemplares.listarEjemplares(s).pipe(
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
   * RF5.3.1.1 (filtros sin resultados; también si además hay búsqueda), RF5.3.1.4 (solo búsqueda sin
   * coincidencias) y RF5.3 (sin ejemplares, invita a registrarlos).
   */
  protected readonly mensajeVacio = computed(() => {
    if (this.hayFiltros()) return 'Ningún ejemplar cumple los criterios seleccionados.';
    if (this.hayBusqueda()) return 'No se encontraron ejemplares con ese criterio.';
    return 'No hay ejemplares registrados.';
  });
  protected readonly sinEjemplares = computed(() => !this.hayFiltros() && !this.hayBusqueda());

  /** El código enlaza a P5.3 solo con el permiso de esa ruta; si no, se ve como texto plano. */
  protected readonly permisoEditar = PERMISOS.EJEMPLAR_ACTUALIZAR;
  protected readonly permisoRegistrar = PERMISOS.EJEMPLAR_REGISTRAR;

  protected limpiarFiltros(): void {
    this.filtros.reset();
  }
}
