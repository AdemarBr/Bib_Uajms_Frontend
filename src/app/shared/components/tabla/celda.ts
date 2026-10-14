import { Directive, TemplateRef, inject, input } from '@angular/core';

export interface ContextoCelda<T> {
  $implicit: T;
}

/**
 * Plantilla propia para una columna de `app-tabla`.
 *
 * Uso: `<ng-template appCelda="estado" let-fila>…{{ fila.estado }}…</ng-template>`
 */
@Directive({
  selector: '[appCelda]',
})
export class Celda {
  readonly appCelda = input.required<string>();
  readonly plantilla = inject<TemplateRef<ContextoCelda<any>>>(TemplateRef);

  static ngTemplateContextGuard(_dir: Celda, ctx: unknown): ctx is ContextoCelda<any> {
    return true;
  }
}
