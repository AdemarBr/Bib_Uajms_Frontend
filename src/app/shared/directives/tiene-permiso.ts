import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

import { Sesion } from '../../core/auth/sesion';

/**
 * Muestra el elemento solo si el usuario tiene el permiso (con una lista, basta con uno); si no, muestra
 * la plantilla `else`, si la hay. Solo oculta: quien protege de verdad es el backend.
 *
 * Uso: `<button *appTienePermiso="'USUARIO_REGISTRAR'">…</button>` o, para un enlace que sin permiso
 * queda como texto plano, `<a *appTienePermiso="'USUARIO_ACTUALIZAR'; else soloTexto">…</a>`.
 */
@Directive({
  selector: '[appTienePermiso]',
})
export class TienePermiso {
  readonly appTienePermiso = input.required<string | readonly string[]>();
  readonly appTienePermisoElse = input<TemplateRef<unknown> | null>(null);

  private readonly sesion = inject(Sesion);
  private readonly plantilla = inject(TemplateRef<unknown>);
  private readonly contenedor = inject(ViewContainerRef);
  private mostrada: TemplateRef<unknown> | null = null;

  constructor() {
    // effect: hay que crear o destruir la vista cuando cambian las entradas o los permisos de la sesión.
    effect(() => {
      const permitido = this.sesion.tienePermiso(this.appTienePermiso());
      const plantilla = permitido ? this.plantilla : this.appTienePermisoElse();
      if (plantilla === this.mostrada) return;
      this.contenedor.clear();
      if (plantilla) this.contenedor.createEmbeddedView(plantilla);
      this.mostrada = plantilla;
    });
  }
}
