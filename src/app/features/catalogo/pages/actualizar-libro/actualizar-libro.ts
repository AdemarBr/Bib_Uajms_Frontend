import { Component, DestroyRef, OnInit, computed, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { ModalConfirmacion } from '../../../../shared/components/modal-confirmacion/modal-confirmacion';
import { TienePermiso } from '../../../../shared/directives/tiene-permiso';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { PortadaLibro } from '../../components/portada-libro/portada-libro';
import { Libros } from '../../data-access/libros';
import {
  CampoFormularioLibro,
  aSolicitud,
  crearFormularioLibro,
  errorCampo,
  esImagen,
  llenarFormulario,
} from '../../formulario-libro';
import { LibroResponse } from '../../models/libro-response';

/**
 * P4.4 Actualizar datos del libro (RF4.4), con «Desactivar libro» (RF4.5) o «Activar libro» (RF4.7)
 * según su estado, ambos con confirmación, y el enlace «Ver historial de cambios» a P4.5.
 */
@Component({
  imports: [ReactiveFormsModule, RouterLink, Alerta, ModalConfirmacion, PortadaLibro, TienePermiso],
  selector: 'app-actualizar-libro',
  styleUrl: './actualizar-libro.css',
  templateUrl: './actualizar-libro.html',
})
export class ActualizarLibro implements OnInit {
  private readonly libros = inject(Libros);
  private readonly router = inject(Router);

  /** Parámetro `:id` de la ruta. */
  readonly id = input.required<string>();

  /** Campos en el orden de Figma (22:3). */
  protected readonly campos: readonly { campo: CampoFormularioLibro; etiqueta: string }[] = [
    { campo: 'titulo', etiqueta: 'Título' },
    { campo: 'autor', etiqueta: 'Autor' },
    { campo: 'editorial', etiqueta: 'Editorial' },
    { campo: 'clasificacionDewey', etiqueta: 'Clasificación Dewey' },
    { campo: 'isbn', etiqueta: 'ISBN (opcional)' },
    { campo: 'materia', etiqueta: 'Materia' },
  ];

  protected readonly formulario = crearFormularioLibro();
  protected readonly libro = signal<LibroResponse | null>(null);
  protected readonly enviando = signal(false);
  /** Error del servicio: se muestran su título y detalle, y `errores[]` junto a cada campo. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  private readonly portada = signal<File | null>(null);
  private readonly vistaPrevia = signal<string | null>(null);
  /** La portada elegida o, si no se eligió otra, la actual del libro. */
  protected readonly urlPortada = computed(
    () => this.vistaPrevia() ?? this.libro()?.portadaUrl ?? null,
  );
  private readonly portadaNoEsImagen = signal(false);
  protected readonly mensajePortada = computed(() =>
    this.portadaNoEsImagen()
      ? 'Seleccione un archivo de imagen.'
      : (this.error()?.errores.find((e) => e.campo === 'portada')?.mensaje ?? null),
  );

  protected readonly permisoHistorial = PERMISOS.LIBRO_HISTORIAL_CONSULTAR;
  protected readonly permisoEstado = PERMISOS.LIBRO_CAMBIAR_ESTADO;

  /** Ventana de confirmación de RF4.5.6 o RF4.7.6. */
  protected readonly confirmandoEstado = signal(false);
  protected readonly procesandoEstado = signal(false);
  /** Si el cambio de estado falla, el modal sigue abierto con el error del servicio. */
  protected readonly errorEstado = signal<ErrorRespuesta | null>(null);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cambiarVistaPrevia(null));
  }

  ngOnInit(): void {
    this.libros.obtenerLibro(Number(this.id())).subscribe({
      next: (libro) => {
        llenarFormulario(this.formulario, libro);
        this.libro.set(libro);
      },
      error: (error: unknown) => this.error.set(comoErrorRespuesta(error)),
    });
  }

  protected mensajeCampo(campo: CampoFormularioLibro): string | null {
    return errorCampo(this.formulario, campo, this.error());
  }

  /** RF4.4, pasos 5 y 6: la nueva imagen reemplaza a la anterior al guardar. */
  protected elegirPortada(archivo: File): void {
    this.portadaNoEsImagen.set(!esImagen(archivo));
    if (!esImagen(archivo)) return;
    this.portada.set(archivo);
    this.cambiarVistaPrevia(archivo);
  }

  /** RF4.4, curso alternativo: con datos inválidos se señalan los campos y se conservan los anteriores. */
  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    this.libros
      .actualizarLibro(Number(this.id()), aSolicitud(this.formulario), this.portada())
      .subscribe({
        next: () => this.router.navigateByUrl('/gestion-catalogo/libros'),
        error: (error: unknown) => {
          this.enviando.set(false);
          this.error.set(comoErrorRespuesta(error));
        },
      });
  }

  /** RF4.5 y RF4.7: tras «Confirmar», el libro cambia de estado y el botón pasa a la acción contraria. */
  protected confirmarCambioEstado(): void {
    const libro = this.libro();
    if (!libro) return;
    this.procesandoEstado.set(true);
    this.errorEstado.set(null);
    this.libros.cambiarEstado(libro.idLibro, !libro.estado).subscribe({
      next: () => {
        this.procesandoEstado.set(false);
        this.confirmandoEstado.set(false);
        this.libro.set({ ...libro, estado: !libro.estado });
      },
      error: (error: unknown) => {
        this.procesandoEstado.set(false);
        this.errorEstado.set(comoErrorRespuesta(error));
      },
    });
  }

  /** Cursos alternativos de RF4.5 y RF4.7: «Cancelar» conserva el estado del libro. */
  protected cancelarCambioEstado(): void {
    this.confirmandoEstado.set(false);
    this.errorEstado.set(null);
  }

  private cambiarVistaPrevia(archivo: File | null): void {
    const anterior = this.vistaPrevia();
    if (anterior) URL.revokeObjectURL(anterior);
    this.vistaPrevia.set(archivo ? URL.createObjectURL(archivo) : null);
  }
}
