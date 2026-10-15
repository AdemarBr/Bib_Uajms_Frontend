import { Component, OnInit, inject, input, signal } from '@angular/core';
import { forkJoin } from 'rxjs';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Celda } from '../../../../shared/components/tabla/celda';
import { ColumnaTabla, Tabla } from '../../../../shared/components/tabla/tabla';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { FechaPipe } from '../../../../shared/pipes/fecha-pipe';
import { Libros } from '../../data-access/libros';
import { HistorialCambioLibroResponse } from '../../models/historial-cambio-libro-response';

/** Nombre en pantalla de cada `campoModificado` (Figma 22:938). */
const NOMBRES_CAMPO: Record<string, string> = {
  titulo: 'Título',
  autor: 'Autor',
  editorial: 'Editorial',
  materia: 'Materia',
  clasificacionDewey: 'Clasificación Dewey',
  isbn: 'ISBN',
  portada: 'Portada',
};

/**
 * P4.5 Historial de cambios del libro (RF4.6): lista cronológica con fecha (sin hora), campo modificado,
 * valor anterior y valor nuevo. Solo consulta, no modifica nada (RF4.6.3).
 */
@Component({
  imports: [Alerta, Celda, Tabla, FechaPipe],
  selector: 'app-historial-libro',
  styleUrl: './historial-libro.css',
  templateUrl: './historial-libro.html',
})
export class HistorialLibro implements OnInit {
  private readonly libros = inject(Libros);

  /** Parámetro `:id` de la ruta. */
  readonly id = input.required<string>();

  protected readonly columnas: ColumnaTabla[] = [
    { clave: 'fecha', titulo: 'Fecha', ancho: '160px' },
    { clave: 'campoModificado', titulo: 'Campo modificado', ancho: '160px' },
    { clave: 'valorAnterior', titulo: 'Valor anterior', ancho: '160px' },
    { clave: 'valorNuevo', titulo: 'Valor nuevo' },
  ];

  protected readonly titulo = signal<string | null>(null);
  protected readonly cambios = signal<HistorialCambioLibroResponse[]>([]);
  protected readonly error = signal<ErrorRespuesta | null>(null);

  ngOnInit(): void {
    const idLibro = Number(this.id());
    forkJoin({
      libro: this.libros.obtenerLibro(idLibro),
      cambios: this.libros.listarHistorial(idLibro),
    }).subscribe({
      next: ({ libro, cambios }) => {
        this.cambios.set(cambios);
        this.titulo.set(libro.titulo);
      },
      error: (error: unknown) => this.error.set(comoErrorRespuesta(error)),
    });
  }

  protected nombreCampo(campo: string): string {
    return NOMBRES_CAMPO[campo] ?? campo;
  }
}
