import { Component, input } from '@angular/core';

/**
 * Card de Figma (Home 9:7 y P6.1): imagen de 120 px (recuadro gris si no hay), título y el texto
 * proyectado debajo (caption gray/600). La usan novedades, bibliotecas y resultados del catálogo.
 * El enlace, si lo hay, lo pone quien la usa alrededor.
 */
@Component({
  selector: 'app-tarjeta',
  styleUrl: './tarjeta.css',
  templateUrl: './tarjeta.html',
  host: { class: 'block' },
})
export class Tarjeta {
  readonly titulo = input.required<string>();
  readonly imagenUrl = input<string | null>(null);
  /**
   * Ancho en px: 282 (280 de Figma + 2 de borde) en P6.1. Home usa los de Figma sin sumar el borde (280 o 256)
   * para que su fila mida lo mismo que en Figma: con sesión, cuatro novedades ocupan justo los 1084 px.
   */
  readonly ancho = input(282);
}
