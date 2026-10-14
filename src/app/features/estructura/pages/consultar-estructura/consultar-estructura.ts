import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { Celda } from '../../../../shared/components/tabla/celda';
import { ColumnaTabla, Tabla } from '../../../../shared/components/tabla/tabla';
import { Bibliotecas } from '../../data-access/bibliotecas';
import { Carreras } from '../../data-access/carreras';
import { Facultades } from '../../data-access/facultades';

export type Pestana = 'facultades' | 'carreras' | 'bibliotecas';

const PESTANAS: { valor: Pestana; texto: string }[] = [
  { valor: 'facultades', texto: 'Facultades' },
  { valor: 'carreras', texto: 'Carreras' },
  { valor: 'bibliotecas', texto: 'Bibliotecas' },
];

/** Columnas de RF3.1.7 y mensaje de la pestaña vacía (RF3.1, curso alternativo). */
const COLUMNAS: Record<Pestana, ColumnaTabla[]> = {
  facultades: [
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'carreras', titulo: 'Carreras' },
    { clave: 'bibliotecas', titulo: 'Biblioteca' },
    { clave: 'estado', titulo: 'Estado' },
  ],
  carreras: [
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'facultadNombre', titulo: 'Facultad' },
    { clave: 'estado', titulo: 'Estado' },
  ],
  bibliotecas: [
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'ubicacion', titulo: 'Ubicación' },
    { clave: 'pertenencia', titulo: 'Facultad / Carrera' },
    { clave: 'estado', titulo: 'Estado' },
  ],
};

const MENSAJES_VACIO: Record<Pestana, string> = {
  facultades: 'Aún no hay facultades registradas.',
  carreras: 'Aún no hay carreras registradas.',
  bibliotecas: 'Aún no hay bibliotecas registradas.',
};

/** P3.1 Consultar bibliotecas, facultades y carreras (RF3.1): solo lectura, en pestañas. */
@Component({
  imports: [Tabla, Celda],
  selector: 'app-consultar-estructura',
  styleUrl: './consultar-estructura.css',
  templateUrl: './consultar-estructura.html',
})
export class ConsultarEstructura {
  private readonly router = inject(Router);

  /** Parámetro de consulta `?pestana=` (docs/rutas.md). */
  readonly pestana = input<string>();

  protected readonly pestanas = PESTANAS;
  protected readonly actual = computed<Pestana>(() => {
    const p = this.pestana();
    return PESTANAS.some((x) => x.valor === p) ? (p as Pestana) : 'facultades';
  });
  protected readonly columnas = computed(() => COLUMNAS[this.actual()]);
  protected readonly mensajeVacio = computed(() => MENSAJES_VACIO[this.actual()]);

  private readonly facultades = toSignal(inject(Facultades).listarFacultades());
  private readonly carreras = toSignal(inject(Carreras).listarCarreras());
  private readonly bibliotecas = toSignal(
    inject(Bibliotecas)
      .listarBibliotecas()
      .pipe(
        map((lista) =>
          lista.map((b) => ({
            ...b,
            pertenencia: b.carreraNombre ?? b.facultadNombre ?? 'No aplica',
          })),
        ),
      ),
  );

  protected readonly filas = computed<readonly object[] | undefined>(() => {
    switch (this.actual()) {
      case 'facultades':
        return this.facultades();
      case 'carreras':
        return this.carreras();
      case 'bibliotecas':
        return this.bibliotecas();
    }
  });

  protected elegir(pestana: Pestana): void {
    this.router.navigate([], { queryParams: { pestana }, replaceUrl: true });
  }
}
