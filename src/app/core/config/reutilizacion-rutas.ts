import { ActivatedRouteSnapshot, BaseRouteReuseStrategy } from '@angular/router';

/**
 * Por defecto Angular reutiliza el componente de una ruta cuando solo cambian sus parámetros (`:id`), y las
 * pantallas que cargan su registro en `ngOnInit` (P2.3, P4.4, P4.5, P5.3, P6.2, P7.1, P10.2, P10.4 y P10.5)
 * seguían mostrando el anterior. Esta estrategia recrea la pantalla cuando cambian los parámetros de su ruta, así
 * vuelve a cargar los datos sin salir de ella. Los parámetros de consulta (`?q`, `?pestana`, `?idReserva`) no
 * cuentan: esas pantallas ya los siguen con señales y se reutilizan.
 */
export class ReutilizacionRutas extends BaseRouteReuseStrategy {
  override shouldReuseRoute(
    futura: ActivatedRouteSnapshot,
    actual: ActivatedRouteSnapshot,
  ): boolean {
    return futura.routeConfig === actual.routeConfig && mismosParametros(futura, actual);
  }
}

function mismosParametros(a: ActivatedRouteSnapshot, b: ActivatedRouteSnapshot): boolean {
  const claves = Object.keys(a.params);
  return (
    claves.length === Object.keys(b.params).length &&
    claves.every((clave) => a.params[clave] === b.params[clave])
  );
}
