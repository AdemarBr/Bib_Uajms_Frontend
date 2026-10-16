import { Component, input, output } from '@angular/core';

import { BadgeEstado } from '../../../../shared/components/badge-estado/badge-estado';
import { EstadoEjemplarPipe } from '../../../../shared/pipes/estado-ejemplar-pipe';
import { EjemplarPrestableResponse } from '../../models/ejemplar-prestable-response';

/**
 * «Ejemplares disponibles del libro seleccionado» de P9.1 y P9.3 (RF9.1.10, RF9.1.2.3 y RF9.2.2.3): código y
 * título, la etiqueta «Seleccionado» o el estado del ejemplar (RF9.1.3) y la línea «Autor · Ubicación».
 * A domicilio, los de uso exclusivo en sala no se pueden elegir (RF9.2.3).
 */
@Component({
  imports: [BadgeEstado, EstadoEjemplarPipe],
  selector: 'app-lista-ejemplares',
  styleUrl: './lista-ejemplares.css',
  templateUrl: './lista-ejemplares.html',
})
export class ListaEjemplares {
  readonly ejemplares = input.required<readonly EjemplarPrestableResponse[]>();
  readonly seleccionado = input<number | null>(null);
  /** P9.3: marca y bloquea los ejemplares de uso exclusivo en sala. */
  readonly aDomicilio = input(false);
  readonly elegir = output<number>();

  protected bloqueado(ejemplar: EjemplarPrestableResponse): boolean {
    return this.aDomicilio() && ejemplar.soloSala;
  }
}
