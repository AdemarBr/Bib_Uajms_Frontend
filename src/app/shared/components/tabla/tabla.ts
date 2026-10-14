import { Component, TemplateRef, computed, contentChildren, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { Celda, ContextoCelda } from './celda';

export interface ColumnaTabla {
  /** Campo de la fila que se muestra, o clave de una plantilla `appCelda`. */
  clave: string;
  titulo: string;
  /** Ancho fijo (p. ej. '160px'); sin él, las columnas se reparten el ancho. */
  ancho?: string;
}

/**
 * Tabla de Figma: encabezado gris, filas con borde inferior y texto de 13 px.
 * Las columnas con una plantilla `appCelda` usan esa plantilla; las demás muestran `fila[clave]`.
 */
@Component({
  imports: [NgTemplateOutlet],
  selector: 'app-tabla',
  styleUrl: './tabla.css',
  templateUrl: './tabla.html',
})
export class Tabla<T extends object> {
  readonly columnas = input.required<readonly ColumnaTabla[]>();
  readonly filas = input.required<readonly T[]>();
  /** Mensaje cuando no hay filas (RF10 y RF13 de los requerimientos comunes). */
  readonly mensajeVacio = input('');

  private readonly celdas = contentChildren(Celda);

  protected readonly plantillas = computed(
    () =>
      new Map<string, TemplateRef<ContextoCelda<T>>>(
        this.celdas().map((c) => [c.appCelda(), c.plantilla]),
      ),
  );

  protected valor(fila: T, clave: string): unknown {
    return (fila as Record<string, unknown>)[clave];
  }
}
