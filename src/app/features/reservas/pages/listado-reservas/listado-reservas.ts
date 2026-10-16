import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { Sesion } from '../../../../core/auth/sesion';
import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { ModalConfirmacion } from '../../../../shared/components/modal-confirmacion/modal-confirmacion';
import { Paginador } from '../../../../shared/components/paginador/paginador';
import { OpcionSelect, Select, ValorSelect } from '../../../../shared/components/select/select';
import { Celda } from '../../../../shared/components/tabla/celda';
import { ColumnaTabla, Tabla } from '../../../../shared/components/tabla/tabla';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { FechaPipe } from '../../../../shared/pipes/fecha-pipe';
import { Bibliotecas } from '../../../estructura/data-access/bibliotecas';
import { AdministrarReservas } from '../../data-access/administrar-reservas';
import { ESTADOS_RESERVA, EstadoReserva, esConfirmadaVigente } from '../../models/estado-reserva';
import { FiltroReservas } from '../../models/filtro-reservas';
import { ReservaResponse } from '../../models/reserva-response';

type Accion = 'confirmar' | 'rechazar' | 'cancelar' | 'prestar';
type Modalidad = 'sala' | 'domicilio';

/** Acción pendiente de confirmar en su ventana (modales de Figma 312:5314, 312:5338, 312:5362 y 243:3835). */
interface AccionPendiente {
  tipo: Accion;
  reserva: ReservaResponse;
  modalidad?: Modalidad;
}

/** Controles de los desplegables de una fila: Estado (RF8.6) y modalidad del préstamo (RF8.8). */
interface ControlesFila {
  estado: FormControl<ValorSelect>;
  modalidad: FormControl<ValorSelect>;
}

const OPCIONES_ESTADO: OpcionSelect[] = ESTADOS_RESERVA.map((e) => ({ valor: e, etiqueta: e }));

/**
 * P8.1 Listado de reservas registradas (RF8.1 a RF8.6 y RF8.8): búsqueda con «Buscar», filtros por
 * biblioteca (fijo en la del usuario si tiene una, RF8.2), estado y fechas, cambio de estado desde la fila y
 * acciones Confirmar, Rechazar, Cancelar y Prestar, cada una con su ventana de confirmación.
 */
@Component({
  imports: [
    ReactiveFormsModule,
    Alerta,
    Celda,
    FechaPipe,
    ModalConfirmacion,
    Paginador,
    Select,
    Tabla,
  ],
  selector: 'app-listado-reservas',
  styleUrl: './listado-reservas.css',
  templateUrl: './listado-reservas.html',
})
export class ListadoReservas {
  private readonly reservas = inject(AdministrarReservas);
  private readonly sesion = inject(Sesion);
  private readonly router = inject(Router);

  /** Anchos de Figma (22:1730). */
  protected readonly columnas: ColumnaTabla[] = [
    { clave: 'usuarioNombre', titulo: 'Usuario', ancho: '140px' },
    { clave: 'libroTitulo', titulo: 'Libro', ancho: '210px' },
    { clave: 'fecha', titulo: 'Fecha', ancho: '100px' },
    { clave: 'bibliotecaNombre', titulo: 'Biblioteca', ancho: '140px' },
    { clave: 'estado', titulo: 'Estado', ancho: '130px' },
    { clave: 'acciones', titulo: 'Acciones' },
  ];

  protected readonly opcionesEstado = OPCIONES_ESTADO;
  /** Solo bibliotecas activas (GET /bibliotecas). */
  protected readonly opcionesBiblioteca = toSignal(
    inject(Bibliotecas)
      .listarBibliotecas()
      .pipe(map((lista) => lista.map((b) => ({ valor: b.idBiblioteca, etiqueta: b.nombre })))),
    { initialValue: [] },
  );

  /** RF8.2: con biblioteca responsable, el filtro queda fijo en ella. */
  private readonly bibliotecaFija = this.reservas.bibliotecaDelUsuario();

  protected readonly criterio = new FormControl('', { nonNullable: true });
  private readonly busqueda = signal('');
  protected readonly filtros = new FormGroup({
    idBiblioteca: new FormControl<ValorSelect>({
      value: this.bibliotecaFija,
      disabled: this.bibliotecaFija !== null,
    }),
    estado: new FormControl<ValorSelect>(null),
    desde: new FormControl('', { nonNullable: true }),
    hasta: new FormControl('', { nonNullable: true }),
  });
  private readonly valoresFiltro = toSignal(
    this.filtros.valueChanges.pipe(
      map(() => this.filtros.getRawValue()),
      tap(() => this.pagina.set(0)),
    ),
    { initialValue: this.filtros.getRawValue() },
  );

  protected readonly pagina = signal(0);
  /** Se incrementa para volver a pedir la lista después de una acción. */
  private readonly recarga = signal(0);

  protected readonly hayCriterios = computed(() => {
    const f = this.valoresFiltro();
    const bibliotecaElegida = this.bibliotecaFija === null && f.idBiblioteca !== null;
    return (
      this.busqueda() !== '' || bibliotecaElegida || f.estado !== null || !!f.desde || !!f.hasta
    );
  });

  private readonly solicitud = computed<FiltroReservas>(() => {
    this.recarga();
    const f = this.valoresFiltro();
    return {
      q: this.busqueda(),
      idBiblioteca: f.idBiblioteca as number | null,
      estado: f.estado as EstadoReserva | null,
      desde: f.desde || null,
      hasta: f.hasta || null,
      pagina: this.pagina(),
    };
  });

  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly resultado = toSignal(
    toObservable(this.solicitud).pipe(
      switchMap((s) =>
        this.reservas.listarReservas(s).pipe(
          tap(() => this.error.set(null)),
          catchError((error: unknown) => {
            this.error.set(comoErrorRespuesta(error));
            return of(undefined);
          }),
        ),
      ),
    ),
  );

  /** RF8.1, curso alternativo, y filtros sin resultados. */
  protected readonly mensajeVacio = computed(() =>
    this.hayCriterios()
      ? 'Ninguna reserva cumple los criterios seleccionados.'
      : 'No hay solicitudes por atender.',
  );

  private readonly puede = (codigo: string) => this.sesion.tienePermiso(codigo);
  protected readonly puedeConfirmar = computed(() => this.puede(PERMISOS.RESERVA_CONFIRMAR));
  protected readonly puedeRechazar = computed(() => this.puede(PERMISOS.RESERVA_RECHAZAR));
  protected readonly puedeCancelar = computed(() => this.puede(PERMISOS.RESERVA_CANCELAR));
  /** RF8.8: solo las modalidades que el usuario puede registrar. */
  protected readonly opcionesModalidad = computed<OpcionSelect[]>(() => [
    ...(this.puede(PERMISOS.PRESTAMO_SALA_REGISTRAR)
      ? [{ valor: 'sala', etiqueta: 'En sala' }]
      : []),
    ...(this.puede(PERMISOS.PRESTAMO_DOMICILIO_REGISTRAR)
      ? [{ valor: 'domicilio', etiqueta: 'A domicilio' }]
      : []),
  ]);

  /** Desplegables de cada fila, recreados con cada página. */
  protected readonly controles = computed(() => {
    const mapa = new Map<number, ControlesFila>();
    for (const reserva of this.resultado()?.contenido ?? []) {
      const estado = new FormControl<ValorSelect>({
        value: null,
        disabled: this.transiciones(reserva).length === 0,
      });
      // RF8.6: elegir un estado abre la misma ventana que el botón de la acción.
      estado.valueChanges.subscribe((nuevo) => {
        if (nuevo === null) return;
        estado.setValue(null, { emitEvent: false });
        this.abrir(
          nuevo === 'Confirmada' ? 'confirmar' : nuevo === 'Rechazada' ? 'rechazar' : 'cancelar',
          reserva,
        );
      });
      mapa.set(reserva.idReserva, { estado, modalidad: new FormControl<ValorSelect>(null) });
    }
    return mapa;
  });

  /** Acción que espera confirmación en su ventana. */
  protected readonly pendiente = signal<AccionPendiente | null>(null);
  protected readonly motivo = new FormControl('', { nonNullable: true });
  protected readonly procesando = signal(false);
  /** Si la acción falla, la ventana sigue abierta con el error del servicio. */
  protected readonly errorAccion = signal<ErrorRespuesta | null>(null);

  protected readonly esConfirmadaVigente = esConfirmadaVigente;

  /** RF8.6.3: los estados permitidos desde el actual, según los permisos del usuario. */
  protected transiciones(reserva: ReservaResponse): OpcionSelect[] {
    const destinos: EstadoReserva[] = [];
    if (reserva.estado === 'Pendiente') {
      if (this.puedeConfirmar()) destinos.push('Confirmada');
      if (this.puedeRechazar()) destinos.push('Rechazada');
    } else if (esConfirmadaVigente(reserva) && this.puedeCancelar()) {
      destinos.push('Cancelada');
    }
    return destinos.map((e) => ({ valor: e, etiqueta: e }));
  }

  protected buscar(): void {
    this.pagina.set(0);
    this.busqueda.set(this.criterio.value.trim());
  }

  protected limpiarFiltros(): void {
    this.criterio.setValue('');
    this.busqueda.set('');
    this.filtros.reset({ idBiblioteca: this.bibliotecaFija, estado: null, desde: '', hasta: '' });
  }

  protected abrir(tipo: Accion, reserva: ReservaResponse): void {
    const modalidad = this.controles().get(reserva.idReserva)?.modalidad.value as Modalidad | null;
    this.motivo.setValue('');
    this.errorAccion.set(null);
    this.pendiente.set({ tipo, reserva, modalidad: modalidad ?? undefined });
  }

  protected cerrar(): void {
    this.pendiente.set(null);
    this.errorAccion.set(null);
  }

  /** Textos de las ventanas de Figma. */
  protected readonly ventana = computed(() => {
    const p = this.pendiente();
    if (!p) return null;
    const libro = p.reserva.libroTitulo;
    const usuario = p.reserva.usuarioNombre;
    switch (p.tipo) {
      case 'confirmar':
        return {
          titulo: 'Confirmar reserva',
          mensaje: `¿Confirmar la reserva de “${libro}” de ${usuario}? Se notificará al usuario.`,
          cancelar: 'Cancelar',
          confirmar: 'Confirmar',
          conMotivo: false,
        };
      case 'rechazar':
        return {
          titulo: 'Rechazar reserva',
          mensaje: `Reserva de “${libro}” de ${usuario}.`,
          cancelar: 'Cancelar',
          confirmar: 'Rechazar',
          conMotivo: true,
        };
      case 'cancelar':
        return {
          titulo: 'Cancelar reserva',
          mensaje: `Se cancelará la reserva de “${libro}” de ${usuario} y se liberará el material.`,
          cancelar: 'Volver',
          confirmar: 'Cancelar reserva',
          conMotivo: true,
        };
      case 'prestar':
        return {
          titulo: 'Confirmar préstamo',
          mensaje: `¿Confirmar el préstamo de "${libro}" a ${usuario} para retiro en la biblioteca seleccionada? Esta acción no se puede deshacer.`,
          cancelar: 'Cancelar',
          confirmar: 'Confirmar',
          conMotivo: false,
        };
    }
  });

  protected confirmarAccion(): void {
    const p = this.pendiente();
    if (!p) return;
    const id = p.reserva.idReserva;
    const motivo = { motivo: this.motivo.value.trim() || null };
    const llamada =
      p.tipo === 'confirmar'
        ? this.reservas.confirmar(id)
        : p.tipo === 'rechazar'
          ? this.reservas.rechazar(id, motivo)
          : p.tipo === 'cancelar'
            ? this.reservas.cancelarAdministrativa(id, motivo)
            : this.reservas.obtenerReservaVigente(id);
    this.procesando.set(true);
    this.errorAccion.set(null);
    llamada.subscribe({
      next: () => {
        this.procesando.set(false);
        this.pendiente.set(null);
        if (p.tipo === 'prestar') {
          // RF8.8, paso 10: P9.1 o P9.3 con la reserva precargada; la marca «atendida» la pone RF9.
          const ruta =
            p.modalidad === 'sala' ? '/prestamos/sala/registrar' : '/prestamos/domicilio/registrar';
          this.router.navigate([ruta], { queryParams: { idReserva: id } });
        } else {
          this.recarga.update((n) => n + 1);
        }
      },
      error: (error: unknown) => {
        this.procesando.set(false);
        this.errorAccion.set(comoErrorRespuesta(error));
      },
    });
  }
}
