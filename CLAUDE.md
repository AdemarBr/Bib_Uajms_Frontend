# Biblioteca UAJMS — Frontend (Angular)

Sistema web de gestión de la Biblioteca Central UAJMS (libros, ejemplares, reservas, préstamos, tesis, comunicación y reportes). Proyecto de Taller 2 de Mendez Rossillon Briyan Ademar.

Este repositorio contiene solo el frontend. El backend (Spring Boot) está en otro repositorio, al que no tienes acceso.

## Fase actual: Iteración 4 — prototipo navegacional

- Se construyen **todas las pantallas** y la navegación entre ellas, idénticas a Figma.
- **No hay backend.** Los datos son falsos y viven en el frontend. No se usa `HttpClient` todavía.
- El inicio de sesión y la validación con el servicio institucional también se simulan dentro del frontend (ver «Autenticación simulada» y `docs/usuarios-falsos.md`).
- En la Iteración 5 se conectará al backend: solo cambiará el interior de los servicios de `data-access` y de `core/auth`. Los componentes no deben enterarse del cambio.

## Fuentes de verdad (leer antes de construir una pantalla)

| Necesito… | Archivo |
|---|---|
| Ruta, permiso, casos de uso y marco de Figma de cada pantalla | `docs/rutas.md` |
| Qué hace la pantalla (flujos y requerimientos) | `docs/casos-de-uso/rfNN-*.md` |
| Forma exacta de los datos (DTO) y endpoints futuros | `docs/contrato-api.md` |
| Permisos y roles | `docs/permisos.md` |
| Colores, tipografía, espaciado | `docs/diseno.md` |
| Usuarios de prueba y RU simulados | `docs/usuarios-falsos.md` |
| Reglas de negocio y de sesión | `docs/reglas-negocio.md` |
| Tablas y columnas (referencia) | `docs/modelo-datos.md` |
| Requerimientos generales y comunes | `docs/requerimientos-generales.md` |

**No inventes** campos, textos, pantallas, estados ni reglas. Si algo no está en `docs/` ni en Figma, o si `docs/` y Figma se contradicen, pregunta antes de seguir.

## Diseño en Figma

- Archivo: https://www.figma.com/design/a1bTBfFBoWOFxdfUamTrsd/Biblioteca-UAJMS (fileKey `a1bTBfFBoWOFxdfUamTrsd`).
- La última columna de `docs/rutas.md` tiene, para cada pantalla, el id de su marco (por ejemplo `10:3`) como enlace directo, más los ids de sus modales y pestañas.
- Para cada pantalla usa el MCP de Figma con el fileKey y el id de su marco: `get_design_context` para la estructura y los estilos, y `get_screenshot` para comparar el resultado. Reproduce textos, campos, botones, orden y estilos.
- No recorras el archivo completo ni pidas marcos que no necesitas: el uso del MCP puede tener límites según el plan de la cuenta. Si el MCP de Figma no está conectado o se alcanzó el límite, avísame en vez de continuar con suposiciones.
- El resultado de `get_design_context` es una referencia: adáptalo a las reglas de este archivo (Tailwind con los tokens de `docs/diseno.md`, componentes compartidos de `shared/`), no lo copies tal cual.

## Stack y reglas técnicas

- Angular en la versión estable con la que se creó el proyecto (ver `package.json`), con componentes **standalone** (sin `NgModule`).
- **Zoneless** (sin `zone.js`) y detección de cambios **OnPush** en todos los componentes (en Angular 22 ambos vienen por defecto; ver más abajo).
- Estado con **señales**: `signal`, `computed`; `effect` solo cuando sea imprescindible. Entradas y salidas con `input()`, `output()`, `model()`. Inyección con `inject()`.
- Servicios, componentes, guards, directivas y pipes se crean con `ng generate` y se mantiene la forma y los nombres que genera la versión instalada (guía de estilo 2025: sin sufijos `.component`/`.service`; por ejemplo, `ng g service core/auth/sesion` crea `sesion.ts` con la clase `Sesion`, y `ng g guard core/auth/sesion` crea `sesion-guard.ts` con `sesionGuard`).
- Plantillas con control de flujo nativo (`@if`, `@for` con `track`, `@switch`). Nada de `*ngIf` ni `*ngFor`.
- Formularios **reactivos tipados** (`FormGroup` con tipos, `nonNullable`), con las validaciones que indican los requerimientos del caso de uso.
- Cada componente en su propia carpeta con sus archivos `.ts`, `.html` y `.css` (el `.css` puede quedar vacío si basta Tailwind).
- Estilos con **Tailwind CSS v4**; los tokens de `docs/diseno.md` se definen con `@theme` en `src/styles.css`. Sin `tailwind.config.js` (v4 se configura en CSS). Sin Bootstrap ni otras librerías de componentes.
- Íconos: `@lucide/angular` (no el paquete antiguo `lucide-angular`). Gráficos: Chart.js con `ng2-charts`. Fuente: Inter, cargada desde Google Fonts con un `<link>` en `src/index.html` (pesos 400, 600 y 700, los de `docs/diseno.md`) y declarada como fuente base en el `@theme`.
- No agregues dependencias sin preguntarme.
- Diseño de escritorio a 1440 px, como Figma.
- Archivos y carpetas en kebab-case, con los nombres que genera Angular CLI. Nombres del dominio en español (`listarLibros`, `fechaLimiteDevolucion`); términos del framework en inglés.
- Sin pruebas automatizadas en esta iteración: no crees archivos `.spec.ts`; usa siempre `ng generate ... --skip-tests`.
- Nada de `localStorage`, `sessionStorage` ni cookies escritas desde el frontend.
- **Mensajes de error:** la pantalla muestra el `titulo` y el `detalle` del `ErrorRespuesta` que recibe (y `errores[].mensaje` junto a cada campo). Nunca escribas en un componente el texto de un error de negocio: en el prototipo ese texto vive en el servicio simulado (`data-access` o `core/auth`), igual que en la Iteración 5 vivirá en el backend. Solo son del frontend las validaciones del formulario antes de enviar (campo obligatorio, formato) y el mensaje sin conexión «No se pudo conectar con el servidor. Intente nuevamente.». Ver `docs/contrato-api.md`, sección 2.
- Angular 22 instalado: zoneless y OnPush ya vienen por defecto (no se declaran). `ng g service` genera `@Service()` (se provee solo en la raíz); se mantiene así. `provideRouter` usa `withComponentInputBinding()`: los parámetros de ruta y de consulta (`:id`, `?idReserva`) llegan como `input()` de la página.
- Formato con Prettier (`npx prettier --write --end-of-line auto "src/**/*.{ts,html,css}"`, configuración en `.prettierrc`; `--end-of-line auto` respeta el CRLF que deja Git en Windows).

## Base ya construida (reutilizar, no duplicar)

- Rutas raíz en `app.routes.ts`: todas van dentro de un único `LayoutAplicacion` (`core/layout/layout-aplicacion`: barra superior + pie; con sesión, además el menú lateral y el contenido con `p-3xl`), que elige según `Sesion.haySesion()` (RF1.2.10, «Guards, menú y permisos»). Las rutas públicas se escriben una sola vez y no llevan guard; las de tipo «sesión» o «permiso» llevan `sesionGuard` en su ruta raíz (`perfil`, `usuarios`, `estructura`…), y `/iniciar-sesion` lleva `sinSesionGuard`. Cada feature agrega sus rutas con `loadChildren` y `permisoGuard` + `data: { permisos: [PERMISOS.X] }` (lista = basta uno).
- Códigos de permiso: `core/config/permisos.ts` (`PERMISOS`, tipo `CodigoPermiso`). Constantes: `core/config/constantes.ts`.
- Menú lateral: `core/layout/menu-lateral/opciones-menu.ts` (textos de Figma, rutas y permisos de `docs/rutas.md`). Se despliega el módulo de la pantalla actual. Solo tiene opciones para pantallas que se abren sin un registro elegido; las pantallas de detalle se listan en `detalles` de la opción de su lista, que queda activa mientras están abiertas (ver «Guards, menú y permisos»).
- Directiva `*appTienePermiso` (`shared/directives/tiene-permiso.ts`): con `; else plantilla` muestra otra plantilla sin el permiso (p. ej. el nombre como texto plano en vez de enlace).
- Componentes compartidos (`shared/components/`): `app-tabla` (columnas + filas; plantillas por columna con `<ng-template appCelda="clave" let-fila>`; `mensajeVacio`), `app-paginador` (`pagina` desde 0, `tamanio`, `totalElementos`, salida `cambio`), `app-modal-confirmacion` (`titulo`, `mensaje`, `textoCancelar`, `textoConfirmar`, `abierto`, `procesando`; contenido proyectado para campos como «Motivo (opcional)»), `app-select` (ControlValueAccessor; `opciones` `{valor, etiqueta}`, `etiqueta` = texto sin valor elegido), `app-badge-estado` (`texto`), `app-interruptor` (`activo`, `etiqueta`; emite `cambio` sin cambiar solo, para confirmar antes), `app-alerta` (`titulo`, `mensaje`, `tono` `'error'` | `'exito'`; Alerta Tone=Error y Tone=Success de Figma).
- Botones y campos: clases `.btn-primario`, `.btn-secundario`, `.campo-texto` y `.radio` (sobre `<input type="radio">`) de `src/styles.css`.
- Anchos de Figma: el borde de Figma va por dentro y no cuenta en el ancho; en CSS sí, así que una tarjeta de N px en Figma se escribe `w-[N+2px]` (ver `docs/diseno.md`).
- Mensajes de error en pantalla: cada página guarda `error = signal<ErrorRespuesta | null>(null)` con `comoErrorRespuesta(error)` (`shared/models/error-respuesta.ts`; si el error no tiene la forma de `ErrorRespuesta`, da `ERROR_SIN_CONEXION`, «No se pudo conectar con el servidor. Intente nuevamente.»), muestra `<app-alerta [titulo]="e.titulo" [mensaje]="e.detalle" />` y, junto a cada campo, `error() | errorCampo: 'campo'` (pipe `shared/pipes/error-campo-pipe.ts`) después de la validación propia del formulario. En RF2, `errorCampo(formulario, campo, error)` de `formulario-usuario.ts` junta ambas. Un error al cambiar estado desde un modal se muestra dentro del modal, que sigue abierto.
- Modelos comunes en `shared/models/`: `Pagina<T>`, `ErrorRespuesta` (+ `ERROR_SIN_CONEXION`, `comoErrorRespuesta`), `LoginRequest`, `LoginResponse` (+ `UsuarioSesion`, `TipoUsuario`) y `UsuarioVerificadoResponse` (lo devuelve `validarRuSimulado` de `core/auth/servicio-institucional.mock.ts`).

## Estructura de carpetas

```
src/app/
├── core/                  # se carga una sola vez
│   ├── auth/              # sesion.ts (servicio Sesion), login-simulado.ts, sesion-guard.ts, sin-sesion-guard.ts, permiso-guard.ts, usuarios.mock.ts, servicio-institucional.mock.ts
│   ├── interceptors/      # token y errores: se crean y registran en la Iteración 5 con provideHttpClient(withInterceptors([...]))
│   ├── layout/            # barra superior, menú lateral (filtrado por permisos), pie; layout-aplicacion (uno solo, con menú solo con sesión)
│   └── config/            # constantes: códigos de permiso y PLAZO_MAXIMO_PRESTAMO_DIAS = 30
├── shared/
│   ├── components/        # tabla, paginador, modal de confirmación, select, badge de estado, interruptor, alerta
│   ├── directives/        # tiene-permiso.ts (directiva appTienePermiso)
│   ├── pipes/             # error-campo-pipe.ts (errorCampo); estados de reserva, préstamo y ejemplar; fechas; roles
│   └── models/            # Pagina<T>, ErrorRespuesta, LoginRequest, LoginResponse
└── features/
    ├── autenticacion/     # RF1
    ├── usuarios/          # RF2
    ├── estructura/        # RF3 bibliotecas, facultades, carreras
    ├── catalogo/          # RF4 gestión y RF6 consulta pública
    ├── ejemplares/        # RF5
    ├── reservas/          # RF7 y RF8
    ├── prestamos/         # RF9
    ├── tesis/             # RF10 gestión y RF11 consulta pública
    ├── comunicacion/      # RF12
    └── reportes/          # RF13
```

Dentro de cada feature:

```
features/<feature>/
├── pages/          # una por pantalla de Figma (contenedores: piden datos al servicio)
├── components/     # presentacionales: reciben input(), emiten output(), no usan servicios
├── data-access/    # servicio del recurso (p. ej. libros.ts, clase Libros) + archivo <recurso>.mock.ts con los datos falsos
├── models/         # interfaces TypeScript idénticas a los DTO de docs/contrato-api.md
└── <feature>.routes.ts   # rutas con carga diferida
```

## Patrón de datos (clave para la Iteración 5)

- Cada servicio de `data-access` expone métodos con la firma que tendrá con HTTP y **devuelve `Observable`** (`of(...)` con un pequeño `delay`) con la forma del DTO, incluida la paginación `Pagina<T>`. Los errores se devuelven con `throwError` y la forma de `ErrorRespuesta`.
- Los datos falsos viven en `<recurso>.mock.ts` y se cargan en un `signal` del servicio: lo que se registra o edita aparece en las listas durante la sesión y se pierde al recargar.
- Los valores de ejemplo de los datos falsos se toman de las pantallas de Figma (nombres, títulos, códigos, fechas) para que el prototipo se vea igual al diseño.
- Los componentes nunca importan archivos `.mock.ts`; solo usan el servicio. Para mostrar datos, `toSignal()` o el pipe `async`.
- Los modelos de `models/` copian exactamente los DTO de `docs/contrato-api.md`. Si una pantalla necesita un campo que no está, primero se agrega al contrato.
- La fecha límite del préstamo a domicilio se calcula como hoy + `PLAZO_MAXIMO_PRESTAMO_DIAS` y solo puede ajustarse hacia atrás (ver `docs/reglas-negocio.md`).

## Autenticación simulada (Iteración 4)

- `core/auth/login-simulado.ts` exporta una función `loginSimulado(solicitud: LoginRequest): Observable<LoginResponse>` que:
  - busca el usuario en `usuarios.mock.ts` (datos de `docs/usuarios-falsos.md`) y compara la contraseña;
  - si coinciden y el usuario está activo, devuelve exactamente la forma de `LoginResponse` del contrato, con `token: "token-simulado"`, `expiraEn: 900` y los permisos de su rol según `docs/permisos.md`;
  - si no, devuelve con `throwError` un `ErrorRespuesta` con `status: 401`, `titulo: "No se pudo iniciar sesión"` y `detalle: "El usuario o la contraseña no son válidos, o la cuenta no se encuentra vigente."` y `errores: []`: el mismo mensaje para cualquier fallo, sin indicar qué dato falló (RF1.2.4 y RF1.2.5).
- El servicio `Sesion` (`core/auth/sesion.ts`) es el único que llama a `loginSimulado`. Guarda la sesión **solo en memoria**, en señales (`usuario`, `rol`, `permisos`, `token`), y expone `iniciarSesion()`, `cerrarSesion()`, `tienePermiso(codigo)` y `haySesion` (computed). Al recargar la página la sesión se pierde y hay que volver a iniciar sesión: es lo esperado en el prototipo.
- La validación por RU de los préstamos (P9.1 y P9.3) usa `servicio-institucional.mock.ts` y devuelve `UsuarioVerificadoResponse` o un `ErrorRespuesta` 404 si el RU no está vigente.
- Las contraseñas de prueba existen solo en el prototipo; nunca van a la base de datos ni al backend.
- P1.1: ante cualquier error de login la pantalla muestra el `titulo` y el `detalle` del 401 que devuelve `loginSimulado` («No se pudo iniciar sesión» / «El usuario o la contraseña no son válidos, o la cuenta no se encuentra vigente.»), igual que el marco de Figma 10:3; no escribe el texto en el componente. El campo de usuario tiene el placeholder «Usuario o RU». Tras un login correcto vuelve a `returnUrl` (solo rutas internas) o, si no hay, a `/`.
- RF2 (decisiones del estudiante):
  - P2.5 y la descripción del rol en P2.3 muestran **módulos**, no permisos: se calculan con `modulosDePermisos()` (`core/config/permisos.ts`, `MODULOS_PERMISOS` = columna «Módulo» de `docs/permisos.md`). Se muestran los 8 roles y se sigue la matriz, no los chips de Figma. No hay campo `descripcion` en el contrato.
  - Biblioteca responsable obligatoria para Bibliotecario, Catalogador y Administrador de biblioteca (`ROLES_CON_BIBLIOTECA` en `core/config/constantes.ts`); para Administrador general y Responsable de tesis queda sin asignar y deshabilitada con «No aplica».
  - P2.2: el nombre enlaza a `/usuarios/:id/editar` solo para internos y con USUARIO_ACTUALIZAR (`*appTienePermiso` con `else`: sin el permiso se ve como texto plano); los académicos no tienen enlace pero sí interruptor de estado. Tabla vacía sin filtros: «No hay usuarios internos registrados.» + botón «Registrar usuario interno»; sin resultados: «Ningún usuario cumple los criterios seleccionados.» + «Limpiar filtros». «Guardar cambios» de P2.3 vuelve a P2.2 sin mensaje.
  - P2.3 muestra la línea «El nombre de usuario no puede modificarse» (RF2.3.4). P2.4 lista las coincidencias (solo internos) bajo el buscador y no tiene modal de confirmación.
  - Comprobantes: «Imprimir» llama a `window.print()`; la clase global `.imprimible` (`src/styles.css`) hace que solo ese elemento salga en papel, y lo que no debe imprimirse lleva `print:hidden`.
  - La lógica de formulario común de P2.1 y P2.3 está en `features/usuarios/formulario-usuario.ts`.
- RF3 (decisiones del estudiante):
  - Los servicios `Facultades`, `Carreras` y `Bibliotecas` comparten las tablas simuladas de `DatosEstructura` (`features/estructura/data-access/datos-estructura.ts`), que arma los nombres relacionados como lo haría el backend y desaparece en la Iteración 5. Duplicados (RF3.2, RF3.4 y RF3.6): `DatosEstructura` responde 409 con un `ErrorRespuesta` cuyo `detalle` es «Ya existe una facultad con ese nombre.», «Esa carrera ya está registrada en la facultad seleccionada.» o «Ya existe una biblioteca con ese nombre.»; la página muestra `titulo` y `detalle` con `app-alerta` bajo el botón. El texto vive en `DatosEstructura` (como en el backend), no en el componente.
  - P3.1: pestañas con chips y `?pestana=facultades|carreras|bibliotecas`; pestaña vacía: «Aún no hay facultades registradas.», «Aún no hay carreras registradas.» o «Aún no hay bibliotecas registradas.». Columna «Carreras»: «N carreras»; «Facultad / Carrera» de Bibliotecas: nombre completo de la facultad o de la carrera, o «No aplica» (Central y Postgrado).
  - Tras «Guardar» o «Guardar cambios» en P3.2 a P3.5 se vuelve a P3.1 en la pestaña del tipo guardado, sin mensaje.
  - P3.3 y P3.5: estado con `app-interruptor` (RF3.3.3, RF3.5.3 y RF3.7.3), no con el desplegable de Figma; campos deshabilitados y vacíos hasta elegir el registro. En P3.3 con «Facultad», «Carreras relacionadas» es de solo lectura (la relación se cambia desde cada carrera).
  - P3.5: con la Central, Facultad y Carrera deshabilitados y vacíos con «No aplica — Biblioteca Central», estado encendido y deshabilitado, y la línea de ayuda de Figma (solo con la Central). Con la de Postgrado (sin facultad ni carrera), Facultad y Carrera deshabilitados con «No aplica»; nombre, ubicación, descripción y estado editables.
  - Desplegables en cascada de P3.4 y P3.5: `features/estructura/pertenencia-biblioteca.ts` («Toda la facultad» → `idFacultad` con valor e `idCarrera` nulo).
  - Listas públicas y de gestión (`docs/contrato-api.md`, sección 5): `listarFacultades()`, `listarCarreras()` y `listarBibliotecas()` (GET públicos) devuelven solo los activos y se usan para registrar (P3.2, P3.4) y en RF2 (P2.1, P2.2, P2.3); `listarFacultadesEstructura()`, `listarCarrerasEstructura()` y `listarBibliotecasEstructura()` (`GET /estructura/...`) devuelven todos y se usan en P3.1, P3.3 y P3.5, también en sus desplegables de Facultad y Carrera, porque hay carreras y bibliotecas de facultades inactivas.
  - Solo se asignan bibliotecas activas a los usuarios. En P2.3, si la biblioteca actual del usuario no está entre las activas, se agrega al desplegable como «Nombre (inactiva)», con `idBiblioteca` y `bibliotecaNombre` del propio usuario (no se usa el endpoint de gestión). `Usuarios` valida la biblioteca contra `DatosEstructura`: en P2.1 y P2.3 solo acepta una activa, salvo en P2.3 cuando el usuario conserva su biblioteca actual aunque esté inactiva. Si no, responde 400 con «La biblioteca seleccionada no está activa.» en `idBiblioteca` (`docs/contrato-api.md`, sección 4). Los usuarios falsos guardan solo `idBiblioteca` (`UsuarioMock`); `bibliotecaNombre` se lee de `DatosEstructura` al armar cada `UsuarioResponse`, así un cambio de nombre en P3.5 se ve en P2.2 y P2.3.
- Perfil (P1.2): servicio `Perfil` (`features/autenticacion/data-access/perfil.ts`, `obtenerPerfil()` = `GET /auth/perfil`); qué se muestra según el usuario está en `docs/usuarios-falsos.md` («Perfil (P1.2)»).

## Guards, menú y permisos

- **Layout (RF1.2.10):** sin sesión, las pantallas públicas (P.1 Home, P6.1, P6.2, P11.1, P11.2) y el inicio de sesión (P1.1) usan el layout público, sin menú lateral (Figma 9:7). Con sesión activa, **todas** las pantallas, también las públicas (no P1.1), usan el layout privado con menú lateral (Home con sesión: Figma 396:132). Ese marco muestra el menú del Administrador general (todos los módulos): el menú no se copia fijo del diseño, es el mismo menú lateral de siempre, filtrado por los permisos del usuario. Ejemplos para comprobar en Home: `admin.general` ve todos los módulos; `catalogador.central`, solo Gestión de catálogo y Ejemplares; `2019001234` (Estudiante), solo Mis reservas y Comunicación. La barra superior con sesión mantiene «Catálogo» y «Tesis».
- Con sesión activa, entrar a `/iniciar-sesion` redirige a `/` (`sinSesionGuard`).
- Cerrar sesión (confirmación «¿Cerrar sesión?») lleva a `/` (RF1.5.4). Solo una sesión vencida o una renovación rechazada (Iteración 5) llevan a `/iniciar-sesion`.
- `sesionGuard` exige sesión: sin sesión redirige a `/iniciar-sesion` con `returnUrl` y, tras el login, vuelve a la ruta pedida.
- `permisoGuard` exige el permiso de la ruta según `docs/rutas.md` (si se indican dos con «o», basta uno); sin permiso redirige a `/`. Ruta inexistente → `/`.
- El menú lateral y los botones de acción usan la directiva `*appTienePermiso="'CODIGO'"`.
- El submenú solo muestra pantallas que se abren sin un registro elegido. Las que necesitan uno (columna «Acceso» de `docs/rutas.md`: «desde P2.2», «desde P4.3»…) no tienen opción en el menú: se abren desde su lista.
- Las pantallas de detalle marcan como activa la opción de su lista (`detalles` en `opciones-menu.ts`): P2.3 → Consultar usuarios del sistema; P4.4 y P4.5 → Consultar libros registrados; P5.3 → Consultar ejemplares registrados; P7.1 → Consultar estado de reserva; P10.2, P10.4 y P10.5 → Consultar tesis registradas; P12.2 → Bandeja de mensajes.
- Los enlaces y botones de una lista (o de cualquier pantalla) que abren otra pantalla usan `*appTienePermiso` con el permiso de la ruta de destino; un enlace sobre un nombre usa `; else` para que, sin el permiso, el nombre se vea como texto plano.
- La ruta de destino siempre lleva `permisoGuard` con su permiso de `docs/rutas.md`, aunque no esté en el menú: entrar por URL sin permiso lleva a `/`. El backend responde 403 sin el permiso.
- El frontend solo oculta; quien protege de verdad es el backend, que vuelve a verificar cada permiso.

## Sesión real (Iteración 5, no se implementa ahora)

Para que el diseño de ahora no lo impida. El detalle está en `docs/reglas-negocio.md` («Sesión») y en `docs/contrato-api.md` (sección 3):

- Token de acceso de 15 minutos, solo en memoria (la señal `token` del servicio `Sesion`); un interceptor lo envía en `Authorization: Bearer` a todas las rutas de la API **excepto** `/auth/login`, `/auth/refresh` y `/auth/cerrar-sesion` (un token vencido en esas llamadas haría fallar la renovación).
- Token de renovación en una cookie `HttpOnly` que el frontend no lee ni escribe; las llamadas a `/auth/*` van con `withCredentials: true`.
- Renovación anticipada: un minuto antes de que venza el token (`expiraEn` − 60 s), si hubo actividad del usuario (clic, tecla o navegación) en los últimos 15 minutos, se llama a `POST /auth/refresh`. Sin actividad no se renueva: el token y la cookie vencen y la sesión termina.
- Al cargar la aplicación se intenta `POST /auth/refresh` para recuperar la sesión. Si responde 401 en ese momento, simplemente no hay sesión: el visitante sigue en la página pública donde estaba (solo las rutas protegidas lo llevan a `/iniciar-sesion`).
- Un 401 en una renovación de una sesión que existía (cookie vencida, IP o navegador distintos, más de 8 horas, usuario desactivado) borra la sesión y lleva a `/iniciar-sesion`.

## Forma de trabajo

- Una pantalla o un módulo por tarea. Antes de escribir código: leer su caso de uso, su fila en `docs/rutas.md` y su marco en Figma.
- Orden: base (Tailwind con tokens, layout, menú, login simulado, guards, directiva de permisos, componentes compartidos) → RF1 → RF2 → … → RF13.
- Al terminar una pantalla, compárala con `get_screenshot` de su marco y corrige las diferencias.
- Git: `main` estable; una rama por funcionalidad (`feature/rf04-catalogo`). Commits pequeños y descriptivos.
- `docs/contrato-api.md` es compartido con el repositorio del backend, al que este repositorio no tiene acceso: si cambia aquí, avísame para que yo lo copie allá.

## Mantener docs/ y este archivo actualizados

Estos archivos son la memoria del proyecto entre sesiones: lo que no esté escrito aquí se olvida. Al terminar cada tarea, antes de darla por cerrada, revisa si lo hecho cambió algo de lo que describen y, si es así, actualízalos en la misma tarea:

- Se agregó, quitó o renombró una pantalla o una ruta → `docs/rutas.md`.
- Una pantalla necesitó un campo, DTO o endpoint que no estaba → `docs/contrato-api.md` (primero el contrato, después el código).
- Se usó un color, tamaño o espaciado nuevo de Figma → `docs/diseno.md`.
- Se cambiaron los usuarios o RU de prueba → `docs/usuarios-falsos.md`.
- Se decidió una regla técnica nueva (librería, convención, patrón) o se terminó una etapa del orden de trabajo → este `CLAUDE.md` (sección correspondiente y «Avance»).

Reglas:

- No modifiques `docs/casos-de-uso/`, `docs/requerimientos-generales.md`, `docs/reglas-negocio.md`, `docs/modelo-datos.md` ni `docs/permisos.md`: son copia del documento del proyecto o del backend, que es su fuente. Si el código los contradice o hace falta un cambio, avísame en vez de cambiarlos.
- Si cambiaste `docs/contrato-api.md`, termina tu respuesta con el aviso «Copiar docs/contrato-api.md al repositorio del backend», indicando qué cambió.
- Al final de cada tarea, indica en una línea qué archivos de `docs/` o de este `CLAUDE.md` actualizaste, o «docs/ sin cambios».

## Avance

Actualiza esta lista al terminar cada etapa (marca con [x]):

- [x] Base: Tailwind con tokens, layout, menú, login simulado, guards, directiva, componentes compartidos
- [x] RF1 Autenticación
- [x] RF2 Usuarios
- [x] RF3 Estructura
- [x] fix/layout-y-mensajes: layout de RF1.2.10 y mensajes de error desde el servicio
- [x] fix/bibliotecas-home: descripciones de las bibliotecas de Figma 9:7 en los datos falsos y en los docs
- [x] fix/endpoints-estructura: los GET públicos `/bibliotecas`, `/facultades` y `/carreras` devuelven solo los activos (Home y selectores); se agregan `GET /estructura/bibliotecas`, `/estructura/facultades` y `/estructura/carreras` con [ESTRUCTURA_CONSULTAR], que devuelven todos (P3.1, P3.3 y P3.5). No se usa un parámetro opcional en el endpoint público porque seguiría exponiendo los inactivos.
- [ ] RF4 Gestión del catálogo
  - RF4 en pausa (rama feature/rf04-catalogo). Se reanuda con las decisiones nuevas: casos de uso Activar libro (RF4.7) y Activar tesis (RF10.7), permisos LIBRO_CAMBIAR_ESTADO y TESIS_CAMBIAR_ESTADO, materia como texto libre, historial solo con fecha, filtros desde GET /libros/opciones-filtro
- [ ] RF5 Ejemplares
- [ ] RF6 Consulta del catálogo
  - Nota: la ruta de Home (`/`) debe tener `title` «Inicio · Biblioteca UAJMS» (hoy la pestaña conserva «Iniciar sesión · Biblioteca UAJMS» al volver del login).
- [ ] RF7 Reservas propias
- [ ] RF8 Administrar reservas
- [ ] RF9 Préstamos
- [ ] RF10 Gestión de tesis
- [ ] RF11 Consulta de tesis
- [ ] RF12 Comunicación
- [ ] RF13 Reportes y dashboards
