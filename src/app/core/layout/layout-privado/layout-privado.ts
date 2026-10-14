import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BarraSuperior } from '../barra-superior/barra-superior';
import { MenuLateral } from '../menu-lateral/menu-lateral';
import { PiePagina } from '../pie-pagina/pie-pagina';

/** Pantallas con sesión: barra superior, menú lateral filtrado por permisos y pie. */
@Component({
  imports: [RouterOutlet, BarraSuperior, MenuLateral, PiePagina],
  selector: 'app-layout-privado',
  styleUrl: './layout-privado.css',
  templateUrl: './layout-privado.html',
})
export class LayoutPrivado {}
