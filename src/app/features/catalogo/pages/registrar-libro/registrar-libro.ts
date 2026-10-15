import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { PortadaLibro } from '../../components/portada-libro/portada-libro';
import { Libros } from '../../data-access/libros';
import {
  CampoFormularioLibro,
  aSolicitud,
  crearFormularioLibro,
  errorCampo,
  esImagen,
} from '../../formulario-libro';

/**
 * P4.1 Registrar libro (RF4.1): datos bibliográficos, portada con «Subir imagen» y «Guardar».
 * Tras registrar, el formulario queda vacío y se indica que el libro se registró (RF4.1.5).
 */
@Component({
  imports: [ReactiveFormsModule, Alerta, PortadaLibro],
  selector: 'app-registrar-libro',
  styleUrl: './registrar-libro.css',
  templateUrl: './registrar-libro.html',
})
export class RegistrarLibro {
  private readonly libros = inject(Libros);

  /** Campos en el orden de Figma (19:684). Materia es texto libre. */
  protected readonly campos: readonly {
    campo: CampoFormularioLibro;
    etiqueta: string;
    placeholder: string;
  }[] = [
    { campo: 'titulo', etiqueta: 'Título', placeholder: 'Título del libro' },
    { campo: 'autor', etiqueta: 'Autor', placeholder: 'Autor(es)' },
    { campo: 'editorial', etiqueta: 'Editorial', placeholder: 'Editorial' },
    { campo: 'materia', etiqueta: 'Materia', placeholder: 'Ej. Informática' },
    { campo: 'clasificacionDewey', etiqueta: 'Clasificación Dewey', placeholder: 'Ej. 005.1' },
    { campo: 'isbn', etiqueta: 'ISBN (opcional)', placeholder: 'Ej. 978-99954-1-234-5' },
  ];

  protected readonly formulario = crearFormularioLibro();
  protected readonly enviando = signal(false);
  protected readonly registrado = signal(false);
  /** Error del servicio: se muestran su título y detalle, y `errores[]` junto a cada campo. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  private readonly portada = signal<File | null>(null);
  protected readonly vistaPrevia = signal<string | null>(null);
  private readonly portadaNoEsImagen = signal(false);
  protected readonly mensajePortada = computed(() =>
    this.portadaNoEsImagen()
      ? 'Seleccione un archivo de imagen.'
      : (this.error()?.errores.find((e) => e.campo === 'portada')?.mensaje ?? null),
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cambiarVistaPrevia(null));
  }

  protected mensajeCampo(campo: CampoFormularioLibro): string | null {
    return errorCampo(this.formulario, campo, this.error());
  }

  protected elegirPortada(archivo: File): void {
    this.registrado.set(false);
    this.portadaNoEsImagen.set(!esImagen(archivo));
    if (!esImagen(archivo)) return;
    this.portada.set(archivo);
    this.cambiarVistaPrevia(archivo);
  }

  /** RF4.1, curso alternativo: con datos faltantes se señalan los campos y no se registra. */
  protected guardar(): void {
    this.registrado.set(false);
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    this.libros.registrarLibro(aSolicitud(this.formulario), this.portada()).subscribe({
      next: () => {
        this.enviando.set(false);
        this.formulario.reset();
        this.portada.set(null);
        this.cambiarVistaPrevia(null);
        this.registrado.set(true);
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.error.set(comoErrorRespuesta(error));
      },
    });
  }

  private cambiarVistaPrevia(archivo: File | null): void {
    const anterior = this.vistaPrevia();
    if (anterior) URL.revokeObjectURL(anterior);
    this.vistaPrevia.set(archivo ? URL.createObjectURL(archivo) : null);
  }
}
