import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';

import { modulosDePermisos } from '../../../../core/config/permisos';
import { Alerta } from '../../../../shared/components/alerta/alerta';
import { ErrorRespuesta, comoErrorRespuesta } from '../../../../shared/models/error-respuesta';
import { Roles } from '../../data-access/roles';

/** P2.5 Consultar permisos por rol (RF2.9): cada rol con los módulos en los que tiene permisos. Solo lectura. */
@Component({
  imports: [Alerta],
  selector: 'app-permisos-rol',
  styleUrl: './permisos-rol.css',
  templateUrl: './permisos-rol.html',
})
export class PermisosRol {
  /** Error del servicio: se muestran su título y detalle. */
  protected readonly error = signal<ErrorRespuesta | null>(null);

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
        catchError((error: unknown) => {
          this.error.set(comoErrorRespuesta(error));
          return of([]);
        }),
      ),
  );
}
