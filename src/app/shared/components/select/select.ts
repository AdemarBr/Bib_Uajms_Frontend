import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type ValorSelect = string | number | null;

export interface OpcionSelect {
  valor: ValorSelect;
  etiqueta: string;
}

/**
 * Select de Figma (borde gris, texto de 14 px y «⌄» a la derecha) sobre un `<select>` nativo.
 * Funciona con formularios reactivos (`formControlName`). El ancho lo define quien lo usa
 * (por ejemplo `class="w-60"`). La `etiqueta` es el texto que se muestra sin valor
 * elegido (p. ej. «Rol: Todos») y corresponde al valor `null`.
 */
@Component({
  selector: 'app-select',
  styleUrl: './select.css',
  templateUrl: './select.html',
  host: { class: 'block' },
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Select), multi: true }],
})
export class Select implements ControlValueAccessor {
  readonly opciones = input.required<readonly OpcionSelect[]>();
  readonly etiqueta = input('');
  /** Nombre accesible cuando no hay un `<label>` visible. */
  readonly nombreAccesible = input<string | null>(null);

  protected readonly valor = signal<ValorSelect>(null);
  protected readonly deshabilitado = signal(false);
  protected readonly indiceActual = computed(() =>
    this.opciones().findIndex((o) => o.valor === this.valor()),
  );

  private alCambiar: (valor: ValorSelect) => void = () => {};
  protected alTocar: () => void = () => {};

  protected seleccionar(select: HTMLSelectElement): void {
    const i = Number(select.value);
    const valor = i < 0 ? null : this.opciones()[i].valor;
    this.valor.set(valor);
    this.alCambiar(valor);
    // Si el formulario cambió el valor en el mismo evento (p. ej. lo devolvió a «sin elegir» para abrir una
    // ventana de confirmación), el `<select>` del navegador seguiría mostrando la opción elegida: se alinea aquí.
    const esperado = String(this.indiceActual());
    if (select.value !== esperado) select.value = esperado;
  }

  writeValue(valor: ValorSelect): void {
    this.valor.set(valor ?? null);
  }

  registerOnChange(fn: (valor: ValorSelect) => void): void {
    this.alCambiar = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.alTocar = fn;
  }

  setDisabledState(deshabilitado: boolean): void {
    this.deshabilitado.set(deshabilitado);
  }
}
