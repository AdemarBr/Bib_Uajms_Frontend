import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, of, switchMap, tap } from 'rxjs';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { OpcionSelect, Select, ValorSelect } from '../../../../shared/components/select/select';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { ErrorCampoPipe } from '../../../../shared/pipes/error-campo-pipe';
import { Bibliotecas } from '../../data-access/bibliotecas';
import { Carreras } from '../../data-access/carreras';
import { Facultades } from '../../data-access/facultades';
import { aPertenencia, opcionesCarrera } from '../../pertenencia-biblioteca';

/**
 * P3.4 Registrar biblioteca física (RF3.6), con los desplegables encadenados Facultad y Carrera.
 * La Central y la de Postgrado no se registran aquí: toda biblioteca nueva es de una facultad o de una carrera.
 */
@Component({
  imports: [ReactiveFormsModule, Select, Alerta, ErrorCampoPipe],
  selector: 'app-registrar-biblioteca',
  styleUrl: './registrar-biblioteca.css',
  templateUrl: './registrar-biblioteca.html',
})
export class RegistrarBiblioteca {
  private readonly bibliotecas = inject(Bibliotecas);
  private readonly carreras = inject(Carreras);
  private readonly router = inject(Router);

  protected readonly opcionesFacultad = toSignal(
    inject(Facultades)
      .listarFacultades()
      .pipe(map((lista) => lista.map((f) => ({ valor: f.idFacultad, etiqueta: f.nombre })))),
    { initialValue: [] },
  );
  protected readonly opcionesCarrera = signal<OpcionSelect[]>([]);

  protected readonly formulario = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    ubicacion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descripcion: new FormControl('', { nonNullable: true }),
    idFacultad: new FormControl<ValorSelect>(null, { validators: [Validators.required] }),
    carrera: new FormControl<ValorSelect>(
      { value: null, disabled: true },
      { validators: [Validators.required] },
    ),
  });

  protected readonly carreraHabilitada = signal(false);
  protected readonly enviando = signal(false);
  /** Error del servicio (p. ej. 409 de registro duplicado): se muestran su título, detalle y errores por campo. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

  constructor() {
    const c = this.formulario.controls;
    // RF3.6, paso 6: al elegir la facultad se recargan sus carreras y se habilita Carrera.
    c.idFacultad.valueChanges
      .pipe(
        tap(() => {
          c.carrera.reset(null);
          c.carrera.disable();
          this.carreraHabilitada.set(false);
        }),
        switchMap((id) => (id === null ? of(null) : this.carreras.listarCarreras(id as number))),
        takeUntilDestroyed(),
      )
      .subscribe((carreras) => {
        if (carreras === null) return;
        this.opcionesCarrera.set(opcionesCarrera(carreras));
        c.carrera.enable();
        this.carreraHabilitada.set(true);
      });
  }

  protected campoVacio(campo: 'nombre' | 'ubicacion' | 'idFacultad' | 'carrera'): boolean {
    const control = this.formulario.controls[campo];
    return control.enabled && control.touched && control.invalid;
  }

  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const v = this.formulario.getRawValue();
    this.enviando.set(true);
    this.error.set(null);
    this.bibliotecas
      .registrarBiblioteca({
        nombre: v.nombre,
        ubicacion: v.ubicacion,
        descripcion: v.descripcion || null,
        ...aPertenencia(v.idFacultad, v.carrera),
      })
      .subscribe({
        next: () =>
          this.router.navigate(['/estructura'], { queryParams: { pestana: 'bibliotecas' } }),
        error: (error: unknown) => {
          this.enviando.set(false);
          this.error.set(comoErrorRespuesta(error));
        },
      });
  }
}
