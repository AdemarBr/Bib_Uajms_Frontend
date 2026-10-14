import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Usuarios } from '../../data-access/usuarios';
import { UsuarioResponse } from '../../models/usuario-response';

/** Cuentas que se listan como coincidencias de la búsqueda. */
const MAXIMO_COINCIDENCIAS = 50;

/**
 * P2.4 Restablecer contraseña de usuario interno (RF2.8). Solo se buscan cuentas internas: los
 * académicos no tienen contraseña en el sistema. El clic en «Restablecer contraseña» es la confirmación.
 */
@Component({
  imports: [ReactiveFormsModule, Alerta],
  selector: 'app-restablecer-contrasena',
  styleUrl: './restablecer-contrasena.css',
  templateUrl: './restablecer-contrasena.html',
})
export class RestablecerContrasena {
  private readonly usuarios = inject(Usuarios);

  protected readonly criterio = new FormControl('', { nonNullable: true });
  /** Coincidencias de la última búsqueda (RF2.8.4); null antes de buscar. */
  protected readonly coincidencias = signal<UsuarioResponse[] | null>(null);
  protected readonly seleccionado = signal<UsuarioResponse | null>(null);
  protected readonly contrasenaNueva = signal<string | null>(null);
  protected readonly buscando = signal(false);
  protected readonly restableciendo = signal(false);

  protected buscar(): void {
    this.buscando.set(true);
    this.usuarios
      .listarUsuarios({
        q: this.criterio.value.trim(),
        tipoUsuario: 'interno',
        tamanio: MAXIMO_COINCIDENCIAS,
      })
      .subscribe({
        next: (pagina) => {
          this.buscando.set(false);
          this.coincidencias.set(pagina.contenido);
        },
        error: () => this.buscando.set(false),
      });
  }

  protected seleccionar(usuario: UsuarioResponse): void {
    this.seleccionado.set(usuario);
    this.coincidencias.set(null);
    this.contrasenaNueva.set(null);
  }

  protected restablecer(): void {
    const usuario = this.seleccionado();
    if (!usuario) return;
    this.restableciendo.set(true);
    this.usuarios.restablecerContrasena(usuario.idUsuario).subscribe({
      next: (respuesta) => {
        this.restableciendo.set(false);
        this.contrasenaNueva.set(respuesta.contrasenaGenerada);
      },
      error: () => this.restableciendo.set(false),
    });
  }

  /** RF2.8, paso 8: el comprobante se imprime y no se envía por ningún otro medio. */
  protected imprimir(): void {
    window.print();
  }
}
