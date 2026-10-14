import { Component, input, output } from '@angular/core';

/**
 * Ventana de confirmación de Figma (componente Dialog): título, mensaje y botones
 * «Cancelar» y «Confirmar» (textos configurables, p. ej. «Volver» y «Cancelar reserva», RF30).
 * El contenido proyectado se muestra entre el mensaje y los botones (p. ej. «Motivo (opcional)», RF48).
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

  readonly confirmar = output<void>();
  readonly cancelar = output<void>();

  protected alCancelar(): void {
    if (this.abierto() && !this.procesando()) {
      this.cancelar.emit();
    }
  }
}
