import { Component, input } from '@angular/core';

/**
 * Badge de Figma (tono Neutral): estados como «Pendiente», «Disponible», «Respondido».
 * El tono `acento` (fondo brand/accent) marca el estado favorable de una etiqueta de color: disponibilidad
 * en P5.2, P6.1 y P6.2 (RF5.6.4 y RF6.1.2.1) y reserva confirmada en P7.2 (RF7.5.4). El tono `alerta` (texto rojo
 * «Vencido» de Figma 22:2118) marca la devolución con retraso en P9.5 (RF9.3.3.4).
 */
@Component({
  selector: 'app-badge-estado',
  styleUrl: './badge-estado.css',
  templateUrl: './badge-estado.html',
})
export class BadgeEstado {
  readonly texto = input.required<string>();
  readonly tono = input<'neutral' | 'acento' | 'alerta'>('neutral');
}
