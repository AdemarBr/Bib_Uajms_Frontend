import { Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Sesion } from '../../../../core/auth/sesion';
import { Alerta } from '../../../../shared/components/alerta/alerta';

/** P1.1 Iniciar sesión (RF1.1 y RF1.2). */
@Component({
  imports: [ReactiveFormsModule, Alerta],
  selector: 'app-iniciar-sesion',
  styleUrl: './iniciar-sesion.css',
  templateUrl: './iniciar-sesion.html',
})
export class IniciarSesion {
  private readonly sesion = inject(Sesion);
  private readonly router = inject(Router);

  /** Ruta protegida que se pidió antes de iniciar sesión (la agregan los guards). */
  readonly returnUrl = input<string>();

  protected readonly formulario = new FormGroup({
    nombreUsuario: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contrasena: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly mostrarContrasena = signal(false);
  protected readonly enviando = signal(false);
  /** RF1.2.5: el mismo mensaje para cualquier fallo, sin indicar qué dato falló. */
  protected readonly credencialesRechazadas = signal(false);

  protected iniciarSesion(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.credencialesRechazadas.set(false);
    this.sesion.iniciarSesion(this.formulario.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl(this.destino()),
      error: () => {
        this.enviando.set(false);
        this.credencialesRechazadas.set(true);
      },
    });
  }

  protected campoVacio(campo: 'nombreUsuario' | 'contrasena'): boolean {
    const control = this.formulario.controls[campo];
    return control.touched && control.hasError('required');
  }

  /** Vuelve a la ruta pedida (solo rutas internas); sin ella, a P.1 Home. */
  private destino(): string {
    const url = this.returnUrl();
    return url && url.startsWith('/') && !url.startsWith('//') ? url : '/';
  }
}
