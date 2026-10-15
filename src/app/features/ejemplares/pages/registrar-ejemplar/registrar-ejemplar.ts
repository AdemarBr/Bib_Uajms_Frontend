import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, map, of, switchMap } from 'rxjs';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Select, ValorSelect } from '../../../../shared/components/select/select';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Libros } from '../../../catalogo/data-access/libros';
import { LibroResponse } from '../../../catalogo/models/libro-response';
import { Bibliotecas } from '../../../estructura/data-access/bibliotecas';
import { Ejemplares } from '../../data-access/ejemplares';
import { VALIDADORES_CODIGO, VALIDADORES_UBICACION, mensajeCampo } from '../../formulario-ejemplar';

/** Libros que se listan bajo el buscador. */
const MAXIMO_COINCIDENCIAS = 8;

type CampoEjemplar = 'idLibro' | 'codigoEjemplar' | 'ubicacionFisica' | 'idBiblioteca';

/**
 * P5.1 Registrar ejemplar de libro (RF5.1), con la asignación de su código (RF5.2). El libro se busca
 * por título entre los libros activos y se elige de la lista de coincidencias.
 */
@Component({
  imports: [ReactiveFormsModule, Alerta, Select],
  selector: 'app-registrar-ejemplar',
  styleUrl: './registrar-ejemplar.css',
  templateUrl: './registrar-ejemplar.html',
})
export class RegistrarEjemplar {
  private readonly ejemplares = inject(Ejemplares);
  private readonly libros = inject(Libros);
  private readonly router = inject(Router);

  /** Solo bibliotecas activas (GET /bibliotecas). */
  protected readonly opcionesBiblioteca = toSignal(
    inject(Bibliotecas)
      .listarBibliotecas()
      .pipe(map((lista) => lista.map((b) => ({ valor: b.idBiblioteca, etiqueta: b.nombre })))),
    { initialValue: [] },
  );

  /** Texto del buscador de libros; no se envía, solo sirve para elegir `idLibro`. */
  protected readonly busquedaLibro = new FormControl('', { nonNullable: true });
  protected readonly formulario = new FormGroup({
    idLibro: new FormControl<number | null>(null, { validators: [Validators.required] }),
    codigoEjemplar: new FormControl('', { nonNullable: true, validators: VALIDADORES_CODIGO }),
    ubicacionFisica: new FormControl('', { nonNullable: true, validators: VALIDADORES_UBICACION }),
    idBiblioteca: new FormControl<ValorSelect>(null, { validators: [Validators.required] }),
  });

  /** Coincidencias del buscador (RF5.1, paso 4); null mientras no hay texto o ya se eligió un libro. */
  protected readonly coincidencias = signal<LibroResponse[] | null>(null);
  protected readonly enviando = signal(false);
  /** Error del servicio (p. ej. 409 de código en uso): título, detalle y errores por campo. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  constructor() {
    this.busquedaLibro.valueChanges
      .pipe(
        debounceTime(250),
        switchMap((texto) => {
          const q = texto.trim();
          const elegido = this.formulario.controls.idLibro.value !== null;
          if (!q || elegido) return of(null);
          return this.libros.listarLibros({ q, estado: true, tamanio: MAXIMO_COINCIDENCIAS }).pipe(
            map((pagina) => pagina.contenido),
            catchError((error: unknown) => {
              this.error.set(comoErrorRespuesta(error));
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((lista) => this.coincidencias.set(lista));
  }

  /** Al escribir de nuevo en el buscador se descarta el libro elegido. */
  protected alEscribirLibro(): void {
    const control = this.formulario.controls.idLibro;
    if (control.value !== null) control.setValue(null);
  }

  protected elegirLibro(libro: LibroResponse): void {
    this.formulario.controls.idLibro.setValue(libro.idLibro);
    this.busquedaLibro.setValue(libro.titulo);
    this.coincidencias.set(null);
  }

  protected mensaje(campo: CampoEjemplar): string | null {
    return mensajeCampo(this.formulario.controls[campo], campo, this.error());
  }

  /** RF5.1, paso 10: se verifican los datos antes de crear el registro. */
  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const v = this.formulario.getRawValue();
    this.enviando.set(true);
    this.error.set(null);
    this.ejemplares
      .registrarEjemplar({
        idLibro: v.idLibro as number,
        codigoEjemplar: v.codigoEjemplar.trim(),
        ubicacionFisica: v.ubicacionFisica.trim() || null,
        idBiblioteca: v.idBiblioteca as number,
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/ejemplares'),
        error: (error: unknown) => {
          this.enviando.set(false);
          this.error.set(comoErrorRespuesta(error));
        },
      });
  }
}
