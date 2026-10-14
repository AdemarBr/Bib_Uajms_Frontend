# Contrato de la API (frontend ↔ backend)

**Este archivo es idéntico en los dos repositorios.** Ningún repositorio tiene acceso al otro: si cambia en uno, el estudiante lo copia al otro.

En la Iteración 4 el frontend no llama a ningún backend: sus servicios devuelven datos falsos **con exactamente estas formas**, para que en la Iteración 5 solo cambie el interior de los servicios.

Cada DTO se definió a partir de las columnas, tarjetas, campos y filtros que el documento del proyecto pide para cada pantalla (se indica el requerimiento). Los campos marcados *(calculado)* no son columnas de la base de datos: el backend los calcula al responder.

## 1. Convenciones

- Prefijo de todas las rutas: `/api/v1`. Recursos en plural y en español.
- JSON en camelCase; nombres de dominio en español (`fechaLimiteDevolucion`).
- Fechas en ISO 8601: fecha `"2026-10-13"`; fecha y hora `"2026-10-13T09:15:00"`.
- Identificadores numéricos (`idLibro`). Para mostrar una referencia, la respuesta trae el id y el nombre (`idRol` + `rolNombre`).
- Nunca se envía la contraseña cifrada al frontend.
- Los listados paginados (los que indican `Pagina<…>`) aceptan `pagina` (desde 0) y `tamanio` (20 por defecto). Los que indican `[]` devuelven la lista completa.
- Entre corchetes, el permiso que exige el backend (ver `docs/permisos.md`).

## 2. Respuestas comunes

```json
// Pagina<T>
{ "contenido": [], "pagina": 0, "tamanio": 20, "totalElementos": 0 }
```

```json
// ErrorRespuesta (todas las respuestas 4xx y 5xx)
{ "status": 400, "titulo": "Datos inválidos", "detalle": "Revise los campos marcados.",
  "errores": [ { "campo": "titulo", "mensaje": "Es obligatorio." } ] }
```

Mensajes de error: los textos que ve el usuario ante un error los define **el backend** en `titulo` y `detalle` de `ErrorRespuesta` (y en `errores[].mensaje` por campo). El frontend los muestra tal como llegan y no escribe esos textos en sus componentes. Únicas excepciones del frontend: las validaciones del formulario antes de enviar (campo obligatorio, formato) y la falta de respuesta del servidor («No se pudo conectar con el servidor. Intente nuevamente.»).

Filtro de periodo (reportes y dashboards, RF13.6.4): `periodo` = `ULTIMO_MES` | `ULTIMO_TRIMESTRE` | `SEMESTRE_ACTUAL` | `GESTION_ACTUAL` | `RANGO`; con `RANGO` se envían `desde` y `hasta` (fechas).

## 3. Autenticación y sesión (RF1)

- `POST /auth/login` — público. Devuelve `LoginResponse` y la cookie de renovación.
- `POST /auth/refresh` — público, con la cookie de renovación. Devuelve un `LoginResponse` nuevo y renueva la cookie. El frontend lo llama un minuto antes de que venza el token, si hubo actividad del usuario, y al cargar la aplicación.
- `POST /auth/cerrar-sesion` — público, con la cookie de renovación. Responde 204 y borra la cookie.
- `GET /auth/perfil` — sesión

Reglas de la sesión (detalle en `docs/reglas-negocio.md`, sección «Sesión»):

- `token` es el token de acceso (JWT, 15 minutos). El frontend lo guarda **solo en memoria** y lo envía en `Authorization: Bearer <token>`. Nunca en `localStorage` ni `sessionStorage`.
- Las llamadas a `/auth/login`, `/auth/refresh` y `/auth/cerrar-sesion` no llevan el encabezado `Authorization` (`/auth/perfil` sí, como cualquier ruta con sesión).
- La cookie de renovación la crea y la lee solo el backend: `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/api/v1/auth`, 15 minutos. El frontend no puede leerla; la envía el navegador en esas tres llamadas, que el frontend hace con `withCredentials: true`.
- `expiraEn`: segundos de vida del token de acceso, para que el frontend sepa cuándo renovarlo.
- Errores: credenciales incorrectas → 401 con el mismo mensaje genérico para usuario o contraseña (RF1.2.5); demasiados intentos o cuenta bloqueada temporalmente → 429 (sin revelar si el usuario existe); renovación rechazada (cookie vencida, de otra IP u otro navegador, sesión de más de 8 horas o usuario desactivado) → 401; si había una sesión, el frontend la borra y vuelve a `/iniciar-sesion` (al cargar la aplicación, un 401 solo significa que no hay sesión).

```json
// LoginRequest (los usuarios académicos usan su RU como nombreUsuario; una contraseña vacía o de más de 128 caracteres recibe el mismo 401 genérico, no un 400)
{ "nombreUsuario": "admin.general", "contrasena": "••••••" }
```

```json
// ErrorRespuesta de credenciales incorrectas (siempre igual, sin indicar qué dato falló)
{ "status": 401, "titulo": "No se pudo iniciar sesión",
  "detalle": "El usuario o la contraseña no son válidos, o la cuenta no se encuentra vigente.", "errores": [] }
```

```json
// LoginResponse (también es la respuesta de /auth/refresh)
{ "token": "eyJ...",
  "expiraEn": 900,
  "usuario": { "idUsuario": 1, "nombre": "Ademar Mendez", "nombreUsuario": "admin.general",
               "idBiblioteca": null, "bibliotecaNombre": null, "idCarrera": null, "carreraNombre": null },
  "rol": "Administrador general del sistema",
  "tipoUsuario": "interno",
  "permisos": ["USUARIO_REGISTRAR", "USUARIO_CONSULTAR"] }
```

```json
// PerfilResponse (P1.2, RF1.4)
{ "idUsuario": 1, "nombre": "Ademar Mendez", "nombreUsuario": "admin.general", "correo": "admin.general@uajms.edu.bo",
  "ru": null, "rolNombre": "Administrador general del sistema", "tipoUsuario": "interno",
  "bibliotecaNombre": null, "facultadNombre": null, "carreraNombre": null }
```

## 4. Usuarios y roles (RF2)

- `GET /usuarios?q&idRol&estado&tipoUsuario&idBiblioteca` → `Pagina<UsuarioResponse>` [USUARIO_CONSULTAR]
- `GET /usuarios/{id}` → `UsuarioResponse` [USUARIO_CONSULTAR]
- `POST /usuarios` `UsuarioInternoRequest` → `RegistroUsuarioResponse` [USUARIO_REGISTRAR]
- `PUT /usuarios/{id}` `UsuarioInternoRequest` → `UsuarioResponse` [USUARIO_ACTUALIZAR]. Es la única llamada del botón «Guardar cambios» de P2.3: si cambia `idRol` exige además USUARIO_ASIGNAR_ROL, y si cambia `idBiblioteca` exige USUARIO_ASIGNAR_BIBLIOTECA.
- `PATCH /usuarios/{id}/estado` `{ "estado": false }` [USUARIO_CAMBIAR_ESTADO] (interruptor de P2.2)
- `POST /usuarios/{id}/restablecer-contrasena` → `{ "contrasenaGenerada": "..." }` [USUARIO_RESTABLECER_PASSWORD]
- `GET /roles` → `RolResponse[]` [PERMISO_CONSULTAR]
- `POST /usuarios/validar-ru` `{ "ru": "2019001234" }` → `UsuarioVerificadoResponse` [PRESTAMO_SALA_REGISTRAR o PRESTAMO_DOMICILIO_REGISTRAR] (RF1.2.6 a RF1.2.9). Si el RU no está vigente responde 404 con `ErrorRespuesta`.

```json
// UsuarioResponse (tabla de P2.2: nombre, tipo de usuario, rol, estado y biblioteca, RF2.2.4)
{ "idUsuario": 5, "nombre": "Carla Ríos", "nombreUsuario": "bibliotecario.central", "correo": null, "ru": null,
  "estado": true, "idRol": 4, "rolNombre": "Bibliotecario", "tipoUsuario": "interno",
  "idBiblioteca": 1, "bibliotecaNombre": "Biblioteca Central", "idCarrera": null, "carreraNombre": null }
```

```json
// UsuarioInternoRequest (P2.1 y P2.3; nombre de usuario y contraseña los genera el sistema, RF2.1)
{ "nombre": "Carla Ríos", "correo": null, "idRol": 4, "idBiblioteca": 1 }
```

```json
// RegistroUsuarioResponse (la contraseña se muestra una sola vez)
{ "usuario": { "idUsuario": 15, "nombreUsuario": "crios" }, "contrasenaGenerada": "Xk7#p2Qa9m" }
```

```json
// RolResponse (P2.5)
{ "idRol": 4, "nombre": "Bibliotecario", "tipoUsuario": "interno",
  "permisos": [ { "codigo": "PRESTAMO_SALA_REGISTRAR", "nombre": "Registrar préstamo en sala" } ] }
```

```json
// UsuarioVerificadoResponse (RF1.2.7; si no existía, el backend lo registra con sus datos mínimos)
{ "idUsuario": 12, "nombre": "Estudiante Pérez", "ru": "2019001234", "carreraNombre": "Ingeniería de Sistemas",
  "rolNombre": "Estudiante", "registradoAhora": false }
```

## 5. Bibliotecas, facultades y carreras (RF3)

- `GET /facultades` → `FacultadResponse[]` — público (selectores)
- `GET /carreras?idFacultad` → `CarreraResponse[]` — público (selectores)
- `GET /bibliotecas` → `BibliotecaResponse[]` — público (selectores y tarjetas de la página de inicio, RF6.3)
- `POST /facultades` [FACULTAD_REGISTRAR] · `PUT /facultades/{id}` [FACULTAD_ACTUALIZAR]
- `POST /carreras` [CARRERA_REGISTRAR] · `PUT /carreras/{id}` [CARRERA_ACTUALIZAR]
- `POST /bibliotecas` [BIBLIOTECA_REGISTRAR] · `PUT /bibliotecas/{id}` [BIBLIOTECA_ACTUALIZAR]

```json
// FacultadResponse (pestaña Facultades: Nombre, Carreras, Biblioteca, Estado, RF3.1.7)
{ "idFacultad": 1, "nombre": "Facultad de Ciencias y Tecnología", "estado": true,
  "carreras": ["Ingeniería de Sistemas"], "bibliotecas": ["Biblioteca FCyT"] }
```

```json
// FacultadRequest (estado solo al actualizar)
{ "nombre": "Facultad de Ciencias y Tecnología", "estado": true }
```

```json
// CarreraResponse (pestaña Carreras: Nombre, Facultad, Estado)
{ "idCarrera": 1, "nombre": "Ingeniería de Sistemas", "estado": true, "idFacultad": 1, "facultadNombre": "Facultad de Ciencias y Tecnología" }
```

```json
// CarreraRequest (estado solo al actualizar)
{ "nombre": "Ingeniería de Sistemas", "idFacultad": 1, "estado": true }
```

```json
// BibliotecaResponse (pestaña Bibliotecas: Nombre, Ubicación, Facultad / Carrera, Estado). Ubicación y descripción de este ejemplo: datos de ejemplo de Figma, no definitivos.
{ "idBiblioteca": 1, "nombre": "Biblioteca Central", "ubicacion": "Edificio Rectorado, 2do piso",
  "descripcion": "Biblioteca principal de la universidad", "estado": true,
  "idFacultad": null, "facultadNombre": null, "idCarrera": null, "carreraNombre": null,
  "esBibliotecaCentral": true }
```

`esBibliotecaCentral` *(calculado)*: con `true`, P3.5 deshabilita Facultad y Carrera y deja el estado en activo (RF3.7.5). **Pendiente:** el criterio para identificarla (no puede ser el nombre, que es editable, ni «sin facultad ni carrera», que incluye a la de postgrado) se define junto con los datos de la Biblioteca Central. En el prototipo, la Central es la biblioteca falsa con id 1.

```json
// BibliotecaRequest. «Toda la facultad»: idFacultad con valor e idCarrera nulo. Estado solo al actualizar.
{ "nombre": "Biblioteca FCyT", "ubicacion": "Edificio FCyT, planta baja", "descripcion": null,
  "idFacultad": 1, "idCarrera": null, "estado": true }
```

## 6. Catálogo de libros: gestión (RF4)

- `GET /libros?q&idBiblioteca&idFacultad&materia&autor&estado&clasificacionDewey` → `Pagina<LibroResponse>` [LIBRO_CONSULTAR]
- `GET /libros/{id}` → `LibroResponse` [LIBRO_CONSULTAR]
- `POST /libros` (multipart: parte `datos` = `LibroRequest`, parte opcional `portada` = imagen) [LIBRO_REGISTRAR]
- `PUT /libros/{id}` (mismo multipart) [LIBRO_ACTUALIZAR]
- `PATCH /libros/{id}/estado` `{ "estado": false }` [LIBRO_DESACTIVAR]
- `POST /libros/importar` (multipart: `archivo`) → `ImportacionResponse` [LIBRO_IMPORTAR]
- `GET /libros/{id}/historial` → `HistorialCambioLibroResponse[]` [LIBRO_HISTORIAL_CONSULTAR]

`portadaUrl` *(calculado)*: apunta a `GET /catalogo/libros/{id}/portada` (sección 7), que es público; es `null` si el libro no tiene portada.

```json
// LibroResponse (tabla de P4.3: título, autor, materia, clasificación Dewey y estado, RF4.3.4)
{ "idLibro": 1, "titulo": "Introducción a la Programación", "autor": "Ana Torres", "editorial": "Editorial Universitaria",
  "materia": "Informática", "clasificacionDewey": "005.1", "isbn": "978-99954-1-234-5",
  "portadaUrl": "/api/v1/catalogo/libros/1/portada", "fechaIncorporacion": "2026-07-20", "estado": true }
```

```json
// LibroRequest
{ "titulo": "Introducción a la Programación", "autor": "Ana Torres", "editorial": "Editorial Universitaria",
  "materia": "Informática", "clasificacionDewey": "005.1", "isbn": null }
```

```json
// ImportacionResponse (RF4.2.5)
{ "incorporados": 48, "errores": [ { "fila": 7, "mensaje": "Falta el título." } ] }
```

```json
// HistorialCambioLibroResponse (P4.5, RF4.6.4)
{ "idHistorial": 1, "fecha": "2026-07-22", "campoModificado": "editorial", "valorAnterior": "Editorial X", "valorNuevo": "Editorial Universitaria" }
```

## 7. Catálogo público (RF6)

- `GET /catalogo/libros?q&idBiblioteca&idFacultad&materia&autor&disponibilidad&clasificacionDewey` → `Pagina<LibroCatalogoResponse>`
- `GET /catalogo/libros/{id}` → `LibroDetalleResponse` (registra la visualización en `registro_uso`)
- `GET /catalogo/libros/{id}/ejemplar-reservable` → `EjemplarReservableResponse` [RESERVA_REALIZAR] (P7.1). Si no hay ejemplar disponible responde 409 con `ErrorRespuesta`.
- `GET /catalogo/novedades` → `NovedadResponse[]`
- `GET /catalogo/libros/{id}/portada` → imagen de la portada (público; si no tiene, la interfaz muestra el detalle sin imagen, RF6.1.2.3.3)

```json
// LibroCatalogoResponse (resultados de P6.1: portada, título, autor y disponibilidad, RF6.1.4)
{ "idLibro": 1, "titulo": "Introducción a la Programación", "autor": "Ana Torres", "portadaUrl": "/api/v1/catalogo/libros/1/portada",
  "ejemplaresDisponibles": 2, "ejemplaresTotales": 3 }
```

```json
// LibroDetalleResponse (P6.2: datos bibliográficos, disponibilidad y ubicación física, RF6.1.2.3)
{ "idLibro": 1, "titulo": "Introducción a la Programación", "autor": "Ana Torres", "editorial": "Editorial Universitaria",
  "materia": "Informática", "clasificacionDewey": "005.1", "isbn": "978-99954-1-234-5", "portadaUrl": "/api/v1/catalogo/libros/1/portada",
  "ejemplaresDisponibles": 2, "ejemplaresTotales": 3,
  "ubicaciones": [ { "idBiblioteca": 1, "bibliotecaNombre": "Biblioteca Central", "disponibles": 2, "total": 3 } ] }
```

```json
// EjemplarReservableResponse (P7.1)
{ "idLibro": 1, "libroTitulo": "Introducción a la Programación", "ejemplaresDisponibles": 1,
  "idEjemplar": 7, "codigoEjemplar": "EJ-00123", "bibliotecaNombre": "Biblioteca Central" }
```

```json
// NovedadResponse (RF6.2.5)
{ "idLibro": 1, "titulo": "Introducción a la Programación", "portadaUrl": "/api/v1/catalogo/libros/1/portada", "fechaIncorporacion": "2026-07-20" }
```

## 8. Ejemplares (RF5)

- `GET /ejemplares?q&idBiblioteca&idFacultad&estado&disponible&ubicacion` → `Pagina<EjemplarResponse>` [EJEMPLAR_CONSULTAR]
- `POST /ejemplares` `EjemplarRequest` [EJEMPLAR_REGISTRAR]
- `PUT /ejemplares/{id}` `EjemplarActualizarRequest` [EJEMPLAR_ACTUALIZAR]. Es la única llamada del botón «Guardar cambios» de P5.3 (RF5.4 y RF5.5): si cambia `estado` exige además EJEMPLAR_CAMBIAR_ESTADO.

```json
// EjemplarResponse (tabla de P5.2: código, libro, biblioteca, ubicación, estado y disponibilidad, RF5.3.4)
{ "idEjemplar": 7, "codigoEjemplar": "EJ-00123", "ubicacionFisica": "Estante 4B, Dewey 005.1", "estado": "disponible",
  "disponible": true, "soloSala": true, "idLibro": 1, "libroTitulo": "Introducción a la Programación",
  "idBiblioteca": 1, "bibliotecaNombre": "Biblioteca Central" }
```

`disponible` *(calculado)*: `estado == "disponible"`.

```json
// EjemplarRequest (P5.1)
{ "codigoEjemplar": "EJ-00123", "ubicacionFisica": "Estante 4B, Dewey 005.1", "idLibro": 1, "idBiblioteca": 1 }
```

```json
// EjemplarActualizarRequest (P5.3: código, biblioteca, ubicación y estado; el libro no se cambia, RF5.4.3)
{ "codigoEjemplar": "EJ-00123", "idBiblioteca": 1, "ubicacionFisica": "Estante 4B, Dewey 005.1", "estado": "disponible" }
```

**Pendiente:** ni el documento ni Figma tienen un control para `soloSala` (si el ejemplar puede salir a domicilio). Hasta que se decida, no se agrega al Request.

## 9. Reservas (RF7 y RF8)

- `POST /reservas` `{ "idEjemplar": 7 }` → `ReservaResponse` [RESERVA_REALIZAR]
- `GET /reservas/mias` → `ReservaResponse[]` [RESERVA_PROPIA_CONSULTAR]
- `PATCH /reservas/{id}/cancelar` [RESERVA_PROPIA_CANCELAR]
- `GET /reservas?idBiblioteca&estado&desde&hasta&q` → `Pagina<ReservaResponse>` [RESERVA_CONSULTAR] (filtros de RF8.1.5)
- `GET /reservas/{id}` → `ReservaResponse` [RESERVA_CONSULTAR] (para precargar el préstamo desde una reserva, RF8.8)
- `PATCH /reservas/{id}/confirmar` [RESERVA_CONFIRMAR]
- `PATCH /reservas/{id}/rechazar` `{ "motivo": "..." }` [RESERVA_RECHAZAR]
- `PATCH /reservas/{id}/cancelar-administrativa` `{ "motivo": "..." }` [RESERVA_CANCELAR]
- `GET /reservas/historial?idBiblioteca&estado&desde&hasta&q` → `Pagina<HistorialReservaResponse>` [RESERVA_HISTORIAL_CONSULTAR]

El desplegable de estado de cada fila de P8.1 (RF8.6) solo ofrece los cambios permitidos desde el estado actual: Confirmada llama a `/confirmar`; Rechazada, a `/rechazar`, y Cancelada, a `/cancelar-administrativa`. Estas dos últimas piden el motivo. No existe un endpoint genérico de cambio de estado.

```json
// ReservaResponse (P7.2 y P8.1: usuario, libro, fecha, biblioteca, estado, RF8.1.4)
{ "idReserva": 3, "fecha": "2026-07-26", "estado": "Pendiente", "atendida": false, "motivo": null,
  "idUsuario": 12, "usuarioNombre": "Estudiante Pérez", "idEjemplar": 7, "ejemplarCodigo": "EJ-00123",
  "idLibro": 1, "libroTitulo": "Introducción a la Programación", "idBiblioteca": 1, "bibliotecaNombre": "Biblioteca Central" }
```

```json
// HistorialReservaResponse (P8.2: usuario, libro, fecha, estado y biblioteca, RF8.7.4)
{ "idHistorialReserva": 9, "fecha": "2026-07-27", "estadoAnterior": "Pendiente", "estadoNuevo": "Confirmada",
  "idReserva": 3, "usuarioNombre": "Estudiante Pérez", "libroTitulo": "Introducción a la Programación", "bibliotecaNombre": "Biblioteca Central" }
```

## 10. Préstamos y devoluciones (RF9)

- `POST /prestamos/sala` `PrestamoSalaRequest` → `PrestamoResponse` [PRESTAMO_SALA_REGISTRAR]
- `POST /prestamos/domicilio` `PrestamoDomicilioRequest` → `PrestamoResponse` [PRESTAMO_DOMICILIO_REGISTRAR]
- `GET /prestamos?tipoPrestamo&estado&idBiblioteca&q` → `Pagina<PrestamoResponse>` [PRESTAMO_CONSULTAR] (`q` busca por código de ejemplar, usuario o número de préstamo, RF9.3.6)
- `POST /prestamos/{id}/ampliaciones` `{ "fechaNueva": "2026-08-20" }` → `AmpliacionResponse` [PRESTAMO_AMPLIAR]
- `POST /devoluciones` `DevolucionRequest` → `DevolucionResponse` [DEVOLUCION_REGISTRAR]
- `GET /devoluciones?q&desde&hasta` → `Pagina<DevolucionResponse>` [DEVOLUCION_HISTORIAL_CONSULTAR]

Antes de registrar el préstamo, el frontend llama a `POST /usuarios/validar-ru` (sección 4) para mostrar los datos verificados.

Préstamo desde una reserva confirmada (RF8.8): el botón «Prestar» de P8.1 abre `/prestamos/sala/registrar?idReserva=N` o `/prestamos/domicilio/registrar?idReserva=N`; la pantalla carga la reserva con `GET /reservas/{id}` y precarga el usuario y el ejemplar.

```json
// PrestamoSalaRequest (idReserva solo si viene de una reserva confirmada, RF8.8)
{ "ru": "2019001234", "idEjemplar": 7, "idReserva": null }
```

```json
// PrestamoDomicilioRequest (fecha límite: hoy + plazo; al registrar no puede superar 30 días)
{ "ru": "2019001234", "idEjemplar": 7, "fechaLimiteDevolucion": "2026-08-10", "celularContacto": "70000000", "idReserva": null }
```

```json
// PrestamoResponse (P9.2: usuario, ejemplar, fecha de inicio, estado; P9.4: además fecha límite, RF9.1.5.4 y RF9.2.7.4)
{ "idPrestamo": 15, "fechaPrestamo": "2026-07-26T09:15:00", "estado": "activo", "tipoPrestamo": "domicilio",
  "fechaLimiteDevolucion": "2026-08-10", "celularContacto": "70000000",
  "idUsuario": 12, "usuarioNombre": "Estudiante Pérez", "usuarioRu": "2019001234",
  "idEjemplar": 7, "ejemplarCodigo": "EJ-00123", "libroTitulo": "Introducción a la Programación",
  "idReserva": null, "vencido": false, "cantidadAmpliaciones": 0 }
```

`vencido` y `cantidadAmpliaciones` *(calculados)*: P9.4 señala los vencidos y la ventana de ampliación muestra cuántas hubo (RF9.2.8).

```json
// AmpliacionResponse
{ "idAmpliacion": 2, "fechaAnterior": "2026-08-10", "fechaNueva": "2026-08-20", "idPrestamo": 15 }
```

```json
// DevolucionRequest (observaciones obligatorias si el estado no es «Buen estado»)
{ "idPrestamo": 15, "estadoEjemplar": "Buen estado", "observaciones": null }
```

```json
// DevolucionResponse (P9.6: usuario, ejemplar, fecha de préstamo, fecha de devolución, estado del ejemplar y observaciones, RF9.3.5.4)
{ "idDevolucion": 4, "fechaDevolucion": "2026-08-09", "estadoEjemplar": "Buen estado", "observaciones": null,
  "idPrestamo": 15, "usuarioNombre": "Estudiante Pérez", "ejemplarCodigo": "EJ-00123",
  "fechaPrestamo": "2026-07-26T09:15:00", "conRetraso": false }
```

`conRetraso` *(calculado)*: la devolución fue posterior a la fecha límite (RF9.3.3).

## 11. Tesis: gestión (RF10)

- `GET /tesis?q&idCarrera&gestion` → `Pagina<TesisResponse>` [TESIS_CONSULTAR]
- `POST /tesis` `TesisRequest` [TESIS_REGISTRAR] · `PUT /tesis/{id}` `TesisRequest` [TESIS_ACTUALIZAR]
- `PATCH /tesis/{id}/estado` `{ "estado": false }` [TESIS_DESACTIVAR]
- `GET /tesis/{id}/documentos` → `DocumentoTesisResponse[]` [TESIS_CONSULTAR]
- `POST /tesis/{id}/documentos` (multipart: `tipoSeccion` + `archivo`) → `DocumentoTesisResponse` [TESIS_DOCUMENTO_CARGAR]
- `PUT /tesis/{id}/documentos/{idDocumento}` (multipart: `archivo`) → `DocumentoTesisResponse` [TESIS_DOCUMENTO_ACTUALIZAR]

```json
// TesisResponse (tabla de P10.3: título, autor, carrera, facultad, gestión y estado, RF10.3.4)
{ "idTesis": 1, "titulo": "Modelo predictivo de deserción estudiantil", "autor": "Estudiante Rojas", "tutor": "Docente Gómez",
  "gestion": 2026, "numeroInventario": "EJ-TES-0142", "palabrasClave": "deserción, modelo predictivo, minería de datos",
  "estado": true, "idCarrera": 1, "carreraNombre": "Ingeniería de Sistemas", "idFacultad": 1, "facultadNombre": "Facultad de Ciencias y Tecnología" }
```

La facultad no se guarda en la tesis: se obtiene de su carrera. El desplegable «Facultad» de P10.1 y P10.4 solo filtra las carreras.

```json
// TesisRequest (estado solo al actualizar)
{ "titulo": "Modelo predictivo de deserción estudiantil", "autor": "Estudiante Rojas", "tutor": "Docente Gómez",
  "gestion": 2026, "numeroInventario": "EJ-TES-0142", "palabrasClave": "deserción, modelo predictivo", "idCarrera": 1, "estado": true }
```

```json
// DocumentoTesisResponse (tipoSeccion: Preliminares, Resumen, Marco Teórico, Bibliografía o Anexos, RF10.2.3)
{ "idDocumento": 3, "tipoSeccion": "Resumen", "nombreArchivo": "resumen.pdf", "idTesis": 1 }
```

La ruta interna del archivo no se envía al frontend; el archivo se abre por su endpoint (sección 12).

## 12. Tesis: consulta pública (RF11)

- `GET /catalogo/tesis?q&idCarrera&gestion` → `Pagina<TesisResponse>` (lista de P11.1: título, autor, carrera y año, RF11.1.4)
- `GET /catalogo/tesis/{id}` → `TesisDetalleResponse` (registra la visualización)
- `GET /catalogo/tesis/documentos/{idDocumento}/archivo` → PDF (registra la apertura)

```json
// TesisDetalleResponse (P11.2, RF11.1.2.2)
{ "tesis": { "idTesis": 1, "titulo": "Modelo predictivo de deserción estudiantil", "...": "mismos campos de TesisResponse" },
  "documentos": [ { "idDocumento": 3, "tipoSeccion": "Resumen", "nombreArchivo": "resumen.pdf", "idTesis": 1 } ] }
```

## 13. Comunicación (RF12)

- `GET /mensajes` → `HiloResponse[]` (hilos del usuario, ordenados por fecha) [MENSAJE_CONSULTAR]
- `GET /mensajes/{id}` → `ConversacionResponse` [MENSAJE_CONSULTAR]
- `POST /mensajes` `{ "contenido": "..." }` → `ConversacionResponse` [MENSAJE_ENVIAR_CONSULTA]
- `POST /mensajes/{id}/respuestas` `{ "contenido": "..." }` → `ConversacionResponse` [MENSAJE_RESPONDER]

```json
// HiloResponse (P12.1: remitente o destinatario, resumen, fecha y estado, RF12.2.4 y RF12.3.4)
// Las consultas no tienen un destinatario concreto: van a la bandeja de los bibliotecarios. Si destinatarioNombre es null, la
// interfaz muestra «Bibliotecario». Para el Bibliotecario, GET /mensajes devuelve todas las consultas; para el usuario académico, solo las suyas.
{ "idMensaje": 20, "resumen": "Buen día, quisiera saber si es posible extender…", "remitenteNombre": "Estudiante Rojas",
  "destinatarioNombre": null, "fecha": "2026-07-26T09:10:00", "estado": "Respondido" }
```

`resumen` *(calculado)*: inicio del texto de la consulta; no existe columna «asunto».

```json
// ConversacionResponse (P12.2)
{ "consulta": { "idMensaje": 20, "contenido": "Buen día, quisiera saber si es posible extender el plazo…",
                "fecha": "2026-07-26T09:10:00", "estado": "Respondido", "idRemitente": 13, "remitenteNombre": "Estudiante Rojas",
                "idDestinatario": null, "destinatarioNombre": null, "idMensajeRespondido": null },
  "respuestas": [ { "idMensaje": 21, "contenido": "Buen día, sí es posible…", "fecha": "2026-07-26T10:02:00", "estado": "Respondido",
                    "idRemitente": 1, "remitenteNombre": "Ademar Mendez", "idDestinatario": 13, "destinatarioNombre": "Estudiante Rojas",
                    "idMensajeRespondido": 20 } ] }
```

## 14. Reportes y dashboards (RF13)

Todos aceptan el filtro de periodo de la sección 2 y responden datos ya calculados.

**Dashboards** [DASHBOARD_VER]

- `GET /reportes/dashboard/general?periodo…` → `DashboardGeneralResponse` (P13.1, RF13.1.5)
- `GET /reportes/dashboard/catalogo?periodo…` → `DashboardCatalogoResponse` (P13.2, RF13.2.4)
- `GET /reportes/dashboard/prestamos?periodo…` → `DashboardPrestamosResponse` (P13.3, RF13.3.4)
- `GET /reportes/dashboard/reservas?periodo…` → `DashboardReservasResponse` (P13.4, RF13.4.4)
- `GET /reportes/dashboard/tesis?periodo…&idFacultad` → `DashboardTesisResponse` (P13.5, RF13.5.4)

```json
// DashboardGeneralResponse
{ "ejemplaresTotales": 12480, "prestamosActivos": 342, "reservasPendientes": 58, "tesisRegistradas": 1096,
  "prestamosPorMes": [ { "etiqueta": "2026-05", "cantidad": 120 } ] }
```

```json
// DashboardCatalogoResponse
{ "librosEnCatalogo": 8240, "consultasDelMes": 1530, "itemsMasConsultados": 62,
  "coberturaPorFacultad": { "facultadesConLibros": 9, "totalFacultades": 9 },
  "consultasPorSemana": [ { "etiqueta": "Semana 1", "cantidad": 380 } ] }
```

```json
// DashboardPrestamosResponse
{ "prestamosDelMes": 612, "prestamosVigentes": 342, "devolucionesATiempoPorcentaje": 91, "prestamosConRetraso": 18,
  "prestamosPorTipoUsuario": [ { "etiqueta": "Estudiante", "cantidad": 480 } ] }
// Las etiquetas de «Préstamos por tipo de usuario» son los roles académicos (Estudiante, Docente, Usuario académico),
// no el campo tipoUsuario (académico o interno).
```

```json
// DashboardReservasResponse
{ "reservasDelMes": 204, "reservasPendientes": 58, "reservasAtendidas": 146, "tasaCumplimientoPorcentaje": 88,
  "reservasPorBiblioteca": [ { "etiqueta": "Biblioteca Central", "cantidad": 120 } ] }
```

```json
// DashboardTesisResponse
{ "tesisRegistradas": 1096, "tesisDigitalizadas": 980, "consultasDelMes": 410, "documentosAbiertosDelMes": 265,
  "tesisMasConsultadasPorCarrera": [ { "etiqueta": "Ingeniería de Sistemas", "cantidad": 85 } ] }
```

**Reportes** [REPORTE_GENERAR]; exportar [REPORTE_EXPORTAR]

- `GET /reportes/libros-mas-consultados?periodo…&idCarrera` → `Pagina<FilaLibroConsultado>` (P13.6, RF13.7.5)
- `GET /reportes/prestamos?periodo…&idBiblioteca` → `Pagina<FilaPrestamo>` (P13.7, RF13.8.5)
- `GET /reportes/reservas?periodo…&estado` → `FilaReservaPorEstado[]` (P13.8, RF13.9.5)
- `GET /reportes/tesis-mas-consultadas?periodo…&idCarrera` → `Pagina<FilaTesisConsultada>` (P13.9, RF13.10.5)
- `GET /reportes/por-facultad?periodo…&idFacultad` → `FilaPorFacultad[]` (P13.10, RF13.11.5; sin `idFacultad` = «Todas»)
- `GET /reportes/por-carrera?periodo…&idFacultad&idCarrera` → `FilaPorCarrera[]` (P13.11, RF13.12.5)
- `GET /reportes/{tipo}/exportar?formato=pdf|excel&…mismos filtros` → archivo (RF13.13)

```json
// FilaLibroConsultado: Título, Autor, Consultas, Carrera principal (RF13.7.5)
// PENDIENTE: el modelo no relaciona las consultas (registro_uso) ni los libros con una carrera, así que «Carrera principal»
// y el filtro «Carrera» de este reporte no se pueden calcular todavía. Requiere una decisión antes de la Iteración 5.
{ "titulo": "Introducción a la Programación", "autor": "Ana Torres", "consultas": 85, "carreraPrincipal": "Ingeniería de Sistemas" }
```

```json
// FilaPrestamo: Usuario, Ejemplar, Tipo, Fecha de préstamo, Estado
{ "usuario": "Estudiante Pérez", "ejemplar": "EJ-00123", "tipo": "sala", "fechaPrestamo": "2026-07-26T09:15:00", "estado": "activo" }
```

```json
// FilaReservaPorEstado: Estado, Cantidad
{ "estado": "Confirmada", "cantidad": 40 }
```

```json
// FilaTesisConsultada: Título, Autor, Consultas, Documentos abiertos
{ "titulo": "Modelo predictivo de deserción estudiantil", "autor": "Estudiante Rojas", "consultas": 32, "documentosAbiertos": 18 }
```

```json
// FilaPorFacultad: Facultad, Préstamos, Reservas, Tesis registradas
{ "facultad": "Facultad de Ciencias y Tecnología", "prestamos": 210, "reservas": 64, "tesisRegistradas": 320 }
```

```json
// FilaPorCarrera: Carrera, Préstamos, Reservas, Tesis registradas
{ "carrera": "Ingeniería de Sistemas", "prestamos": 120, "reservas": 30, "tesisRegistradas": 150 }
```
