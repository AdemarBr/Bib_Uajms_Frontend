import { Service, signal } from '@angular/core';

import {
  HISTORIAL_RESERVAS_MOCK,
  HistorialReservaMock,
  RESERVAS_MOCK,
  ReservaMock,
} from './reservas.mock';

/**
 * Tablas reserva e historial_estado_reserva del prototipo, compartidas por las reservas propias (RF7) y la
 * administración de reservas (RF8). Solo existe en la Iteración 4, igual que `DatosCatalogo`.
 */
@Service()
export class DatosReservas {
  readonly reservas = signal<ReservaMock[]>(RESERVAS_MOCK);
  readonly historial = signal<HistorialReservaMock[]>(HISTORIAL_RESERVAS_MOCK);
}
