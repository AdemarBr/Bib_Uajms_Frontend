import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BarraSuperior } from '../barra-superior/barra-superior';
import { PiePagina } from '../pie-pagina/pie-pagina';

/** Pantallas públicas (P.1, P1.1, P6.x, P11.x): barra superior y pie, sin menú lateral. */
@Component({
  imports: [RouterOutlet, BarraSuperior, PiePagina],
  selector: 'app-layout-publico',
  styleUrl: './layout-publico.css',
  templateUrl: './layout-publico.html',
})
export class LayoutPublico {}
