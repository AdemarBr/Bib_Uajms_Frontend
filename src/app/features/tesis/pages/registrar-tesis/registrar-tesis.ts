import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { map, startWith } from 'rxjs';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { OpcionSelect, Select } from '../../../../shared/components/select/select';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Carreras } from '../../../estructura/data-access/carreras';
import { Facultades } from '../../../estructura/data-access/facultades';
import { Tesis } from '../../data-access/tesis';
import {
  CampoFormularioTesis,
  aSolicitud,
  conectarCarreraFacultad,
  crearFormularioTesis,
  errorCampo,
} from '../../formulario-tesis';

/**
 * P10.1 Registrar tesis (RF10.1; Figma 24:2159): campos en el orden de Figma, carrera y facultad en cascada
 * (solo activas, GET /carreras y GET /facultades), «Registrar tesis» y «Cancelar», que vacía el formulario.
 */
@Component({
  imports: [ReactiveFormsModule, Alerta, Select],
  selector: 'app-registrar-tesis',
  styleUrl: './registrar-tesis.css',
  templateUrl: './registrar-tesis.html',
})
export class RegistrarTesis {
  private readonly tesis = inject(Tesis);

  protected readonly formulario = crearFormularioTesis();

  private readonly carreras = toSignal(inject(Carreras).listarCarreras(), { initialValue: [] });
  protected readonly opcionesFacultad = toSignal(
    inject(Facultades)
      .listarFacultades()
      .pipe(map((lista) => lista.map((f) => ({ valor: f.idFacultad, etiqueta: f.nombre })))),
    { initialValue: [] },
  );
  private readonly facultad = toSignal(
    this.formulario.controls.idFacultad.valueChanges.pipe(startWith(null)),
    { initialValue: null },
  );
  /** RF10.1, paso 6: las carreras de la facultad elegida, o todas. */
  protected readonly opcionesCarrera = computed<OpcionSelect[]>(() =>
    this.carreras()
      .filter((c) => this.facultad() === null || c.idFacultad === this.facultad())
      .map((c) => ({ valor: c.idCarrera, etiqueta: c.nombre })),
  );

  protected readonly enviando = signal(false);
  protected readonly registrado = signal(false);
  /** Error del servicio (p. ej. 409 de número de inventario duplicado). */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  constructor() {
    conectarCarreraFacultad(this.formulario, this.carreras, inject(DestroyRef));
  }

  protected mensajeCampo(campo: CampoFormularioTesis): string | null {
    return errorCampo(this.formulario, campo, this.error());
  }

  /** RF10.1, pasos 9 a 11: tras registrar, el formulario queda vacío con la alerta de éxito. */
  protected registrar(): void {
    this.registrado.set(false);
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    this.tesis.registrarTesis(aSolicitud(this.formulario)).subscribe({
      next: () => {
        this.enviando.set(false);
        this.formulario.reset();
        this.registrado.set(true);
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.error.set(comoErrorRespuesta(error));
      },
    });
  }

  /** RF10.1, curso alternativo: «Cancelar» descarta los datos ingresados. */
  protected cancelar(): void {
    this.formulario.reset();
    this.error.set(null);
    this.registrado.set(false);
  }
}
