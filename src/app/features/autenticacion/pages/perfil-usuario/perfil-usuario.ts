import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BadgeEstado } from '../../../../shared/components/badge-estado/badge-estado';
import { Perfil } from '../../data-access/perfil';
import { PerfilResponse } from '../../models/perfil-response';

interface Dato {
  etiqueta: string;
  valor: string;
}

const ADMINISTRADOR_GENERAL = 'Administrador general del sistema';

/** P1.2 Perfil de usuario (RF1.4): solo lectura, en secciones (RF1.4.4). */
@Component({
  imports: [BadgeEstado],
  selector: 'app-perfil-usuario',
  styleUrl: './perfil-usuario.css',
  templateUrl: './perfil-usuario.html',
})
export class PerfilUsuario {
  protected readonly perfil = toSignal(
    inject(Perfil)
      .obtenerPerfil()
      .pipe(catchError(() => of(null))),
  );

  /** Nombre completo, usuario y, cuando corresponde, correo institucional (RF1.4, paso 4). */
  protected readonly datosPersonales = computed<Dato[]>(() => {
    const p = this.perfil();
    if (!p) return [];
    const datos: Dato[] = [
      { etiqueta: 'Nombre completo', valor: p.nombre },
      { etiqueta: 'Usuario', valor: p.nombreUsuario },
    ];
    if (p.correo) datos.push({ etiqueta: 'Correo institucional', valor: p.correo });
    return datos;
  });

  /** Biblioteca o facultad y carrera según el tipo de usuario (RF1.4, paso 6). */
  protected readonly dependencia = computed<Dato | null>(() => {
    const p = this.perfil();
    return p ? dependenciaDe(p) : null;
  });
}

function dependenciaDe(p: PerfilResponse): Dato {
  if (p.rolNombre === ADMINISTRADOR_GENERAL) {
    return { etiqueta: 'Facultad / Carrera', valor: 'No aplica — acceso a todas' };
  }
  if (p.tipoUsuario === 'académico') {
    const valor = [p.facultadNombre, p.carreraNombre].filter(Boolean).join(' / ');
    return { etiqueta: 'Facultad / Carrera', valor: valor || '—' };
  }
  return { etiqueta: 'Biblioteca', valor: p.bibliotecaNombre ?? 'No aplica' };
}
