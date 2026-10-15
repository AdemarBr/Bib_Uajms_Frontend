import { Component, input, output } from '@angular/core';

/**
 * Recuadro «Portada» de P4.1 y P4.4: la imagen (gris si no hay) y el botón «Subir imagen» (RF4.1.6 y
 * RF4.4.4). Emite el archivo elegido; quien lo usa lo valida y muestra la vista previa con `url`.
 * El ancho lo define quien lo usa.
 */
@Component({
  selector: 'app-portada-libro',
  styleUrl: './portada-libro.css',
  templateUrl: './portada-libro.html',
  host: { class: 'block' },
})
export class PortadaLibro {
  /** Imagen que se muestra: la portada actual o la vista previa de la elegida. */
  readonly url = input<string | null>(null);
  /** Mensaje bajo el botón (p. ej. si el archivo no es una imagen). */
  readonly mensaje = input<string | null>(null);
  readonly deshabilitado = input(false);

  readonly seleccion = output<File>();

  protected alElegir(campo: HTMLInputElement): void {
    const archivo = campo.files?.[0];
    if (archivo) this.seleccion.emit(archivo);
    // Permite volver a elegir el mismo archivo.
    campo.value = '';
  }
}
