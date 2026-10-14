import { Component, input } from '@angular/core';

/** Alerta de Figma: recuadro gris con título y mensaje. Tone=Error (borde gray/500) o Tone=Success (borde gray/300). */
@Component({
  selector: 'app-alerta',
  styleUrl: './alerta.css',
  templateUrl: './alerta.html',
})
export class Alerta {
  readonly titulo = input.required<string>();
  readonly mensaje = input('');
  readonly tono = input<'error' | 'exito'>('error');
}
