import { Component, input } from '@angular/core';

/** Badge de Figma (tono Neutral): estados como «Pendiente», «Disponible», «Respondido». */
@Component({
  selector: 'app-badge-estado',
  styleUrl: './badge-estado.css',
  templateUrl: './badge-estado.html',
})
export class BadgeEstado {
  readonly texto = input.required<string>();
}
