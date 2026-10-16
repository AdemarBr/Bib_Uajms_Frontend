import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Alerta } from '../../../../shared/components/alerta/alerta';
import { BadgeEstado } from '../../../../shared/components/badge-estado/badge-estado';
import { ModalConfirmacion } from '../../../../shared/components/modal-confirmacion/modal-confirmacion';
import { ErrorCampoPipe } from '../../../../shared/pipes/error-campo-pipe';
import { ListaEjemplares } from '../../components/lista-ejemplares/lista-ejemplares';
import { dma, fechaLimitePropuesta, rangoFechaLimite } from '../../fechas-prestamo';
import { PrestamoResponse } from '../../models/prestamo-response';
import { PrestamoSalaRequest } from '../../models/prestamo-sala-request';
import { RegistroPrestamo } from '../../registro-prestamo';

/**
 * P9.3 Registrar préstamo a domicilio (RF9.2, RF9.2.2 a RF9.2.6 y RF9.2.12; Figma 22:2056 y modal 312:5390).
 * Además de lo común con P9.1: celular de contacto (8 dígitos) y fecha de devolución calculada (hoy + 30 días),
 * ajustable hacia atrás hasta mañana; «Confirmar fecha» es opcional y, fuera de rango, restablece la calculada.
 */
@Component({
  imports: [
    ReactiveFormsModule,
    Alerta,
    BadgeEstado,
    ErrorCampoPipe,
    ListaEjemplares,
    ModalConfirmacion,
  ],
  selector: 'app-registrar-prestamo-domicilio',
  styleUrl: './registrar-prestamo-domicilio.css',
  templateUrl: './registrar-prestamo-domicilio.html',
})
export class RegistrarPrestamoDomicilio extends RegistroPrestamo {
  protected readonly celular = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^\d{8}$/)],
  });
  protected readonly fechaLimite = new FormControl(fechaLimitePropuesta(), { nonNullable: true });
  protected readonly rango = signal(rangoFechaLimite());
  /** Mensaje de RF9.2.5 cuando la fecha ajustada queda fuera de rango y se restablece la calculada. */
  protected readonly errorFecha = signal<string | null>(null);

  /** Mensaje junto al celular: la validación del formulario o el 400 del servicio. */
  protected mensajeCelular(): string | null {
    if (this.celular.touched && this.celular.invalid) {
      return this.celular.hasError('required')
        ? 'Es obligatorio.'
        : 'El celular de contacto debe tener 8 dígitos.';
    }
    return null;
  }

  /** RF9.2.5, pasos 5 y 6: la fecha debe quedar entre mañana y hoy + 30 días. */
  protected confirmarFecha(): boolean {
    const { minima, maxima } = rangoFechaLimite();
    this.rango.set({ minima, maxima });
    const fecha = this.fechaLimite.value;
    if (fecha && fecha >= minima && fecha <= maxima) {
      this.errorFecha.set(null);
      return true;
    }
    this.fechaLimite.setValue(maxima);
    this.errorFecha.set(
      `La fecha de devolución debe estar entre el ${dma(minima)} y el ${dma(maxima)}.`,
    );
    return false;
  }

  protected override validarFormulario(): boolean {
    this.celular.markAsTouched();
    const fechaValida = this.confirmarFecha();
    return this.celular.valid && fechaValida;
  }

  protected override reiniciarPropios(): void {
    this.celular.reset('');
    this.fechaLimite.reset(fechaLimitePropuesta());
    this.errorFecha.set(null);
  }

  protected enviar(datos: PrestamoSalaRequest): Observable<PrestamoResponse> {
    return this.prestamos.registrarPrestamoDomicilio({
      ...datos,
      fechaLimiteDevolucion: this.fechaLimite.value,
      celularContacto: this.celular.value.trim(),
    });
  }
}
