import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { modulosDePermisos } from '../../../../core/config/permisos';
import { Roles } from '../../data-access/roles';

/** P2.5 Consultar permisos por rol (RF2.9): cada rol con los módulos en los que tiene permisos. Solo lectura. */
@Component({
  selector: 'app-permisos-rol',
  styleUrl: './permisos-rol.css',
  templateUrl: './permisos-rol.html',
})
export class PermisosRol {
  protected readonly roles = toSignal(
    inject(Roles)
      .listarRoles()
      .pipe(
        map((roles) =>
          roles.map((r) => ({
            idRol: r.idRol,
            nombre: r.nombre,
            modulos: modulosDePermisos(r.permisos.map((p) => p.codigo)),
          })),
        ),
      ),
  );
}
