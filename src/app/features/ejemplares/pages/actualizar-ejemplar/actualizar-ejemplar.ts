import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { Sesion } from '../../../../core/auth/sesion';
import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { OpcionSelect, Select, ValorSelect } from '../../../../shared/components/select/select';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { EstadoEjemplarPipe } from '../../../../shared/pipes/estado-ejemplar-pipe';
import { Bibliotecas } from '../../../estructura/data-access/bibliotecas';
import { Ejemplares } from '../../data-access/ejemplares';
import { VALIDADORES_CODIGO, VALIDADORES_UBICACION, mensajeCampo } from '../../formulario-ejemplar';
import { ESTADOS_EJEMPLAR, EstadoEjemplar } from '../../models/estado-ejemplar';

const estadoEjemplar = new EstadoEjemplarPipe();

type CampoEjemplar = 'codigoEjemplar' | 'idBiblioteca' | 'ubicacionFisica' | 'estado';

/**
 * P5.3 Actualizar datos del ejemplar (RF5.4) y su estado (RF5.5): un único «Guardar cambios».
 * El libro no se cambia. Sin EJEMPLAR_CAMBIAR_ESTADO, el desplegable Estado queda deshabilitado.
 */
@Component({
  imports: [ReactiveFormsModule, Alerta, Select],
  selector: 'app-actualizar-ejemplar',
  styleUrl: './actualizar-ejemplar.css',
  templateUrl: './actualizar-ejemplar.html',
})
export class ActualizarEjemplar implements OnInit {
  private readonly ejemplares = inject(Ejemplares);
  private readonly router = inject(Router);
  private readonly sesion = inject(Sesion);

  /** Parámetro `:id` de la ruta. */
  readonly id = input.required<string>();

  /** RF5.5.3: los seis estados posibles. */
  protected readonly opcionesEstado: OpcionSelect[] = ESTADOS_EJEMPLAR.map((e) => ({
    valor: e,
    etiqueta: estadoEjemplar.transform(e),
  }));
  /** Solo se asignan bibliotecas activas (GET /bibliotecas). */
  private readonly bibliotecasActivas = toSignal(
    inject(Bibliotecas)
      .listarBibliotecas()
      .pipe(map((lista) => lista.map((b) => ({ valor: b.idBiblioteca, etiqueta: b.nombre })))),
  );
  /** Biblioteca actual del ejemplar, tomada de sus propios datos. */
  private readonly bibliotecaActual = signal<OpcionSelect | null>(null);
  /** Si la biblioteca actual ya no está activa, se agrega como «Nombre (inactiva)», como en P2.3. */
  protected readonly opcionesBiblioteca = computed(() => {
    const activas = this.bibliotecasActivas();
    if (!activas) return [];
    const actual = this.bibliotecaActual();
    return actual && !activas.some((o) => o.valor === actual.valor)
      ? [...activas, actual]
      : activas;
  });

  protected readonly formulario = new FormGroup({
    codigoEjemplar: new FormControl('', { nonNullable: true, validators: VALIDADORES_CODIGO }),
    idBiblioteca: new FormControl<ValorSelect>(null, { validators: [Validators.required] }),
    ubicacionFisica: new FormControl('', { nonNullable: true, validators: VALIDADORES_UBICACION }),
    estado: new FormControl<ValorSelect>(null, { validators: [Validators.required] }),
  });

  protected readonly cargado = signal(false);
  protected readonly enviando = signal(false);
  /** Error del servicio: se muestran su título y detalle, y `errores[]` junto a cada campo. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  ngOnInit(): void {
    this.ejemplares.obtenerEjemplar(Number(this.id())).subscribe({
      next: (ejemplar) => {
        this.bibliotecaActual.set({
          valor: ejemplar.idBiblioteca,
          etiqueta: `${ejemplar.bibliotecaNombre} (inactiva)`,
        });
        this.formulario.setValue({
          codigoEjemplar: ejemplar.codigoEjemplar,
          idBiblioteca: ejemplar.idBiblioteca,
          ubicacionFisica: ejemplar.ubicacionFisica ?? '',
          estado: ejemplar.estado,
        });
        if (!this.sesion.tienePermiso(PERMISOS.EJEMPLAR_CAMBIAR_ESTADO)) {
          this.formulario.controls.estado.disable();
        }
        this.cargado.set(true);
      },
      error: (error: unknown) => this.error.set(comoErrorRespuesta(error)),
    });
  }

  protected mensaje(campo: CampoEjemplar): string | null {
    return mensajeCampo(this.formulario.controls[campo], campo, this.error());
  }

  /**
   * RF5.4 y RF5.5: una sola llamada guarda los datos y el estado. Si el código ya está en uso, se informa
   * y el ejemplar conserva sus datos anteriores. Al terminar se vuelve a P5.2, que muestra el nuevo estado.
   */
  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const v = this.formulario.getRawValue();
    this.enviando.set(true);
    this.error.set(null);
    this.ejemplares
      .actualizarEjemplar(Number(this.id()), {
        codigoEjemplar: v.codigoEjemplar.trim(),
        idBiblioteca: v.idBiblioteca as number,
        ubicacionFisica: v.ubicacionFisica.trim() || null,
        estado: v.estado as EstadoEjemplar,
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/ejemplares'),
        error: (error: unknown) => {
          this.enviando.set(false);
          this.error.set(comoErrorRespuesta(error));
        },
      });
  }
}
