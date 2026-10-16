import { Component, input, output } from '@angular/core';

/**
 * Ventana de confirmación de Figma (componente Dialog): título, mensaje y botones
 * «Cancelar» y «Confirmar» (textos configurables, p. ej. «Volver» y «Cancelar reserva», RF30).
 * El contenido proyectado se muestra entre el mensaje y los botones (p. ej. «Motivo (opcional)», RF48).
 * `variante="modal"` es el componente Modal de Figma (560 px, título de 18 px, mensaje de 14 px), como el
 * de «Cancelar reserva» de P7.2; `cerrable` agrega la «✕», que cierra igual que el botón de cancelar.
 */
@Component({
  selector: 'app-modal-confirmacion',
  styleUrl: './modal-confirmacion.css',
  templateUrl: './modal-confirmacion.html',
  host: { '(document:keydown.escape)': 'alCancelar()' },
})
export class ModalConfirmacion {
  readonly abierto = input(false);
  readonly titulo = input.required<string>();
  readonly mensaje = input('');
  readonly textoCancelar = input('Cancelar');
  readonly textoConfirmar = input('Confirmar');
  /** Deshabilita los botones mientras se procesa la acción. */
  readonly procesando = input(false);
  /** `dialogo`: Dialog de Figma (360 px); `modal`: Modal de Figma (560 px). */
  readonly variante = input<'dialogo' | 'modal'>('dialogo');
  /** Muestra la «✕» de cerrar, que equivale al botón de cancelar. */
  readonly cerrable = input(false);

  readonly confirmar = output<void>();
  readonly cancelar = output<void>();

  protected alCancelar(): void {
    if (this.abierto() && !this.procesando()) {
      this.cancelar.emit();
    }
  }
}
