import { Service, inject, signal } from '@angular/core';

import { DatosCatalogo, hoy } from '../../catalogo/data-access/datos-catalogo';
import { EstadoEjemplar } from '../../ejemplares/models/estado-ejemplar';
import { USUARIOS_MOCK } from '../../usuarios/data-access/usuarios.mock';
import { DevolucionResponse } from '../models/devolucion-response';
import { PrestamoResponse } from '../models/prestamo-response';
import {
  AMPLIACIONES_MOCK,
  AmpliacionMock,
  DEVOLUCIONES_MOCK,
  DevolucionMock,
  PRESTAMOS_MOCK,
  PrestamoMock,
} from './prestamos.mock';

/** Usuario académico de la tabla `usuario`, con lo que necesitan los préstamos. */
export interface AcademicoMock {
  idUsuario: number;
  nombre: string;
  ru: string;
  estado: boolean;
}

/**
 * Tablas prestamo, ampliacion_prestamo y devolucion del prototipo, compartidas por `Prestamos` y `Devoluciones`,
 * con el armado de las respuestas como lo haría el backend (join con usuario, ejemplar y libro). Solo existe en
 * la Iteración 4, igual que `DatosCatalogo` y `DatosReservas`.
 */
@Service()
export class DatosPrestamos {
  private readonly catalogo = inject(DatosCatalogo);

  readonly prestamos = signal<PrestamoMock[]>(PRESTAMOS_MOCK);
  readonly ampliaciones = signal<AmpliacionMock[]>(AMPLIACIONES_MOCK);
  readonly devoluciones = signal<DevolucionMock[]>(DEVOLUCIONES_MOCK);
  /** Usuarios académicos: los registrados y los que se registran al validar su RU (RF9.1, paso 4). */
  readonly academicos = signal<AcademicoMock[]>(
    USUARIOS_MOCK.filter((u) => u.tipoUsuario === 'académico' && u.ru !== null).map((u) => ({
      idUsuario: u.idUsuario,
      nombre: u.nombre,
      ru: u.ru ?? '',
      estado: u.estado,
    })),
  );

  aRespuesta(p: PrestamoMock): PrestamoResponse {
    const ejemplar = this.catalogo.ejemplares().find((e) => e.idEjemplar === p.idEjemplar);
    const libro = this.catalogo.libros().find((l) => l.idLibro === ejemplar?.idLibro);
    const usuario = this.academicos().find((u) => u.idUsuario === p.idUsuario);
    return {
      ...p,
      usuarioNombre: usuario?.nombre ?? '',
      usuarioRu: usuario?.ru ?? null,
      ejemplarCodigo: ejemplar?.codigoEjemplar ?? '',
      ejemplarEstado: ejemplar?.estado ?? 'disponible',
      libroTitulo: libro?.titulo ?? '',
      vencido:
        p.estado === 'activo' &&
        p.fechaLimiteDevolucion !== null &&
        p.fechaLimiteDevolucion < hoy(),
      cantidadAmpliaciones: this.ampliaciones().filter((a) => a.idPrestamo === p.idPrestamo).length,
    };
  }

  aDevolucion(d: DevolucionMock): DevolucionResponse {
    const fila = this.prestamos().find((p) => p.idPrestamo === d.idPrestamo);
    const prestamo = fila ? this.aRespuesta(fila) : null;
    const limite = prestamo?.fechaLimiteDevolucion ?? null;
    return {
      ...d,
      usuarioNombre: prestamo?.usuarioNombre ?? '',
      ejemplarCodigo: prestamo?.ejemplarCodigo ?? '',
      libroTitulo: prestamo?.libroTitulo ?? '',
      ejemplarEstado: prestamo?.ejemplarEstado ?? 'disponible',
      fechaPrestamo: prestamo?.fechaPrestamo ?? '',
      conRetraso: limite !== null && d.fechaDevolucion > limite,
    };
  }

  /** Biblioteca del ejemplar del préstamo, para el ámbito (docs/contrato-api.md, sección 10). */
  bibliotecaDe(p: PrestamoMock): number | null {
    return (
      this.catalogo.ejemplares().find((e) => e.idEjemplar === p.idEjemplar)?.idBiblioteca ?? null
    );
  }

  cambiarEstadoEjemplar(idEjemplar: number, estado: EstadoEjemplar): void {
    this.catalogo.ejemplares.update((lista) =>
      lista.map((e) => (e.idEjemplar === idEjemplar ? { ...e, estado } : e)),
    );
  }
}
