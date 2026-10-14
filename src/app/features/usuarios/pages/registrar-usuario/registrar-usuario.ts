import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Select } from '../../../../shared/components/select/select';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Bibliotecas } from '../../../estructura/data-access/bibliotecas';
import { CredencialesGeneradas } from '../../components/credenciales-generadas/credenciales-generadas';
import { Roles } from '../../data-access/roles';
import { Usuarios } from '../../data-access/usuarios';
import {
  aSolicitud,
  ajustarBiblioteca,
  crearFormularioUsuario,
  errorCampo,
} from '../../formulario-usuario';
import { RegistroUsuarioResponse } from '../../models/registro-usuario-response';

/** P2.1 Registrar usuario interno (RF2.1). */
@Component({
  imports: [ReactiveFormsModule, Select, Alerta, CredencialesGeneradas],
  selector: 'app-registrar-usuario',
  styleUrl: './registrar-usuario.css',
  templateUrl: './registrar-usuario.html',
})
export class RegistrarUsuario {
  private readonly usuarios = inject(Usuarios);

  /** RF2.4.3: solo los roles de personal interno. */
  private readonly roles = toSignal(
    inject(Roles)
      .listarRoles()
      .pipe(map((roles) => roles.filter((r) => r.tipoUsuario === 'interno'))),
    { initialValue: [] },
  );
  protected readonly opcionesRol = computed(() =>
    this.roles().map((r) => ({ valor: r.idRol, etiqueta: r.nombre })),
  );
  protected readonly opcionesBiblioteca = toSignal(
    inject(Bibliotecas)
      .listarBibliotecas()
      .pipe(map((lista) => lista.map((b) => ({ valor: b.idBiblioteca, etiqueta: b.nombre })))),
    { initialValue: [] },
  );

  protected readonly formulario = crearFormularioUsuario();
  protected readonly bibliotecaNoAplica = signal(false);
  protected readonly enviando = signal(false);
  /** Error del servicio: se muestran su título y detalle, y `errores[]` junto a cada campo. */
  protected readonly error = signal<ErrorRespuesta | null>(null);
  /** Credenciales generadas: se muestran una sola vez (RF2.1.6). */
  protected readonly credenciales = signal<RegistroUsuarioResponse | null>(null);

  constructor() {
    this.formulario.controls.idRol.valueChanges.pipe(takeUntilDestroyed()).subscribe((idRol) =>
      this.bibliotecaNoAplica.set(
        ajustarBiblioteca(
          this.formulario,
          this.roles().find((r) => r.idRol === idRol),
        ),
      ),
    );
  }

  protected mensajeCampo(campo: 'nombre' | 'correo' | 'idRol' | 'idBiblioteca'): string | null {
    return errorCampo(this.formulario, campo, this.error());
  }

  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    this.usuarios.registrarUsuario(aSolicitud(this.formulario)).subscribe({
      next: (respuesta) => {
        this.enviando.set(false);
        this.credenciales.set(respuesta);
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.error.set(comoErrorRespuesta(error));
      },
    });
  }

  /** Al cerrar, las credenciales ya no se pueden volver a ver y el formulario queda listo para otro registro. */
  protected cerrarCredenciales(): void {
    this.credenciales.set(null);
    this.formulario.reset();
    this.bibliotecaNoAplica.set(false);
  }
}
