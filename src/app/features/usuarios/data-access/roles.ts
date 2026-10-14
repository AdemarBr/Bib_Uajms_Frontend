import { Service, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { RolResponse } from '../models/rol-response';
import { ROLES_MOCK } from './roles.mock';

const DEMORA_MS = 300;

/** Roles y sus permisos (tablas rol, permiso y rol_permiso). Solo lectura (RF2.9.3). */
@Service()
export class Roles {
  private readonly roles = signal<RolResponse[]>(ROLES_MOCK);

  /** GET /roles */
  listarRoles(): Observable<RolResponse[]> {
    return of(this.roles()).pipe(delay(DEMORA_MS));
  }
}
