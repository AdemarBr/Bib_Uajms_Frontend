import { Component, computed, input, output } from '@angular/core';

type Elemento = { tipo: 'pagina'; numero: number } | { tipo: 'salto'; clave: string };

/**
 * Paginador de Figma («‹ 1 2 3 … 9 ›»). Trabaja con `Pagina<T>`: `pagina` empieza en 0
 * y `cambio` emite el número de página (desde 0) que se pide.
 */
@Component({
  selector: 'app-paginador',
  styleUrl: './paginador.css',
  templateUrl: './paginador.html',
})
export class Paginador {
  readonly pagina = input.required<number>();
  readonly tamanio = input.required<number>();
  readonly totalElementos = input.required<number>();

  readonly cambio = output<number>();

  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.totalElementos() / this.tamanio())),
  );

  /** Primera, última, la actual con sus vecinas y «…» en los huecos (páginas desde 1). */
  protected readonly elementos = computed<Elemento[]>(() => {
    const total = this.totalPaginas();
    const actual = this.pagina() + 1;
    const visibles = new Set([1, total, actual - 1, actual, actual + 1]);
    if (actual <= 2) [2, 3].forEach((n) => visibles.add(n));
    if (actual >= total - 1) [total - 1, total - 2].forEach((n) => visibles.add(n));

    const numeros = [...visibles].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const elementos: Elemento[] = [];
    numeros.forEach((n, i) => {
      if (i > 0 && n - numeros[i - 1] > 1) elementos.push({ tipo: 'salto', clave: `salto-${n}` });
      elementos.push({ tipo: 'pagina', numero: n });
    });
    return elementos;
  });

  protected ir(numero: number): void {
    const destino = numero - 1;
    if (destino !== this.pagina() && destino >= 0 && destino < this.totalPaginas()) {
      this.cambio.emit(destino);
    }
  }
}
