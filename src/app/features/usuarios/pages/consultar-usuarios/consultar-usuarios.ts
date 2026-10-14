import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';

import { Sesion } from '../../../../core/auth/sesion';
import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Interruptor } from '../../../../shared/components/interruptor/interruptor';
import { ModalConfirmacion } from '../../../../shared/components/modal-confirmacion/modal-confirmacion';
import { Paginador } from '../../../../shared/components/paginador/paginador';
import { OpcionSelect, Select, ValorSelect } from '../../../../shared/components/select/select';
import { Celda } from '../../../../shared/components/tabla/celda';
import { ColumnaTabla, Tabla } from '../../../../shared/components/tabla/tabla';
import { TienePermiso } from '../../../../shared/directives/tiene-permiso';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { TipoUsuario } from '../../../../shared/models/login-response';
import { Bibliotecas } from '../../../estructura/data-access/bibliotecas';
import { Roles } from '../../data-access/roles';
import { Usuarios } from '../../data-access/usuarios';
import { FiltroUsuarios } from '../../models/filtro-usuarios';
import { UsuarioResponse } from '../../models/usuario-response';

const OPCIONES_ESTADO: OpcionSelect[] = [
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'inactivo', etiqueta: 'Inactivo' },
];

const OPCIONES_TIPO: OpcionSelect[] = [
  { valor: 'interno', etiqueta: 'Interno' },
  { valor: 'académico', etiqueta: 'Académico' },
];

/**
 * P2.2 Consultar usuarios del sistema (RF2.2): búsqueda (RF2.2.1), filtros (RF2.2.1.1),
 * enlace a P2.3 (RF2.2.5) e interruptor de estado con confirmación (RF2.6 y RF2.7).
 */
@Component({
  imports: [
    ReactiveFormsModule,
    Alerta,
    RouterLink,
    Celda,
    Interruptor,
    ModalConfirmacion,
    Paginador,
    Select,
    Tabla,
    TienePermiso,
  ],
  selector: 'app-consultar-usuarios',
  styleUrl: './consultar-usuarios.css',
  templateUrl: './consultar-usuarios.html',
})
export class ConsultarUsuarios {
  private readonly usuarios = inject(Usuarios);
  private readonly sesion = inject(Sesion);

  protected readonly columnas: ColumnaTabla[] = [
    { clave: 'nombre', titulo: 'Nombre / Usuario', ancho: '160px' },
    { clave: 'tipoUsuario', titulo: 'Tipo de usuario', ancho: '160px' },
    { clave: 'rolNombre', titulo: 'Rol', ancho: '160px' },
    { clave: 'estado', titulo: 'Estado', ancho: '160px' },
    { clave: 'biblioteca', titulo: 'Biblioteca' },
  ];

  protected readonly opcionesEstado = OPCIONES_ESTADO;
  protected readonly opcionesTipo = OPCIONES_TIPO;
  protected readonly opcionesRol = toSignal(
    inject(Roles)
      .listarRoles()
      .pipe(map((roles) => roles.map((r) => ({ valor: r.idRol, etiqueta: r.nombre })))),
    { initialValue: [] },
  );
  protected readonly opcionesBiblioteca = toSignal(
    inject(Bibliotecas)
      .listarBibliotecas()
      .pipe(map((lista) => lista.map((b) => ({ valor: b.idBiblioteca, etiqueta: b.nombre })))),
    { initialValue: [] },
  );

  protected readonly filtros = new FormGroup({
    q: new FormControl('', { nonNullable: true }),
    idRol: new FormControl<ValorSelect>(null),
    estado: new FormControl<ValorSelect>(null),
    tipoUsuario: new FormControl<ValorSelect>(null),
    idBiblioteca: new FormControl<ValorSelect>(null),
  });

  protected readonly pagina = signal(0);
  /** Se incrementa para volver a pedir la página después de cambiar un estado. */
  private readonly recarga = signal(0);

  private readonly valoresFiltro = toSignal(
    this.filtros.valueChanges.pipe(
      debounceTime(250),
      map(() => this.filtros.getRawValue()),
      tap(() => this.pagina.set(0)),
    ),
    { initialValue: this.filtros.getRawValue() },
  );

  protected readonly hayCriterios = computed(() => {
    const f = this.valoresFiltro();
    return (
      f.q.trim() !== '' ||
      f.idRol !== null ||
      f.estado !== null ||
      f.tipoUsuario !== null ||
      f.idBiblioteca !== null
    );
  });

  private readonly solicitud = computed<FiltroUsuarios>(() => {
    this.recarga();
    const f = this.valoresFiltro();
    return {
      q: f.q.trim(),
      idRol: f.idRol as number | null,
      estado: f.estado === null ? null : f.estado === 'activo',
      tipoUsuario: f.tipoUsuario as TipoUsuario | null,
      idBiblioteca: f.idBiblioteca as number | null,
      pagina: this.pagina(),
    };
  });

  /** Error del servicio al listar: se muestran su título y detalle en lugar de la tabla. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly resultado = toSignal(
    toObservable(this.solicitud).pipe(
      switchMap((s) =>
        this.usuarios.listarUsuarios(s).pipe(
          tap(() => this.error.set(null)),
          catchError((error: unknown) => {
            this.error.set(comoErrorRespuesta(error));
            return of(undefined);
          }),
        ),
      ),
    ),
  );

  /** RF2.2 (curso alternativo) y RF2.2.1.5. */
  protected readonly mensajeVacio = computed(() =>
    this.hayCriterios()
      ? 'Ningún usuario cumple los criterios seleccionados.'
      : 'No hay usuarios internos registrados.',
  );

  protected readonly puedeEditar = computed(() =>
    this.sesion.tienePermiso(PERMISOS.USUARIO_ACTUALIZAR),
  );
  protected readonly puedeCambiarEstado = computed(() =>
    this.sesion.tienePermiso(PERMISOS.USUARIO_CAMBIAR_ESTADO),
  );
  protected readonly permisoRegistrar = PERMISOS.USUARIO_REGISTRAR;

  /** Usuario cuyo cambio de estado espera confirmación. */
  protected readonly pendiente = signal<UsuarioResponse | null>(null);
  protected readonly procesando = signal(false);
  /** Si el cambio de estado falla, el modal sigue abierto con el error del servicio. */
  protected readonly errorEstado = signal<ErrorRespuesta | null>(null);

  protected limpiarFiltros(): void {
    this.filtros.reset();
  }

  protected confirmarCambioEstado(): void {
    const usuario = this.pendiente();
    if (!usuario) return;
    this.procesando.set(true);
    this.errorEstado.set(null);
    this.usuarios.cambiarEstado(usuario.idUsuario, !usuario.estado).subscribe({
      next: () => {
        this.procesando.set(false);
        this.pendiente.set(null);
        this.recarga.update((n) => n + 1);
      },
      error: (error: unknown) => {
        this.procesando.set(false);
        this.errorEstado.set(comoErrorRespuesta(error));
      },
    });
  }

  protected cancelarCambioEstado(): void {
    this.pendiente.set(null);
    this.errorEstado.set(null);
  }
}
