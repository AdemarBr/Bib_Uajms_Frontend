import { Component, computed, inject, signal } from '@angular/core';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Libros } from '../../data-access/libros';
import { ImportacionResponse } from '../../models/importacion-response';

/**
 * P4.2 Importar libros mediante archivo (RF4.2): área para arrastrar el archivo o «Seleccionar archivo»,
 * «Importar» y el resumen con los libros registrados y las filas con errores (RF4.2.4 y RF4.2.5).
 * Formato del archivo: docs/contrato-api.md, sección 6.
 */
@Component({
  imports: [Alerta],
  selector: 'app-importar-libros',
  styleUrl: './importar-libros.css',
  templateUrl: './importar-libros.html',
})
export class ImportarLibros {
  private readonly libros = inject(Libros);

  protected readonly archivo = signal<File | null>(null);
  /** RF4.2, paso 4: solo se acepta un archivo CSV (validación de formato del frontend). */
  protected readonly formatoInvalido = signal(false);
  protected readonly arrastrando = signal(false);
  protected readonly importando = signal(false);
  protected readonly resumen = signal<ImportacionResponse | null>(null);
  /** Error del servicio (archivo no válido o sin conexión): se muestran su título y detalle. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  protected readonly tituloIncorporados = computed(() => {
    const n = this.resumen()?.incorporados ?? 0;
    return n === 1 ? '1 libro importado correctamente' : `${n} libros importados correctamente`;
  });
  protected readonly tituloErrores = computed(() => {
    const n = this.resumen()?.errores.length ?? 0;
    return n === 1 ? '1 fila con errores' : `${n} filas con errores`;
  });
  /** «Fila 12: falta autor. Fila 27: Dewey inválido.» (Figma 20:3). */
  protected readonly detalleErrores = computed(
    () =>
      this.resumen()
        ?.errores.map((e) => `Fila ${e.fila}: ${e.mensaje}`)
        .join(' ') ?? '',
  );

  protected alElegir(campo: HTMLInputElement): void {
    const archivo = campo.files?.[0];
    if (archivo) this.elegir(archivo);
    campo.value = '';
  }

  protected alArrastrar(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrando.set(true);
  }

  protected alSoltar(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrando.set(false);
    const archivo = evento.dataTransfer?.files[0];
    if (archivo) this.elegir(archivo);
  }

  protected importar(): void {
    const archivo = this.archivo();
    if (!archivo) return;
    this.importando.set(true);
    this.error.set(null);
    this.resumen.set(null);
    this.libros.importarLibros(archivo).subscribe({
      next: (resumen) => {
        this.importando.set(false);
        this.resumen.set(resumen);
      },
      error: (error: unknown) => {
        this.importando.set(false);
        this.error.set(comoErrorRespuesta(error));
      },
    });
  }

  private elegir(archivo: File): void {
    this.resumen.set(null);
    this.error.set(null);
    const esCsv = archivo.name.toLowerCase().endsWith('.csv');
    this.formatoInvalido.set(!esCsv);
    this.archivo.set(esCsv ? archivo : null);
  }
}
