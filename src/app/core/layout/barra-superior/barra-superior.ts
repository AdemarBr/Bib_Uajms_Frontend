import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideCircleUser } from '@lucide/angular';

import { Sesion } from '../../auth/sesion';
import { Alerta } from '../../../shared/components/alerta/alerta';
import { ModalConfirmacion } from '../../../shared/components/modal-confirmacion/modal-confirmacion';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../shared/models/error-respuesta';

/** Topbar de Figma: variante «Visitor» sin sesión y «Authenticated» con sesión. */
@Component({
  imports: [RouterLink, RouterLinkActive, LucideCircleUser, Alerta, ModalConfirmacion],
  selector: 'app-barra-superior',
  styleUrl: './barra-superior.css',
  templateUrl: './barra-superior.html',
})
export class BarraSuperior {
  protected readonly sesion = inject(Sesion);
  private readonly router = inject(Router);

  protected readonly confirmandoCierre = signal(false);
  protected readonly cerrando = signal(false);
  /** RF1.5, curso alternativo: si no se pudo cerrar, se informa y la sesión sigue activa. */
  protected readonly errorCierre = signal<ErrorRespuesta | null>(null);

  /** RF1.5: tras confirmar, termina la sesión y vuelve a P.1 Home. */
  protected cerrarSesion(): void {
    this.cerrando.set(true);
    this.errorCierre.set(null);
    this.sesion.cerrarSesion().subscribe({
      next: () => {
        this.cerrando.set(false);
        this.confirmandoCierre.set(false);
        this.router.navigateByUrl('/');
      },
      error: (error: unknown) => {
        this.cerrando.set(false);
        this.errorCierre.set(comoErrorRespuesta(error));
      },
    });
  }

  protected cancelarCierre(): void {
    this.confirmandoCierre.set(false);
    this.errorCierre.set(null);
  }
}
