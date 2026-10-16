/** POST /prestamos/sala (P9.1); `idReserva` solo si viene de una reserva confirmada (RF8.8). */
export interface PrestamoSalaRequest {
  ru: string;
  idEjemplar: number;
  idReserva: number | null;
}
