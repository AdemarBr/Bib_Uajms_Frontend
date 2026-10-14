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
- **Zoneless**: la aplicación funciona sin `zone.js` (es el comportamiento por defecto de los proyectos nuevos; si no lo fuera, se activa con `provideZonelessChangeDetection()` en `app.config.ts`).
- Todos los componentes con detección de cambios **OnPush**. Si la versión instalada ya lo aplica por defecto, no hace falta declararlo; si no, se declara `ChangeDetectionStrategy.OnPush`.
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
- Angular 22 instalado: zoneless y OnPush ya vienen por defecto (no se declaran). `ng g service` genera `@Service()` (se provee solo en la raíz); se mantiene así. `provideRouter` usa `withComponentInputBinding()`: los parámetros de ruta y de consulta (`:id`, `?idReserva`) llegan como `input()` de la página.
- Formato con Prettier (`npx prettier --write --end-of-line auto "src/**/*.{ts,html,css}"`, configuración en `.prettierrc`; `--end-of-line auto` respeta el CRLF que deja Git en Windows).

## Base ya construida (reutilizar, no duplicar)

- Rutas raíz en `app.routes.ts`: las públicas van dentro de `LayoutPublico` (barra superior + pie) y las de sesión o permiso dentro de `LayoutPrivado` (además, menú lateral; ya tiene `sesionGuard`). Cada feature agrega sus rutas con `loadChildren` y `permisoGuard` + `data: { permisos: [PERMISOS.X] }` (lista = basta uno).
- Códigos de permiso: `core/config/permisos.ts` (`PERMISOS`, tipo `CodigoPermiso`). Constantes: `core/config/constantes.ts`.
- Menú lateral: `core/layout/menu-lateral/opciones-menu.ts` (textos de Figma, rutas y permisos de `docs/rutas.md`). Se despliega el módulo de la pantalla actual. Las opciones cuya pantalla necesita un id (p. ej. «Actualizar datos de usuario») llevan a la pantalla desde donde se elige el registro (`destino`) y se marcan activas cuando se está en la pantalla con id.
- Componentes compartidos (`shared/components/`): `app-tabla` (columnas + filas; plantillas por columna con `<ng-template appCelda="clave" let-fila>`; `mensajeVacio`), `app-paginador` (`pagina` desde 0, `tamanio`, `totalElementos`, salida `cambio`), `app-modal-confirmacion` (`titulo`, `mensaje`, `textoCancelar`, `textoConfirmar`, `abierto`, `procesando`; contenido proyectado para campos como «Motivo (opcional)»), `app-select` (ControlValueAccessor; `opciones` `{valor, etiqueta}`, `etiqueta` = texto sin valor elegido), `app-badge-estado` (`texto`), `app-interruptor` (`activo`, `etiqueta`; emite `cambio` sin cambiar solo, para confirmar antes), `app-alerta` (`titulo`, `mensaje`; Alerta Tone=Error de Figma).
- Botones y campos: clases `.btn-primario`, `.btn-secundario`, `.campo-texto` de `src/styles.css`.
- Modelos comunes en `shared/models/`: `Pagina<T>`, `ErrorRespuesta`, `LoginRequest`, `LoginResponse` (+ `UsuarioSesion`, `TipoUsuario`) y `UsuarioVerificadoResponse` (lo devuelve `validarRuSimulado` de `core/auth/servicio-institucional.mock.ts`).

## Estructura de carpetas

```
src/app/
├── core/                  # se carga una sola vez
│   ├── auth/              # sesion.ts (servicio Sesion), login-simulado.ts, sesion-guard.ts, permiso-guard.ts, usuarios.mock.ts, servicio-institucional.mock.ts
│   ├── interceptors/      # token y errores: se crean y registran en la Iteración 5 con provideHttpClient(withInterceptors([...]))
│   ├── layout/            # barra superior, menú lateral (filtrado por permisos), pie; layout público y privado
│   └── config/            # constantes: códigos de permiso y PLAZO_MAXIMO_PRESTAMO_DIAS = 30
├── shared/
│   ├── components/        # tabla, paginador, modal de confirmación, select, badge de estado, interruptor
│   ├── directives/        # tiene-permiso.ts (directiva appTienePermiso)
│   ├── pipes/             # estados de reserva, préstamo y ejemplar; fechas; roles
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
  - si no, devuelve con `throwError` un `ErrorRespuesta` con `status: 401`, `titulo: "Credenciales no válidas"` y `detalle: "El usuario o la contraseña no son válidos, o la cuenta no se encuentra vigente."`: el mismo mensaje para cualquier fallo, sin indicar qué dato falló (RF1.2.4 y RF1.2.5).
- El servicio `Sesion` (`core/auth/sesion.ts`) es el único que llama a `loginSimulado`. Guarda la sesión **solo en memoria**, en señales (`usuario`, `rol`, `permisos`, `token`), y expone `iniciarSesion()`, `cerrarSesion()`, `tienePermiso(codigo)` y `haySesion` (computed). Al recargar la página la sesión se pierde y hay que volver a iniciar sesión: es lo esperado en el prototipo.
- La validación por RU de los préstamos (P9.1 y P9.3) usa `servicio-institucional.mock.ts` y devuelve `UsuarioVerificadoResponse` o un `ErrorRespuesta` 404 si el RU no está vigente.
- Las contraseñas de prueba existen solo en el prototipo; nunca van a la base de datos ni al backend.
- P1.1 (decisión del estudiante): ante cualquier error de login la pantalla muestra el texto de Figma, «No se pudo iniciar sesión» / «Usuario o contraseña incorrectos.», y no el `titulo`/`detalle` del 401 (que se mantiene igual en el contrato y en `loginSimulado`). El campo de usuario tiene el placeholder «Usuario o RU». Tras un login correcto vuelve a `returnUrl` (solo rutas internas) o, si no hay, a `/`.
- Perfil (P1.2): servicio `Perfil` (`features/autenticacion/data-access/perfil.ts`, `obtenerPerfil()` = `GET /auth/perfil`); qué se muestra según el usuario está en `docs/usuarios-falsos.md` («Perfil (P1.2)»).

## Guards, menú y permisos

- `sesionGuard` exige sesión: sin sesión redirige a `/iniciar-sesion` con `returnUrl` y, tras el login, vuelve a la ruta pedida.
- `permisoGuard` exige el permiso de la ruta según `docs/rutas.md` (si se indican dos con «o», basta uno); sin permiso redirige a `/`. Ruta inexistente → `/`.
- El menú lateral y los botones de acción usan la directiva `*appTienePermiso="'CODIGO'"`.
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
- [x] RF1 Autenticación · [ ] RF2 Usuarios · [ ] RF3 Estructura · [ ] RF4 Gestión del catálogo · [ ] RF5 Ejemplares
- [ ] RF6 Consulta del catálogo · [ ] RF7 Reservas propias · [ ] RF8 Administrar reservas · [ ] RF9 Préstamos
- [ ] RF10 Gestión de tesis · [ ] RF11 Consulta de tesis · [ ] RF12 Comunicación · [ ] RF13 Reportes y dashboards
