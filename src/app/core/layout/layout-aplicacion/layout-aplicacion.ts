import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sesion } from '../../auth/sesion';
import { BarraSuperior } from '../barra-superior/barra-superior';
import { MenuLateral } from '../menu-lateral/menu-lateral';
import { PiePagina } from '../pie-pagina/pie-pagina';

/**
 * Layout de todas las pantallas (RF1.2.10): barra superior y pie; con sesión activa, además el menú
 * lateral filtrado por permisos (Figma 396:132). Sin sesión, sin menú (Figma 9:7). P1.1 solo se ve
 * sin sesión (`sinSesionGuard`).
 */
@Component({
  imports: [RouterOutlet, BarraSuperior, MenuLateral, PiePagina],
  selector: 'app-layout-aplicacion',
  styleUrl: './layout-aplicacion.css',
  templateUrl: './layout-aplicacion.html',
})
export class LayoutAplicacion {
  protected readonly sesion = inject(Sesion);
}
