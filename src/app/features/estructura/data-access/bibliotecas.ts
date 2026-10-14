import { Service, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { BibliotecaResponse } from '../models/biblioteca-response';
import { BIBLIOTECAS_MOCK } from './bibliotecas.mock';

const DEMORA_MS = 300;

/** Bibliotecas físicas (RF3). Por ahora solo el listado para los desplegables; RF3 agrega registrar y actualizar. */
@Service()
export class Bibliotecas {
  private readonly bibliotecas = signal<BibliotecaResponse[]>(BIBLIOTECAS_MOCK);

  /** GET /bibliotecas (público). */
  listarBibliotecas(): Observable<BibliotecaResponse[]> {
    return of(this.bibliotecas()).pipe(delay(DEMORA_MS));
  }
}
