import { Component, input, output } from '@angular/core';

/**
 * Interruptor de estado de Figma («Control de estado», 36 × 20). No cambia solo:
 * emite `cambio` con el valor pedido para que la pantalla confirme antes de aplicarlo (RF08).
 */
@Component({
  selector: 'app-interruptor',
  styleUrl: './interruptor.css',
  templateUrl: './interruptor.html',
})
export class Interruptor {
  readonly activo = input.required<boolean>();
  readonly etiqueta = input.required<string>();
  readonly deshabilitado = input(false);

  readonly cambio = output<boolean>();
}
