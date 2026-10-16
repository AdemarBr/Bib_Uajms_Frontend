import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { ModalConfirmacion } from '../../../../shared/components/modal-confirmacion/modal-confirmacion';
import { ListaEjemplares } from '../../components/lista-ejemplares/lista-ejemplares';
import { PrestamoResponse } from '../../models/prestamo-response';
import { PrestamoSalaRequest } from '../../models/prestamo-sala-request';
import { RegistroPrestamo } from '../../registro-prestamo';

/**
 * P9.1 Registrar préstamo en sala (RF9.1, RF9.1.2, RF9.1.3, RF9.1.4 y RF9.1.8; Figma 22:1915 y modal 312:5378).
 * Con `?idReserva` (RF8.8), el usuario y el ejemplar llegan precargados desde la reserva confirmada.
 */
@Component({
  imports: [ReactiveFormsModule, Alerta, ListaEjemplares, ModalConfirmacion],
  selector: 'app-registrar-prestamo-sala',
  styleUrl: './registrar-prestamo-sala.css',
  templateUrl: './registrar-prestamo-sala.html',
})
export class RegistrarPrestamoSala extends RegistroPrestamo {
  protected enviar(datos: PrestamoSalaRequest): Observable<PrestamoResponse> {
    return this.prestamos.registrarPrestamoSala(datos);
  }
}
