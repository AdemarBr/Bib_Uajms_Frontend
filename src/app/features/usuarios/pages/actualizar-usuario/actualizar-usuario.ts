import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';

import { Sesion } from '../../../../core/auth/sesion';
import { PERMISOS } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { Select } from '../../../../shared/components/select/select';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Bibliotecas } from '../../../estructura/data-access/bibliotecas';
import { Roles } from '../../data-access/roles';
import { Usuarios } from '../../data-access/usuarios';
import {
  aSolicitud,
  ajustarBiblioteca,
  crearFormularioUsuario,
  descripcionPermisos,
  errorCampo,
} from '../../formulario-usuario';
import { RolResponse } from '../../models/rol-response';

/**
 * P2.3 Actualizar datos de usuario (RF2.3), con la asignación de rol (RF2.4) y de biblioteca
 * responsable (RF2.5). Solo usuarios internos; los académicos no tienen enlace desde P2.2.
 */
@Component({
  imports: [ReactiveFormsModule, Select, Alerta],
  selector: 'app-actualizar-usuario',
  styleUrl: './actualizar-usuario.css',
  templateUrl: './actualizar-usuario.html',
})
export class ActualizarUsuario implements OnInit {
  private readonly usuarios = inject(Usuarios);
  private readonly rolesServicio = inject(Roles);
  private readonly router = inject(Router);
  private readonly sesion = inject(Sesion);

  /** Parámetro `:id` de la ruta. */
  readonly id = input.required<string>();

  private readonly roles = signal<RolResponse[]>([]);
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
  protected readonly cargado = signal(false);
  protected readonly enviando = signal(false);
  /** Error del servicio: se muestran su título y detalle, y `errores[]` junto a cada campo. */
  protected readonly error = signal<ErrorRespuesta | null>(null);
  protected readonly bibliotecaNoAplica = signal(false);
  private readonly rolSeleccionado = signal<RolResponse | undefined>(undefined);
  /** RF2.4.4: descripción de los permisos del rol antes de confirmar. */
  protected readonly descripcionRol = computed(() => descripcionPermisos(this.rolSeleccionado()));

  private readonly puedeAsignarBiblioteca = this.sesion.tienePermiso(
    PERMISOS.USUARIO_ASIGNAR_BIBLIOTECA,
  );

  constructor() {
    this.formulario.controls.idRol.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((idRol) => this.alCambiarRol(idRol as number | null));
  }

  ngOnInit(): void {
    forkJoin({
      usuario: this.usuarios.obtenerUsuario(Number(this.id())),
      roles: this.rolesServicio.listarRoles(),
    }).subscribe({
      next: ({ usuario, roles }) => {
        if (usuario.tipoUsuario !== 'interno') {
          this.router.navigateByUrl('/usuarios');
          return;
        }
        this.roles.set(roles.filter((r) => r.tipoUsuario === 'interno'));
        this.formulario.setValue({
          nombre: usuario.nombre,
          correo: usuario.correo ?? '',
          idRol: usuario.idRol,
          idBiblioteca: usuario.idBiblioteca,
        });
        if (!this.sesion.tienePermiso(PERMISOS.USUARIO_ASIGNAR_ROL)) {
          this.formulario.controls.idRol.disable();
        }
        this.alCambiarRol(usuario.idRol);
        this.cargado.set(true);
      },
      error: (error: unknown) => this.error.set(comoErrorRespuesta(error)),
    });
  }

  protected mensajeCampo(campo: 'nombre' | 'correo' | 'idRol' | 'idBiblioteca'): string | null {
    return errorCampo(this.formulario, campo, this.error());
  }

  /** RF2.3, curso alternativo: con datos inválidos no se aplica la modificación. */
  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    this.usuarios.actualizarUsuario(Number(this.id()), aSolicitud(this.formulario)).subscribe({
      next: () => this.router.navigateByUrl('/usuarios'),
      error: (error: unknown) => {
        this.enviando.set(false);
        this.error.set(comoErrorRespuesta(error));
      },
    });
  }

  private alCambiarRol(idRol: number | null): void {
    const rol = this.roles().find((r) => r.idRol === idRol);
    this.rolSeleccionado.set(rol);
    this.bibliotecaNoAplica.set(
      ajustarBiblioteca(this.formulario, rol, this.puedeAsignarBiblioteca),
    );
  }
}
