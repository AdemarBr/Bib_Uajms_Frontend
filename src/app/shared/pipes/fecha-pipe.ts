import { Pipe, PipeTransform } from '@angular/core';

/**
 * Fecha ISO del contrato («2026-06-12», o con hora) como «12/06/2026», sin hora. Se toma del texto y no
 * con `Date`, que leería «2026-06-12» como medianoche UTC y en Bolivia (UTC−4) mostraría el día anterior.
 */
@Pipe({
  name: 'fecha',
})
export class FechaPipe implements PipeTransform {
  transform(valor: string | null | undefined): string {
    const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(valor ?? '');
    return partes ? `${partes[3]}/${partes[2]}/${partes[1]}` : '';
  }
}
