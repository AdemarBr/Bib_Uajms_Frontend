import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { startWith } from 'rxjs';

import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { BadgeEstado } from '../../../../shared/components/badge-estado/badge-estado';
import { OpcionSelect, Select, ValorSelect } from '../../../../shared/components/select/select';
import { TienePermiso } from '../../../../shared/directives/tiene-permiso';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Tesis } from '../../data-access/tesis';
import { DocumentoTesisResponse } from '../../models/documento-tesis-response';
import { TesisResponse } from '../../models/tesis-response';
import { TIPOS_SECCION } from '../../models/tipo-seccion';

/**
 * P10.5 Actualizar documento digital de tesis (RF10.5; Figma 24:2543): «Sección a reemplazar» (solo las secciones
 * cargadas), «Archivo actual» (solo el nombre), zona para arrastrar o elegir el nuevo PDF y «Reemplazar
 * documento», que cambia solo ese documento y se queda en la pantalla.
 */
@Component({
  imports: [ReactiveFormsModule, RouterLink, Alerta, BadgeEstado, Select, TienePermiso],
  selector: 'app-actualizar-documento',
  styleUrl: './actualizar-documento.css',
  templateUrl: './actualizar-documento.html',
})
export class ActualizarDocumento implements OnInit {
  private readonly servicio = inject(Tesis);

  /** Parámetro `:id` de la ruta. */
  readonly id = input.required<string>();

  /** Sin documentos: enlace a P10.2 con su permiso (decisión del estudiante). */
  protected readonly permisoCargar = PERMISOS.TESIS_DOCUMENTO_CARGAR;
  protected readonly tesis = signal<TesisResponse | null>(null);
  protected readonly documentos = signal<DocumentoTesisResponse[] | null>(null);

  /** RF10.5.3: «Sección a reemplazar», con el `idDocumento` como valor. */
  protected readonly seccion = new FormControl<ValorSelect>(null);
  private readonly idDocumento = toSignal(this.seccion.valueChanges.pipe(startWith(null)), {
    initialValue: null,
  });
  protected readonly opcionesSeccion = computed<OpcionSelect[]>(() =>
    [...(this.documentos() ?? [])]
      .sort((a, b) => TIPOS_SECCION.indexOf(a.tipoSeccion) - TIPOS_SECCION.indexOf(b.tipoSeccion))
      .map((d) => ({ valor: d.idDocumento, etiqueta: d.tipoSeccion })),
  );
  protected readonly actual = computed(
    () => this.documentos()?.find((d) => d.idDocumento === this.idDocumento()) ?? null,
  );

  protected readonly archivo = signal<File | null>(null);
  protected readonly arrastrando = signal(false);
  protected readonly enviando = signal(false);
  protected readonly error = signal<ErrorRespuesta | null>(null);

  ngOnInit(): void {
    const idTesis = Number(this.id());
    this.servicio.obtenerTesis(idTesis).subscribe({
      next: (tesis) => this.tesis.set(tesis),
      error: (error: unknown) => this.error.set(comoErrorRespuesta(error)),
    });
    this.servicio.listarDocumentos(idTesis).subscribe({
      next: (documentos) => {
        this.documentos.set(documentos);
        // Figma: la primera sección cargada aparece elegida.
        const primera = this.opcionesSeccion()[0];
        if (primera) this.seccion.setValue(primera.valor);
      },
      error: (error: unknown) => this.error.set(comoErrorRespuesta(error)),
    });
  }

  protected elegir(entrada: HTMLInputElement): void {
    const archivo = entrada.files?.[0];
    entrada.value = '';
    if (archivo) this.tomar(archivo);
  }

  protected soltar(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrando.set(false);
    const archivo = evento.dataTransfer?.files[0];
    if (archivo) this.tomar(archivo);
  }

  protected sobre(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrando.set(true);
  }

  /** RF10.5, pasos 7 y 8: reemplaza solo el documento elegido; con error se conserva el anterior. */
  protected reemplazar(): void {
    const actual = this.actual();
    const archivo = this.archivo();
    if (!actual || !archivo) return;
    this.enviando.set(true);
    this.error.set(null);
    this.servicio.reemplazarDocumento(actual.idTesis, actual.idDocumento, archivo).subscribe({
      next: (reemplazado) => {
        this.enviando.set(false);
        this.archivo.set(null);
        this.documentos.update((lista) =>
          (lista ?? []).map((d) => (d.idDocumento === reemplazado.idDocumento ? reemplazado : d)),
        );
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.error.set(comoErrorRespuesta(error));
      },
    });
  }

  private tomar(archivo: File): void {
    this.archivo.set(archivo);
    this.error.set(null);
  }
}
