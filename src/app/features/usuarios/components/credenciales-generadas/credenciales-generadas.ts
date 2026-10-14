import { Component, input, output } from '@angular/core';

/**
 * Ventana «Usuario registrado correctamente» de P2.1 (RF2.1.6): muestra una sola vez el usuario y la
 * contraseña generados, con «Imprimir» (comprobante para entregar en persona) y «Cerrar».
 */
@Component({
  selector: 'app-credenciales-generadas',
  styleUrl: './credenciales-generadas.css',
  templateUrl: './credenciales-generadas.html',
  host: { '(document:keydown.escape)': 'cerrar.emit()' },
})
export class CredencialesGeneradas {
  readonly nombreUsuario = input.required<string>();
  readonly contrasena = input.required<string>();

  readonly cerrar = output<void>();

  /** RF2.1, paso 14: el comprobante se imprime y no se envía por ningún otro medio. */
  protected imprimir(): void {
    window.print();
  }
}
