import { Component, input } from '@angular/core';

/** Alerta de Figma (Tone=Error): recuadro gris con título y mensaje. */
@Component({
  selector: 'app-alerta',
  styleUrl: './alerta.css',
  templateUrl: './alerta.html',
})
export class Alerta {
  readonly titulo = input.required<string>();
  readonly mensaje = input('');
}
