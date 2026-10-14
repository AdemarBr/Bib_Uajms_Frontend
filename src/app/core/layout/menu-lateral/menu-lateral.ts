import { Component, computed, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { filter, map } from 'rxjs';

import { Sesion } from '../../auth/sesion';
import { MODULOS_MENU, ModuloMenu, OpcionMenu } from './opciones-menu';

interface OpcionVisible extends OpcionMenu {
  enlace: string;
  activa: boolean;
  /** Encabezado a mostrar antes de esta opción, si empieza un grupo. */
  encabezado: string | null;
}

interface ModuloVisible extends Omit<ModuloMenu, 'opciones'> {
  opciones: OpcionVisible[];
  activo: boolean;
}

/** Patrón de docs/rutas.md (`/usuarios/:id/editar`) → expresión regular exacta. */
function patron(ruta: string): RegExp {
  return new RegExp('^' + ruta.replace(/:[^/]+/g, '[^/]+') + '$');
}

const PATRONES = new Map<string, RegExp>(
  MODULOS_MENU.flatMap((m) => m.opciones).map((o) => [o.ruta, patron(o.ruta)]),
);

@Component({
  imports: [RouterLink, LucideDynamicIcon],
  selector: 'app-menu-lateral',
  styleUrl: './menu-lateral.css',
  templateUrl: './menu-lateral.html',
})
export class MenuLateral {
  private readonly sesion = inject(Sesion);
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  private readonly rutaActual = computed(() => this.url().split(/[?#]/)[0]);

  /** Solo los módulos y opciones cuyo permiso tiene el usuario. */
  protected readonly modulos = computed<ModuloVisible[]>(() => {
    const ruta = this.rutaActual();
    return MODULOS_MENU.map((modulo) => {
      let grupoAnterior: string | undefined;
      const opciones = modulo.opciones
        .filter((o) => this.sesion.tienePermiso(o.permisos))
        .map((o) => {
          const encabezado = o.grupo && o.grupo !== grupoAnterior ? o.grupo : null;
          grupoAnterior = o.grupo;
          return {
            ...o,
            enlace: o.destino ?? o.ruta,
            activa: PATRONES.get(o.ruta)!.test(ruta),
            encabezado,
          };
        });
      return { ...modulo, opciones, activo: opciones.some((o) => o.activa) };
    }).filter((m) => m.opciones.length > 0);
  });

  private readonly moduloActivo = computed(
    () => this.modulos().find((m) => m.activo)?.texto ?? null,
  );

  /** Módulo desplegado: el de la pantalla actual, hasta que el usuario abra o cierre otro. */
  protected readonly moduloAbierto = linkedSignal(() => this.moduloActivo());

  protected alternar(modulo: string): void {
    this.moduloAbierto.update((abierto) => (abierto === modulo ? null : modulo));
  }
}
