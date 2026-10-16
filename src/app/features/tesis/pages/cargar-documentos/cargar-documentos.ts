import { Component, OnInit, computed, inject, input, signal } from '@angular/core';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { BadgeEstado } from '../../../../shared/components/badge-estado/badge-estado';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Tesis } from '../../data-access/tesis';
import { DocumentoTesisResponse } from '../../models/documento-tesis-response';
import { TesisResponse } from '../../models/tesis-response';
import { TIPOS_SECCION, TipoSeccion } from '../../models/tipo-seccion';

/**
 * P10.2 Cargar documentos digitales de tesis (RF10.2; Figma 24:2290): una fila por sección (orden de RF10.2.3)
 * con «Pendiente» o «Cargado» y «Subir archivo», deshabilitado si la sección ya tiene documento (se reemplaza en
 * P10.5). Solo PDF de hasta 20 MB: el servicio rechaza el archivo y la fila muestra el motivo.
 */
@Component({
  imports: [Alerta, BadgeEstado],
  selector: 'app-cargar-documentos',
  styleUrl: './cargar-documentos.css',
  templateUrl: './cargar-documentos.html',
})
export class CargarDocumentos implements OnInit {
  private readonly servicio = inject(Tesis);

  /** Parámetro `:id` de la ruta. */
  readonly id = input.required<string>();

  protected readonly secciones = TIPOS_SECCION;
  protected readonly tesis = signal<TesisResponse | null>(null);
  private readonly documentos = signal<DocumentoTesisResponse[]>([]);
  protected readonly cargadas = computed(
    () => new Set<TipoSeccion>(this.documentos().map((d) => d.tipoSeccion)),
  );

  /** Sección cuyo archivo se está subiendo. */
  protected readonly subiendo = signal<TipoSeccion | null>(null);
  /** Error al subir, mostrado en la fila de su sección (RF10.2, curso alternativo). */
  protected readonly errorSeccion = signal<{ seccion: TipoSeccion; error: ErrorRespuesta } | null>(
    null,
  );
  /** Error al cargar la tesis o sus documentos. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  ngOnInit(): void {
    const idTesis = Number(this.id());
    this.servicio.obtenerTesis(idTesis).subscribe({
      next: (tesis) => this.tesis.set(tesis),
      error: (error: unknown) => this.error.set(comoErrorRespuesta(error)),
    });
    this.recargarDocumentos();
  }

  /** RF10.2, pasos 5 a 8: el archivo elegido con «Subir archivo» se asocia a la sección. */
  protected subir(seccion: TipoSeccion, entrada: HTMLInputElement): void {
    const archivo = entrada.files?.[0];
    entrada.value = '';
    if (!archivo) return;
    this.subiendo.set(seccion);
    this.errorSeccion.set(null);
    this.servicio.cargarDocumento(Number(this.id()), seccion, archivo).subscribe({
      next: () => {
        this.subiendo.set(null);
        this.recargarDocumentos();
      },
      error: (error: unknown) => {
        this.subiendo.set(null);
        this.errorSeccion.set({ seccion, error: comoErrorRespuesta(error) });
      },
    });
  }

  private recargarDocumentos(): void {
    this.servicio.listarDocumentos(Number(this.id())).subscribe({
      next: (documentos) => this.documentos.set(documentos),
      error: (error: unknown) => this.error.set(comoErrorRespuesta(error)),
    });
  }
}
