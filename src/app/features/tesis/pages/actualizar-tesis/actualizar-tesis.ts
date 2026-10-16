import { Component, DestroyRef, OnInit, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs';

import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { ModalConfirmacion } from '../../../../shared/components/modal-confirmacion/modal-confirmacion';
import { OpcionSelect, Select } from '../../../../shared/components/select/select';
import { TienePermiso } from '../../../../shared/directives/tiene-permiso';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Carreras } from '../../../estructura/data-access/carreras';
import { Facultades } from '../../../estructura/data-access/facultades';
import { CarreraResponse } from '../../../estructura/models/carrera-response';
import { Tesis } from '../../data-access/tesis';
import {
  CampoFormularioTesis,
  aSolicitud,
  conectarCarreraFacultad,
  crearFormularioTesis,
  errorCampo,
  llenarFormulario,
} from '../../formulario-tesis';
import { TesisResponse } from '../../models/tesis-response';

/**
 * P10.4 Actualizar datos de tesis (RF10.4; Figma 24:2464), con «Desactivar tesis» (RF10.6) o «Activar tesis»
 * (RF10.7) y su ventana de confirmación, como P4.4. El estado se muestra como texto de solo lectura y el número
 * de inventario no se edita. «Guardar cambios» vuelve a P10.3 sin mensaje.
 */
@Component({
  imports: [ReactiveFormsModule, Alerta, ModalConfirmacion, Select, TienePermiso],
  selector: 'app-actualizar-tesis',
  styleUrl: './actualizar-tesis.css',
  templateUrl: './actualizar-tesis.html',
})
export class ActualizarTesis implements OnInit {
  private readonly servicio = inject(Tesis);
  private readonly router = inject(Router);

  /** Parámetro `:id` de la ruta. */
  readonly id = input.required<string>();

  protected readonly formulario = crearFormularioTesis();
  protected readonly tesis = signal<TesisResponse | null>(null);

  private readonly carrerasActivas = toSignal(inject(Carreras).listarCarreras(), {
    initialValue: [],
  });
  /** Las activas y, si la de la tesis está inactiva, también ella (como la biblioteca de P2.3). */
  private readonly carreras = computed<CarreraResponse[]>(() => {
    const t = this.tesis();
    const activas = this.carrerasActivas();
    if (!t || activas.some((c) => c.idCarrera === t.idCarrera)) return activas;
    return [
      ...activas,
      {
        idCarrera: t.idCarrera,
        nombre: `${t.carreraNombre} (inactiva)`,
        estado: false,
        idFacultad: t.idFacultad,
        facultadNombre: t.facultadNombre,
      },
    ];
  });
  private readonly facultadesActivas = toSignal(
    inject(Facultades)
      .listarFacultades()
      .pipe(map((lista) => lista.map((f) => ({ valor: f.idFacultad, etiqueta: f.nombre })))),
    { initialValue: [] },
  );
  protected readonly opcionesFacultad = computed<OpcionSelect[]>(() => {
    const t = this.tesis();
    const activas = this.facultadesActivas();
    if (!t || activas.some((f) => f.valor === t.idFacultad)) return activas;
    return [...activas, { valor: t.idFacultad, etiqueta: `${t.facultadNombre} (inactiva)` }];
  });
  private readonly facultad = toSignal(
    this.formulario.controls.idFacultad.valueChanges.pipe(startWith(null)),
    { initialValue: null },
  );
  protected readonly opcionesCarrera = computed<OpcionSelect[]>(() =>
    this.carreras()
      .filter((c) => this.facultad() === null || c.idFacultad === this.facultad())
      .map((c) => ({ valor: c.idCarrera, etiqueta: c.nombre })),
  );

  protected readonly enviando = signal(false);
  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly permisoEstado = PERMISOS.TESIS_CAMBIAR_ESTADO;
  /** Ventana de confirmación de RF10.6.5 o RF10.7.5. */
  protected readonly confirmandoEstado = signal(false);
  protected readonly procesandoEstado = signal(false);
  /** Si el cambio de estado falla, la ventana sigue abierta con el error del servicio. */
  protected readonly errorEstado = signal<ErrorRespuesta | null>(null);

  constructor() {
    conectarCarreraFacultad(this.formulario, this.carreras, inject(DestroyRef));
  }

  ngOnInit(): void {
    this.servicio.obtenerTesis(Number(this.id())).subscribe({
      next: (tesis) => {
        this.tesis.set(tesis);
        llenarFormulario(this.formulario, tesis);
        // RF10.4: el número de inventario no se modifica.
        this.formulario.controls.numeroInventario.disable();
      },
      error: (error: unknown) => this.error.set(comoErrorRespuesta(error)),
    });
  }

  protected mensajeCampo(campo: CampoFormularioTesis): string | null {
    return errorCampo(this.formulario, campo, this.error());
  }

  /** RF10.4, curso alternativo: con datos inválidos se señalan los campos y se conservan los anteriores. */
  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    this.servicio.actualizarTesis(Number(this.id()), aSolicitud(this.formulario)).subscribe({
      next: () => this.router.navigateByUrl('/gestion-tesis'),
      error: (error: unknown) => {
        this.enviando.set(false);
        this.error.set(comoErrorRespuesta(error));
      },
    });
  }

  /** RF10.6 y RF10.7: tras «Confirmar», la tesis cambia de estado y el botón pasa a la acción contraria. */
  protected confirmarCambioEstado(): void {
    const tesis = this.tesis();
    if (!tesis) return;
    this.procesandoEstado.set(true);
    this.errorEstado.set(null);
    this.servicio.cambiarEstado(tesis.idTesis, !tesis.estado).subscribe({
      next: () => {
        this.procesandoEstado.set(false);
        this.confirmandoEstado.set(false);
        this.tesis.set({ ...tesis, estado: !tesis.estado });
      },
      error: (error: unknown) => {
        this.procesandoEstado.set(false);
        this.errorEstado.set(comoErrorRespuesta(error));
      },
    });
  }

  /** Cursos alternativos de RF10.6 y RF10.7: «Cancelar» conserva el estado de la tesis. */
  protected cancelarCambioEstado(): void {
    this.confirmandoEstado.set(false);
    this.errorEstado.set(null);
  }
}
