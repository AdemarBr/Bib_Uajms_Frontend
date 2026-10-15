import { Service, inject, signal } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { ROLES_CON_BIBLIOTECA } from '../../../core/config/constantes';
import { ErrorCampo, ErrorRespuesta } from '../../../shared/models/error-respuesta';
import { Pagina } from '../../../shared/models/pagina';
import { BibliotecaMock } from '../../estructura/data-access/bibliotecas.mock';
import { DatosEstructura } from '../../estructura/data-access/datos-estructura';
import { FiltroUsuarios } from '../models/filtro-usuarios';
import { RegistroUsuarioResponse } from '../models/registro-usuario-response';
import { RestablecerContrasenaResponse } from '../models/restablecer-contrasena-response';
import { UsuarioInternoRequest } from '../models/usuario-interno-request';
import { UsuarioResponse } from '../models/usuario-response';
import { ROLES_MOCK } from './roles.mock';
import { USUARIOS_MOCK } from './usuarios.mock';

const DEMORA_MS = 300;
const TAMANIO_PAGINA = 20;
const CARACTERES_CONTRASENA = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789#$%&*!';
const LARGO_CONTRASENA = 10;

/**
 * Usuarios del sistema (RF2). En la Iteración 5: GET/POST/PUT /usuarios, PATCH /usuarios/{id}/estado
 * y POST /usuarios/{id}/restablecer-contrasena. Lo registrado o editado dura hasta recargar la página.
 */
@Service()
export class Usuarios {
  private readonly usuarios = signal<UsuarioResponse[]>(USUARIOS_MOCK);
  /** Tabla biblioteca del prototipo, la misma de RF3 (lo registrado en P3.4 o editado en P3.5 se ve aquí). */
  private readonly estructura = inject(DatosEstructura);

  /** GET /usuarios?q&idRol&estado&tipoUsuario&idBiblioteca (RF2.2, RF2.2.1 y RF2.2.1.1). */
  listarUsuarios(filtro: FiltroUsuarios = {}): Observable<Pagina<UsuarioResponse>> {
    const q = normalizar(filtro.q ?? '');
    const coincidencias = this.usuarios().filter(
      (u) =>
        (!q ||
          [u.nombre, u.nombreUsuario, u.ru, u.rolNombre, u.bibliotecaNombre].some(
            (campo) => campo && normalizar(campo).includes(q),
          )) &&
        (filtro.idRol == null || u.idRol === filtro.idRol) &&
        (filtro.estado == null || u.estado === filtro.estado) &&
        (filtro.tipoUsuario == null || u.tipoUsuario === filtro.tipoUsuario) &&
        (filtro.idBiblioteca == null || u.idBiblioteca === filtro.idBiblioteca),
    );
    const pagina = filtro.pagina ?? 0;
    const tamanio = filtro.tamanio ?? TAMANIO_PAGINA;
    return of({
      contenido: coincidencias.slice(pagina * tamanio, (pagina + 1) * tamanio),
      pagina,
      tamanio,
      totalElementos: coincidencias.length,
    }).pipe(delay(DEMORA_MS));
  }

  /** GET /usuarios/{id} */
  obtenerUsuario(idUsuario: number): Observable<UsuarioResponse> {
    const usuario = this.usuarios().find((u) => u.idUsuario === idUsuario);
    return usuario ? of(usuario).pipe(delay(DEMORA_MS)) : noEncontrado();
  }

  /** POST /usuarios: genera el nombre de usuario y la contraseña, que se muestran una sola vez (RF2.1). */
  registrarUsuario(solicitud: UsuarioInternoRequest): Observable<RegistroUsuarioResponse> {
    const datos = validar(solicitud, this.estructura.bibliotecas(), null);
    if ('status' in datos) return throwError(() => datos).pipe(delay(DEMORA_MS));

    const usuarios = this.usuarios();
    const idUsuario = Math.max(0, ...usuarios.map((u) => u.idUsuario)) + 1;
    const nombreUsuario = generarNombreUsuario(
      datos.nombre,
      usuarios.map((u) => u.nombreUsuario),
    );
    this.usuarios.set([
      ...usuarios,
      {
        idUsuario,
        nombreUsuario,
        ru: null,
        estado: true,
        tipoUsuario: 'interno',
        idCarrera: null,
        carreraNombre: null,
        ...datos,
      },
    ]);
    return of({
      usuario: { idUsuario, nombreUsuario },
      contrasenaGenerada: generarContrasena(),
    }).pipe(delay(DEMORA_MS));
  }

  /** PUT /usuarios/{id}: nombre, correo, rol y biblioteca responsable (RF2.3, RF2.4 y RF2.5). */
  actualizarUsuario(
    idUsuario: number,
    solicitud: UsuarioInternoRequest,
  ): Observable<UsuarioResponse> {
    const actual = this.usuarios().find((u) => u.idUsuario === idUsuario);
    if (!actual || actual.tipoUsuario !== 'interno') return noEncontrado();
    const datos = validar(solicitud, this.estructura.bibliotecas(), actual.idBiblioteca);
    if ('status' in datos) return throwError(() => datos).pipe(delay(DEMORA_MS));

    const actualizado: UsuarioResponse = { ...actual, ...datos };
    this.reemplazar(actualizado);
    return of(actualizado).pipe(delay(DEMORA_MS));
  }

  /** PATCH /usuarios/{id}/estado (RF2.6 y RF2.7). */
  cambiarEstado(idUsuario: number, estado: boolean): Observable<void> {
    const actual = this.usuarios().find((u) => u.idUsuario === idUsuario);
    if (!actual) return noEncontrado();
    this.reemplazar({ ...actual, estado });
    return of(undefined).pipe(delay(DEMORA_MS));
  }

  /** POST /usuarios/{id}/restablecer-contrasena: solo cuentas internas (RF2.8). */
  restablecerContrasena(idUsuario: number): Observable<RestablecerContrasenaResponse> {
    const actual = this.usuarios().find((u) => u.idUsuario === idUsuario);
    if (!actual) return noEncontrado();
    if (actual.tipoUsuario !== 'interno') {
      const error: ErrorRespuesta = {
        status: 400,
        titulo: 'Operación no permitida',
        detalle: 'La cuenta no admite restablecimiento de contraseña por esta vía.',
        errores: [],
      };
      return throwError(() => error).pipe(delay(DEMORA_MS));
    }
    return of({ contrasenaGenerada: generarContrasena() }).pipe(delay(DEMORA_MS));
  }

  private reemplazar(usuario: UsuarioResponse): void {
    this.usuarios.update((lista) =>
      lista.map((u) => (u.idUsuario === usuario.idUsuario ? usuario : u)),
    );
  }
}

type DatosValidados = Pick<
  UsuarioResponse,
  'nombre' | 'correo' | 'idRol' | 'rolNombre' | 'idBiblioteca' | 'bibliotecaNombre'
>;

/**
 * Lo que el backend vuelve a validar: nombre obligatorio, rol interno y biblioteca según el rol (RF2.5).
 * Solo se asigna una biblioteca activa, salvo que el usuario conserve la que ya tenía (`idBibliotecaActual`).
 */
function validar(
  solicitud: UsuarioInternoRequest,
  bibliotecas: readonly BibliotecaMock[],
  idBibliotecaActual: number | null,
): DatosValidados | ErrorRespuesta {
  const errores: ErrorCampo[] = [];
  const nombre = solicitud.nombre.trim();
  if (!nombre) errores.push({ campo: 'nombre', mensaje: 'Es obligatorio.' });

  const rol = ROLES_MOCK.find((r) => r.idRol === solicitud.idRol && r.tipoUsuario === 'interno');
  if (!rol) errores.push({ campo: 'idRol', mensaje: 'Es obligatorio.' });

  const requiereBiblioteca = !!rol && ROLES_CON_BIBLIOTECA.includes(rol.nombre);
  const biblioteca = requiereBiblioteca
    ? bibliotecas.find((b) => b.idBiblioteca === solicitud.idBiblioteca)
    : undefined;
  if (requiereBiblioteca && !biblioteca) {
    errores.push({ campo: 'idBiblioteca', mensaje: 'Es obligatorio.' });
  } else if (biblioteca && !biblioteca.estado && biblioteca.idBiblioteca !== idBibliotecaActual) {
    errores.push({ campo: 'idBiblioteca', mensaje: 'La biblioteca seleccionada no está activa.' });
  }

  if (errores.length > 0 || !rol) {
    return {
      status: 400,
      titulo: 'Datos inválidos',
      detalle: 'Revise los campos marcados.',
      errores,
    };
  }
  return {
    nombre,
    correo: solicitud.correo?.trim() || null,
    idRol: rol.idRol,
    rolNombre: rol.nombre,
    idBiblioteca: biblioteca?.idBiblioteca ?? null,
    bibliotecaNombre: biblioteca?.nombre ?? null,
  };
}

function noEncontrado(): Observable<never> {
  const error: ErrorRespuesta = {
    status: 404,
    titulo: 'Usuario no encontrado',
    detalle: 'El usuario solicitado no existe.',
    errores: [],
  };
  return throwError(() => error).pipe(delay(DEMORA_MS));
}

/** Minúsculas y sin tildes, para comparar textos. */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Inicial del nombre y último apellido («Juan Pérez» → «jperez»), con un número si ya existe. */
function generarNombreUsuario(nombre: string, existentes: readonly string[]): string {
  const partes = normalizar(nombre)
    .split(/\s+/)
    .map((p) => p.replace(/[^a-z0-9]/g, ''))
    .filter(Boolean);
  const base =
    partes.length > 1 ? partes[0][0] + partes[partes.length - 1] : (partes[0] ?? 'usuario');
  let candidato = base;
  for (let n = 2; existentes.includes(candidato); n++) candidato = `${base}${n}`;
  return candidato;
}

/** Contraseña aleatoria con el generador criptográfico del navegador (en el backend, SecureRandom). */
function generarContrasena(): string {
  const valores = crypto.getRandomValues(new Uint32Array(LARGO_CONTRASENA));
  return Array.from(valores, (v) => CARACTERES_CONTRASENA[v % CARACTERES_CONTRASENA.length]).join(
    '',
  );
}
