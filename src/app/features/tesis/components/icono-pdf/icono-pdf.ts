import { Component } from '@angular/core';
import { LucideFile } from '@lucide/angular';

/**
 * Ícono «PDF» de Figma (P11.2, 300:5301): hoja de 40 × 48 con «PDF» en el centro. Se dibuja con el ícono File de
 * Lucide, como los íconos del menú (docs/diseno.md).
 */
@Component({
  imports: [LucideFile],
  selector: 'app-icono-pdf',
  styleUrl: './icono-pdf.css',
  templateUrl: './icono-pdf.html',
  host: { class: 'relative block h-12 w-10' },
})
export class IconoPdf {}
