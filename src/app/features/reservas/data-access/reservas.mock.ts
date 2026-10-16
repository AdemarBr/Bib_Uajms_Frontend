import { EstadoReserva } from '../models/estado-reserva';
import { ReservaResponse } from '../models/reserva-response';

/** Fila de la tabla `reserva`: el libro, la biblioteca y los nombres se obtienen al responder. */
export type ReservaMock = Pick<
  ReservaResponse,
  'idReserva' | 'fecha' | 'estado' | 'atendida' | 'motivo' | 'idUsuario' | 'idEjemplar'
>;

/** Fila de la tabla `historial_estado_reserva` (`estadoAnterior` nulo en el registro inicial). */
export interface HistorialReservaMock {
  idHistorialReserva: number;
  fecha: string;
  estadoAnterior: EstadoReserva | null;
  estadoNuevo: EstadoReserva;
  idReserva: number;
}

/**
 * Reservas del prototipo. Las tres de Estudiante Pérez (id 12) son las filas de Figma P7.2 (22:1648); la de
 * «Derecho Civil Boliviano» pasa del 01/06 al 03/07/2026 para no ser anterior a su incorporación. La pendiente
 * es la del contrato (idReserva 3, EJ-00123). Las confirmadas usan ejemplares «reservado» de RF5
 * (EJ-00301 y EJ-00502). Las de otros usuarios sirven para RF8.
 */
export const RESERVAS_MOCK: ReservaMock[] = [
  {
    idReserva: 1,
    fecha: '2026-07-03',
    estado: 'Cancelada',
    atendida: false,
    motivo: null,
    idUsuario: 12,
    idEjemplar: 12,
  },
  {
    idReserva: 2,
    fecha: '2026-07-10',
    estado: 'Confirmada',
    atendida: false,
    motivo: null,
    idUsuario: 12,
    idEjemplar: 9,
  },
  {
    idReserva: 3,
    fecha: '2026-07-26',
    estado: 'Pendiente',
    atendida: false,
    motivo: null,
    idUsuario: 12,
    idEjemplar: 7,
  },
  {
    idReserva: 4,
    fecha: '2026-08-05',
    estado: 'Confirmada',
    atendida: false,
    motivo: null,
    idUsuario: 13,
    idEjemplar: 30,
  },
  {
    idReserva: 5,
    fecha: '2026-09-02',
    estado: 'Pendiente',
    atendida: false,
    motivo: null,
    idUsuario: 13,
    idEjemplar: 19,
  },
  {
    idReserva: 6,
    fecha: '2026-09-10',
    estado: 'Rechazada',
    atendida: false,
    motivo: null,
    idUsuario: 14,
    idEjemplar: 25,
  },
  // Figma P8.1 (22:1730): Docente Gómez · Cálculo I (EJ-00302) y Estudiante Rojas · Bases de Datos Avanzadas.
  {
    idReserva: 7,
    fecha: '2026-07-25',
    estado: 'Confirmada',
    atendida: false,
    motivo: null,
    idUsuario: 13,
    idEjemplar: 11,
  },
  {
    idReserva: 8,
    fecha: '2026-07-26',
    estado: 'Pendiente',
    atendida: false,
    motivo: null,
    idUsuario: 17,
    idEjemplar: 15,
  },
  // Figma P8.2 (22:1821), con fechas de agosto: la «Atendida» es Confirmada con atendida = true (EJ-00124, prestado).
  {
    idReserva: 9,
    fecha: '2026-08-20',
    estado: 'Confirmada',
    atendida: true,
    motivo: null,
    idUsuario: 12,
    idEjemplar: 8,
  },
  {
    idReserva: 10,
    fecha: '2026-08-15',
    estado: 'Cancelada',
    atendida: false,
    motivo: 'El usuario no se presentó a retirar el libro.',
    idUsuario: 13,
    idEjemplar: 9,
  },
  {
    idReserva: 11,
    fecha: '2026-08-02',
    estado: 'Rechazada',
    atendida: false,
    motivo: 'El ejemplar está en restauración.',
    idUsuario: 17,
    idEjemplar: 12,
  },
];

/** Registro inicial (Pendiente) de cada reserva y su cambio de estado, el mismo día. */
export const HISTORIAL_RESERVAS_MOCK: HistorialReservaMock[] = RESERVAS_MOCK.flatMap((r) => {
  const cambios: Omit<HistorialReservaMock, 'idHistorialReserva'>[] = [
    { fecha: r.fecha, estadoAnterior: null, estadoNuevo: 'Pendiente', idReserva: r.idReserva },
  ];
  if (r.estado !== 'Pendiente') {
    cambios.push({
      fecha: r.fecha,
      estadoAnterior: 'Pendiente',
      estadoNuevo: r.estado,
      idReserva: r.idReserva,
    });
  }
  return cambios;
}).map((h, i) => ({ ...h, idHistorialReserva: i + 1 }));
