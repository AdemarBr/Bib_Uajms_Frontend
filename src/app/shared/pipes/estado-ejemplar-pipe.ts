import { Pipe, PipeTransform } from '@angular/core';

/** Estado del ejemplar como se muestra en pantalla: «disponible» → «Disponible», «no disponible» → «No disponible». */
@Pipe({
  name: 'estadoEjemplar',
})
export class EstadoEjemplarPipe implements PipeTransform {
  transform(estado: string | null | undefined): string {
    return estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : '';
  }
}
