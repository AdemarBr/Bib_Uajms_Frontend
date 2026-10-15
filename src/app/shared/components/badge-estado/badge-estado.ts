import { Component, input } from '@angular/core';

/**
 * Badge de Figma (tono Neutral): estados como «Pendiente», «Disponible», «Respondido».
 * El tono `disponible` (fondo brand/accent) es la etiqueta de color de disponibilidad de P5.2 (RF5.6.4).
 */
@Component({
  selector: 'app-badge-estado',
  styleUrl: './badge-estado.css',
  templateUrl: './badge-estado.html',
})
export class BadgeEstado {
  readonly texto = input.required<string>();
  readonly tono = input<'neutral' | 'disponible'>('neutral');
}
