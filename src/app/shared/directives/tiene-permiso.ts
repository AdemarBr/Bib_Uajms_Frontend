import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

import { Sesion } from '../../core/auth/sesion';

/**
 * Muestra el elemento solo si el usuario tiene el permiso (con una lista, basta con uno).
 * Solo oculta: quien protege de verdad es el backend.
 *
 * Uso: `<button *appTienePermiso="'USUARIO_REGISTRAR'">…</button>`
 */
@Directive({
  selector: '[appTienePermiso]',
})
export class TienePermiso {
  readonly appTienePermiso = input.required<string | readonly string[]>();

  private readonly sesion = inject(Sesion);
  private readonly plantilla = inject(TemplateRef<unknown>);
  private readonly contenedor = inject(ViewContainerRef);
  private visible = false;

  constructor() {
    // effect: hay que crear o destruir la vista cuando cambian la entrada o los permisos de la sesión.
    effect(() => {
      const permitido = this.sesion.tienePermiso(this.appTienePermiso());
      if (permitido && !this.visible) {
        this.contenedor.createEmbeddedView(this.plantilla);
      } else if (!permitido && this.visible) {
        this.contenedor.clear();
      }
      this.visible = permitido;
    });
  }
}
