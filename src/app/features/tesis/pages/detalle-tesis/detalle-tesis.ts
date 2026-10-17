import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Sesion } from '../../../../core/auth/sesion';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { BadgeEstado } from '../../../../shared/components/badge-estado/badge-estado';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { IconoPdf } from '../../components/icono-pdf/icono-pdf';
import { CatalogoTesis } from '../../data-access/catalogo-tesis';
import { DocumentoTesisResponse } from '../../models/documento-tesis-response';
import { TesisDetalleResponse } from '../../models/tesis-detalle-response';

/**
 * P11.2 Detalle de tesis (RF11.1.2 y RF11.1.2.1; Figma 24:2728), pública: secciones «Datos generales», «Autor y
 * tutor» y «Documentos electrónicos» (RF11.1.2.3). Cada documento es un ícono PDF con el nombre de su sección que
 * abre el archivo en otra pestaña (RF11.1.2.1.6). «Volver al listado» regresa a los resultados de P11.1.
 */
@Component({
  imports: [Alerta, BadgeEstado, IconoPdf],
  selector: 'app-detalle-tesis',
  styleUrl: './detalle-tesis.css',
  templateUrl: './detalle-tesis.html',
})
export class DetalleTesis implements OnInit {
  private readonly catalogo = inject(CatalogoTesis);
  private readonly router = inject(Router);
  /** Sin sesión, la página pone su propio padding (con sesión lo pone el layout). */
  protected readonly sesion = inject(Sesion);

  /** Parámetro `:id` de la ruta. */
  readonly id = input.required<string>();

  protected readonly detalle = signal<TesisDetalleResponse | null>(null);
  /** Error al cargar la tesis (404 si no existe o está inactiva). */
  protected readonly error = signal<ErrorRespuesta | null>(null);
  /** Error al abrir un documento (RF11.1.2.1, curso alternativo). */
  protected readonly errorDocumento = signal<ErrorRespuesta | null>(null);

  /** URL de P11.1 con la búsqueda y los filtros con los que se llegó (o `/tesis` si se entró directo). */
  private readonly volver: string =
    (this.router.currentNavigation()?.extras.state?.['volver'] as string | undefined) ?? '/tesis';

  ngOnInit(): void {
    this.catalogo.obtenerDetalle(Number(this.id())).subscribe({
      next: (detalle) => this.detalle.set(detalle),
      error: (error: unknown) => this.error.set(comoErrorRespuesta(error)),
    });
  }

  /**
   * RF11.1.2.1, pasos 3 y 4: abre el documento en otra pestaña. La pestaña se abre en el mismo clic (si no, el
   * navegador la bloquearía) y se cierra si el documento no está disponible.
   */
  protected abrir(documento: DocumentoTesisResponse): void {
    this.errorDocumento.set(null);
    const pestana = window.open('', '_blank');
    this.catalogo.abrirDocumento(documento.idDocumento).subscribe({
      next: (url) => {
        if (pestana) pestana.location.href = url;
        else window.open(url, '_blank');
      },
      error: (error: unknown) => {
        pestana?.close();
        this.errorDocumento.set(comoErrorRespuesta(error));
      },
    });
  }

  /** RF11.1.2.1.5 */
  protected volverAlListado(): void {
    this.router.navigateByUrl(this.volver);
  }
}
