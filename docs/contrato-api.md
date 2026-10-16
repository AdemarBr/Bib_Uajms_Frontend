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

// Registro duplicado (409): el detalle dice qué dato ya existe
{ "status": 409, "titulo": "Registro duplicado", "detalle": "Ya existe una facultad con ese nombre.",
  "errores": [] }
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
- Biblioteca responsable en `POST /usuarios` y `PUT /usuarios/{id}`: solo se acepta una biblioteca activa, salvo en el `PUT` cuando el usuario conserva su biblioteca actual aunque esté inactiva. Si no, responde 400 con el error en el campo `idBiblioteca`:

  ```json
  { "status": 400, "titulo": "Datos inválidos", "detalle": "Revise los campos marcados.",
    "errores": [ { "campo": "idBiblioteca", "mensaje": "La biblioteca seleccionada no está activa." } ] }
  ```

- `bibliotecaNombre` de `UsuarioResponse` se lee de la tabla biblioteca en cada respuesta (no se guarda en el usuario), así refleja el nombre actual.
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

Públicos (selectores y página de inicio): devuelven **solo los registros activos**.

- `GET /facultades` → `FacultadResponse[]` — público (selectores). Solo facultades activas; sus `carreras` y `bibliotecas` traen solo los nombres activos.
- `GET /carreras?idFacultad` → `CarreraResponse[]` — público (selectores). Solo carreras activas.
- `GET /bibliotecas` → `BibliotecaResponse[]` — público (selectores y tarjetas de la página de inicio, RF6.3). Solo bibliotecas activas.

De gestión (P3.1, P3.3 y P3.5): devuelven **todos**, también los inactivos, con la misma forma de respuesta. Basta uno de los permisos indicados. Los inactivos no se exponen con un parámetro opcional del endpoint público, porque así seguirían siendo visibles sin permiso.

- `GET /estructura/facultades` → `FacultadResponse[]` [ESTRUCTURA_CONSULTAR, FACULTAD_ACTUALIZAR, CARRERA_ACTUALIZAR o BIBLIOTECA_ACTUALIZAR]. Sus `carreras` y `bibliotecas` traen todos los nombres.
- `GET /estructura/carreras?idFacultad` → `CarreraResponse[]` [ESTRUCTURA_CONSULTAR, CARRERA_ACTUALIZAR o BIBLIOTECA_ACTUALIZAR]
- `GET /estructura/bibliotecas` → `BibliotecaResponse[]` [ESTRUCTURA_CONSULTAR o BIBLIOTECA_ACTUALIZAR]

Escritura:

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
{ "nombre": "Biblioteca FCyT", "ubicacion": "Edificio FCyT, planta baja", "descripcion": "Colección de ciencias y tecnología",
  "idFacultad": 1, "idCarrera": null, "estado": true }
```

## 6. Catálogo de libros: gestión (RF4)

- `GET /libros?q&idBiblioteca&idFacultad&materia&autor&estado&clasificacionDewey` → `Pagina<LibroResponse>` [LIBRO_CONSULTAR]
- `GET /libros/opciones-filtro` → `OpcionesFiltroLibroResponse` [LIBRO_CONSULTAR] (valores de los desplegables de materia, autor y clasificación de P4.3, RF4.3.1.1.3; los de biblioteca y facultad salen de `GET /bibliotecas` y `GET /facultades`)
- `GET /libros/{id}` → `LibroResponse` [LIBRO_CONSULTAR]
- `POST /libros` (multipart: parte `datos` = `LibroRequest`, parte opcional `portada` = imagen) [LIBRO_REGISTRAR]
- `PUT /libros/{id}` (mismo multipart) [LIBRO_ACTUALIZAR]
- `PATCH /libros/{id}/estado` `{ "estado": false }` para desactivar (RF4.5) o `{ "estado": true }` para activar (RF4.7) [LIBRO_CAMBIAR_ESTADO]
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
// OpcionesFiltroLibroResponse: valores distintos de la tabla libro, ordenados alfabéticamente
{ "materias": ["Derecho", "Informática", "Matemáticas"], "autores": ["Ana Torres", "María Paz", "Roberto Vidal"],
  "clasificacionesDewey": ["005.1", "346", "515"] }
```

```json
// LibroRequest
{ "titulo": "Introducción a la Programación", "autor": "Ana Torres", "editorial": "Editorial Universitaria",
  "materia": "Informática", "clasificacionDewey": "005.1", "isbn": null }
```

Validación de `LibroRequest` (`POST` y `PUT`; 400 con `errores[]` por campo): `titulo`, `autor`, `editorial`, `materia` y `clasificacionDewey` obligatorios; `isbn` opcional. Largos máximos de `docs/modelo-datos.md` (título 250, autor 200, editorial 120, materia 100, clasificación Dewey 30, ISBN 20). `clasificacionDewey`: tres dígitos, con decimales opcionales después de un punto (`005.1`, `346`, `515`). El ISBN es único: si ya lo tiene otro libro, 409 con el detalle «Ya existe un libro con ese ISBN.». La portada debe ser una imagen. Al actualizar, cada campo que cambia (también la portada, sin valores) se anota en `historial_cambio_libro`.

Archivo de `POST /libros/importar` (RF4.2):

- Formato admitido: CSV (`.csv`) en UTF-8, separado por comas; un valor con comas va entre comillas dobles (`"Pérez, Juan"`) y una comilla dentro de él se escribe doble (`""`).
- Primera fila: la cabecera exacta `titulo,autor,editorial,materia,clasificacionDewey,isbn`. Cada fila siguiente es un libro; las filas vacías se ignoran.
- Si el archivo no es CSV, no tiene esa cabecera o no tiene filas de libros, responde 400 con `ErrorRespuesta` y no importa nada.
- Cada fila se valida con las reglas de `LibroRequest`. Las válidas se registran (con la fecha de hoy como `fechaIncorporacion`) y las inválidas se informan en `errores[]`, una entrada por fila con su primer error. `fila` es el número de fila del archivo (la cabecera es la fila 1).
- Mensajes por fila, en minúscula para que la interfaz los muestre como «Fila 12: falta autor.»: «falta título.», «falta autor.», «falta editorial.», «falta materia.», «falta Dewey.», «título demasiado largo.» (igual con autor, editorial, materia, Dewey e ISBN), «Dewey inválido.» e «ISBN duplicado.» (ya registrado en el catálogo o repetido en una fila anterior del archivo).

```json
// ImportacionResponse (RF4.2.5)
{ "incorporados": 42, "errores": [ { "fila": 12, "mensaje": "falta autor." }, { "fila": 27, "mensaje": "Dewey inválido." } ] }
```

```json
// HistorialCambioLibroResponse (P4.5, RF4.6.4)
{ "idHistorial": 1, "fecha": "2026-07-22", "campoModificado": "editorial", "valorAnterior": "Editorial X", "valorNuevo": "Editorial Universitaria" }
```

## 7. Catálogo público (RF6)

Todo el catálogo público muestra solo libros activos (RF4.5 y RF4.7); un libro inactivo pedido por su id responde 404.

- `GET /catalogo/libros?q&idBiblioteca&idFacultad&materia&autor&disponibilidad&clasificacionDewey` → `Pagina<LibroCatalogoResponse>`. `q`: título, autor, materia, clasificación Dewey o ISBN (RF6.1.3; el ISBN se agrega para «Buscar libro» de P9.1 y P9.3, RF9.1.10). `disponibilidad`: `disponible` (al menos un ejemplar disponible) o `no_disponible` (ninguno, también sin ejemplares). `idBiblioteca` e `idFacultad`: libros con algún ejemplar en esa biblioteca o en una biblioteca de la facultad o de sus carreras.
- `GET /catalogo/opciones-filtro` → `OpcionesFiltroLibroResponse` (sección 6), calculado solo con los libros activos: valores de los desplegables de materia, autor y clasificación de P6.1 (RF6.1.1.3); los de biblioteca y facultad salen de `GET /bibliotecas` y `GET /facultades`.
- `GET /catalogo/libros/{id}` → `LibroDetalleResponse` (registra la visualización en `registro_uso`)
- `GET /catalogo/libros/{id}/ejemplar-reservable` → `EjemplarReservableResponse` [RESERVA_REALIZAR] (P7.1, RF7.3): el primer ejemplar con estado `disponible` del libro (menor `idEjemplar`). Responde 409 con `ErrorRespuesta` si no hay ninguno («Sin ejemplares disponibles» / «El libro no tiene ejemplares disponibles para reserva en este momento.») o si el usuario ya tiene una reserva activa de ese libro (sección 9).
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
// NovedadResponse (RF6.2.5; autor y materia: tarjeta de Figma 9:7). Los libros activos más recientes por fechaIncorporacion, tantos como biblioteca.catalogo.cantidad-novedades
{ "idLibro": 1, "titulo": "Introducción a la Programación", "autor": "Ana Torres", "materia": "Informática",
  "portadaUrl": "/api/v1/catalogo/libros/1/portada", "fechaIncorporacion": "2026-07-15" }
```

`ubicaciones` de `LibroDetalleResponse`: una entrada por biblioteca donde el libro tiene al menos un ejemplar con ubicación física registrada, ordenadas por nombre (`disponibles` y `total` cuentan todos los ejemplares del libro en esa biblioteca). Vacía si el libro no tiene ejemplares o si ninguno tiene ubicación física: la interfaz indica entonces que aún no se asignó una ubicación (RF6.1.2.2, curso alternativo). `ejemplaresDisponibles` y `ejemplaresTotales` *(calculados)*: ejemplares con estado `disponible` y todos los del libro.

## 8. Ejemplares (RF5)

- `GET /ejemplares?q&idBiblioteca&idFacultad&estado&disponible&ubicacion&sinUbicacion` → `Pagina<EjemplarResponse>` [EJEMPLAR_CONSULTAR]. `q`: código de ejemplar o título del libro (RF5.3.1). `idFacultad`: ejemplares de las bibliotecas de esa facultad o de sus carreras. `ubicacion`: uno de los valores de `ubicaciones` (igualdad exacta). `sinUbicacion=true`: solo los ejemplares sin ubicación física registrada (opción «Sin ubicación asignada» del filtro, RF5.7); no se combina con `ubicacion`.
- `GET /ejemplares/opciones-filtro` → `OpcionesFiltroEjemplarResponse` [EJEMPLAR_CONSULTAR] (valores del desplegable «Ubicación» de P5.2, RF5.3.1.1.3; los de biblioteca y facultad salen de `GET /bibliotecas` y `GET /facultades`, y los de estado y disponibilidad son fijos)
- `GET /ejemplares/{id}` → `EjemplarResponse` [EJEMPLAR_CONSULTAR] (P5.3)
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
// OpcionesFiltroEjemplarResponse: ubicaciones físicas distintas registradas en la tabla ejemplar, ordenadas alfabéticamente (sin las vacías)
{ "ubicaciones": ["Estante 2A, Dewey 515", "Estante 4B, Dewey 005.1"] }
```

Validación de `EjemplarRequest` y `EjemplarActualizarRequest` (400 con `errores[]` por campo): `codigoEjemplar` obligatorio (máximo 30); `ubicacionFisica` opcional (máximo 100); `idLibro` obligatorio, de un libro activo (solo al registrar); `idBiblioteca` obligatoria y activa, salvo en `PUT` cuando el ejemplar conserva su biblioteca actual aunque esté inactiva («La biblioteca seleccionada no está activa.»); `estado` uno de los seis de `docs/modelo-datos.md`. El código es único: si ya lo tiene otro ejemplar, 409 con el detalle «El código de ejemplar ya se encuentra en uso.». Si `estado` cambia sin EJEMPLAR_CAMBIAR_ESTADO, 403 con `titulo` «Acceso denegado» y `detalle` «No tiene permiso para cambiar el estado del ejemplar.». Un ejemplar nuevo queda `disponible`.

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

Reglas de las reservas propias (RF7):

- `POST /reservas`: la reserva queda en `Pendiente`, con la fecha de hoy y `atendida: false`, asociada al usuario del token; su estado inicial se anota en el historial (`estadoAnterior: null`). Una reserva pendiente **no aparta** el ejemplar: su estado sigue `disponible`. Responde 409 si el ejemplar ya no está disponible o su libro está inactivo («Ejemplar no disponible» / «El ejemplar ya no se encuentra disponible.», RF7.1) y si el usuario ya tiene una reserva activa (`Pendiente`, o `Confirmada` con `atendida: false`) de ese mismo libro («Reserva duplicada» / «Ya tiene una reserva activa de este libro.»).
- `GET /reservas/mias`: las del usuario del token, de la más reciente a la más antigua.
- `PATCH /reservas/{id}/cancelar`: solo reservas del propio usuario (si no, 404) en estado `Pendiente` o `Confirmada` con `atendida: false`; en otro caso, 409 («Reserva no cancelable» / «La reserva ya no puede cancelarse debido a su estado actual.», RF7.4). Pasa a `Cancelada` y se anota en el historial; si estaba `Confirmada`, su ejemplar vuelve a `disponible` (RF7.4, paso 7).
- Al confirmar una reserva (RF8.3) su ejemplar pasa a `reservado`.

Reglas de la administración de reservas (RF8):

- Ámbito (RF8.2): si el usuario del token tiene biblioteca responsable (`usuario.id_biblioteca`), `GET /reservas` y `GET /reservas/historial` devuelven solo las reservas de ejemplares de esa biblioteca e ignoran `idBiblioteca`; sin biblioteca asignada, se filtra por cualquiera.
- `GET /reservas`: `q` busca en el nombre del usuario, el título del libro y el nombre de la biblioteca; `estado` es uno de los cuatro; `desde` y `hasta` (fechas, inclusivas) filtran por la fecha de la reserva. De la más reciente a la más antigua.
- `GET /reservas/historial`: una fila por cambio de estado (`historial_estado_reserva`), de la más reciente a la más antigua; `desde` y `hasta` filtran por la fecha del cambio (P8.2 solo usa el periodo).
- `GET /reservas/{id}`: responde 409 («Reserva no vigente» / «La reserva ya no se encuentra vigente.», RF8.8.3) si no está `Confirmada` con `atendida: false`. Lo usan «Prestar» de P8.1 antes de derivar y P9.1/P9.3 al precargar.
- `PATCH /reservas/{id}/confirmar`: solo desde `Pendiente` (si no, 409 «Reserva ya atendida» / «La reserva ya fue atendida.»); el ejemplar debe estar `disponible` (si no, 409 «Ejemplar no disponible» / «El ejemplar ya no se encuentra disponible.») y pasa a `reservado`.
- `PATCH /reservas/{id}/rechazar` `MotivoRequest`: solo desde `Pendiente` (si no, el mismo 409 «La reserva ya fue atendida.»). El ejemplar no cambia.
- `PATCH /reservas/{id}/cancelar-administrativa` `MotivoRequest`: solo desde `Confirmada` con `atendida: false` (RF8.5.5; si no, 409 «Reserva no activa» / «La reserva ya no está activa.»); el ejemplar vuelve a `disponible`.
- `MotivoRequest`: `{ "motivo": "..." }`; el motivo es opcional (`null` o vacío) y se guarda en `reserva.motivo`, que el usuario ve en P7.2.
- Cada cambio de estado se anota en el historial con la fecha de hoy.
- Regla general (RF8.6, curso alternativo): cualquier acción sobre una reserva cuyo estado actual no la permite responde 409, aunque la interfaz no la ofrezca. Los casos de arriba usan el texto de su caso de uso; cualquier otra transición no permitida responde 409 con `titulo` «Transición no permitida» y `detalle` «La transición de estado solicitada no está permitida.».

El desplegable de estado de cada fila de P8.1 (RF8.6) solo ofrece los cambios permitidos desde el estado actual: Confirmada llama a `/confirmar`; Rechazada, a `/rechazar`, y Cancelada, a `/cancelar-administrativa`. Estas dos últimas piden el motivo. No existe un endpoint genérico de cambio de estado.

```json
// ReservaResponse (P7.2 y P8.1: usuario, libro, fecha, biblioteca, estado, RF8.1.4; usuarioRu y usuarioCarreraNombre precargan P9.1 y P9.3 sin pedir el RU, RF9.1.6 y RF9.2.10)
{ "idReserva": 3, "fecha": "2026-07-26", "estado": "Pendiente", "atendida": false, "motivo": null,
  "idUsuario": 12, "usuarioNombre": "Estudiante Pérez", "usuarioRu": "2019001234", "usuarioCarreraNombre": "Ingeniería de Sistemas",
  "idEjemplar": 7, "ejemplarCodigo": "EJ-00123",
  "idLibro": 1, "libroTitulo": "Introducción a la Programación", "idBiblioteca": 1, "bibliotecaNombre": "Biblioteca Central" }
```

```json
// HistorialReservaResponse (P8.2: usuario, libro, fecha, estado y biblioteca, RF8.7.4)
{ "idHistorialReserva": 9, "fecha": "2026-07-27", "estadoAnterior": "Pendiente", "estadoNuevo": "Confirmada",
  "idReserva": 3, "usuarioNombre": "Estudiante Pérez", "libroTitulo": "Introducción a la Programación", "bibliotecaNombre": "Biblioteca Central" }
```

## 10. Préstamos y devoluciones (RF9)

- `GET /prestamos/ejemplares-disponibles?idLibro&idReserva` → `EjemplarPrestableResponse[]` [PRESTAMO_SALA_REGISTRAR o PRESTAMO_DOMICILIO_REGISTRAR] (lista «Ejemplares disponibles del libro seleccionado» de P9.1 y P9.3, RF9.1.2 y RF9.2.2: los ejemplares `disponible` del libro; con `idReserva`, además el ejemplar apartado por esa reserva confirmada)
- `POST /prestamos/sala` `PrestamoSalaRequest` → `PrestamoResponse` [PRESTAMO_SALA_REGISTRAR]
- `POST /prestamos/domicilio` `PrestamoDomicilioRequest` → `PrestamoResponse` [PRESTAMO_DOMICILIO_REGISTRAR]
- `GET /prestamos?tipoPrestamo&estado&q&pagina&tamanio` → `Pagina<PrestamoResponse>` [PRESTAMO_CONSULTAR o DEVOLUCION_REGISTRAR] (`q` busca por código de ejemplar, usuario o número de préstamo, RF9.3.6; P9.2 y P9.4 usan `estado=activo` y su tipo; P9.5, `estado=activo` y `q`)
- `POST /prestamos/{id}/ampliaciones` `AmpliacionRequest` → `AmpliacionResponse` [PRESTAMO_AMPLIAR]
- `POST /devoluciones` `DevolucionRequest` → `DevolucionResponse` [DEVOLUCION_REGISTRAR]
- `GET /devoluciones?q&desde&hasta&pagina&tamanio` → `Pagina<DevolucionResponse>` [DEVOLUCION_HISTORIAL_CONSULTAR] (`q`: usuario, código de ejemplar o título del libro; `desde` y `hasta`: fecha de devolución)

Antes de registrar el préstamo, el frontend llama a `POST /usuarios/validar-ru` (sección 4) para mostrar los datos verificados. Busca el libro con `GET /catalogo/libros?q` (sección 7), porque el Bibliotecario no tiene LIBRO_CONSULTAR ni EJEMPLAR_CONSULTAR.

Préstamo desde una reserva confirmada (RF8.8): el botón «Prestar» de P8.1 abre `/prestamos/sala/registrar?idReserva=N` o `/prestamos/domicilio/registrar?idReserva=N`; la pantalla carga la reserva con `GET /reservas/{id}` y precarga el usuario (`usuarioRu`, `usuarioNombre`, `usuarioCarreraNombre`) y el ejemplar, sin pedir el RU (RF9.1.6 y RF9.2.10).

Reglas del registro de préstamos (RF9.1 y RF9.2):

- Ámbito (como RF8.2): un usuario con biblioteca responsable solo presta ejemplares de su biblioteca y solo ve los préstamos y devoluciones de ejemplares de su biblioteca (`GET /prestamos`, `GET /devoluciones` y `GET /prestamos/ejemplares-disponibles`); sin biblioteca, todos.
- `ru`: el usuario debe estar vigente en el servicio institucional (si aún no está en `usuario`, se registra con sus datos mínimos, `docs/reglas-negocio.md`) y activo; si no, 409 «Usuario no habilitado» / «El usuario no está habilitado para solicitar préstamos.».
- `idEjemplar`: debe estar `disponible` (o ser el apartado por la reserva de `idReserva`) y en el ámbito del usuario; si no, 409 «Ejemplar no disponible» / «El ejemplar no está disponible.». A domicilio, además, `soloSala` debe ser `false`; si no, 409 «Ejemplar de uso exclusivo en sala» / «El ejemplar es de uso exclusivo en sala.» (RF9.2.3).
- `idReserva` (opcional): una reserva Confirmada sin atender del mismo usuario; si no, 409 «Reserva no vigente» / «La reserva ya no se encuentra vigente.». Se puede prestar otro ejemplar disponible del mismo libro (RF9.1.6); entonces el ejemplar apartado vuelve a `disponible`. La reserva queda `atendida: true` (su estado no cambia).
- `fechaLimiteDevolucion` (solo a domicilio, obligatoria): entre mañana y hoy + `biblioteca.prestamo.plazo-maximo-dias` (30); si no, 400 con «La fecha de devolución debe estar entre el DD/MM/AAAA y el DD/MM/AAAA.» en ese campo. La interfaz propone hoy + 30 y, si se ajusta fuera de ese rango, restablece la fecha calculada (RF9.2.5).
- `celularContacto` (solo a domicilio, obligatorio): exactamente 8 dígitos; si no, 400 con «El celular de contacto debe tener 8 dígitos.».
- Al registrar, el préstamo queda `activo`, con la fecha y hora actuales, y el ejemplar pasa a `prestado` (en sala y a domicilio, RF9.1.4 y RF9.2.6); `ejemplarEstado` de la respuesta lo muestra enseguida.

Reglas de las ampliaciones (RF9.2.8): solo préstamos a domicilio activos (si no, 409 «Préstamo no ampliable» / «Solo se amplían préstamos a domicilio vigentes.»), vencidos o no, sin límite de cantidad. Nueva fecha límite = max(fecha límite vigente, hoy) + `DIAS_AMPLIACION_PRESTAMO` (7), de solo lectura: la interfaz la calcula con la misma regla para mostrarla en la ventana y la envía en `fechaNueva`; el backend la vuelve a calcular y responde 400 si no coincide («La fecha propuesta ya no es válida. Vuelva a abrir la ampliación.» en `fechaNueva`). Se guardan la fecha anterior y la nueva en `ampliacion_prestamo`, y la nueva en `prestamo`. Configurable como el plazo: `biblioteca.prestamo.dias-ampliacion=7`.

Reglas de las devoluciones (RF9.3): solo préstamos activos (si no, 409 «Préstamo no vigente» / «El préstamo ya fue devuelto.»); `observaciones` obligatorias si `estadoEjemplar` no es «Buen estado» (400 con «Las observaciones son obligatorias cuando el estado no es «Buen estado».»). La devolución lleva la fecha de hoy; el préstamo pasa a `inactivo` y el ejemplar a `disponible` («Buen estado») o `no disponible` («Con observaciones» o «Dañado»), RF9.3.4. `conRetraso`: solo a domicilio, si la fecha de devolución es posterior a la fecha límite; en sala nunca (RF9.3.1).

```json
// EjemplarPrestableResponse (código, autor y ubicación física de cada ejemplar, RF9.1.10; soloSala para RF9.2.3)
{ "idEjemplar": 7, "codigoEjemplar": "EJ-00123", "libroTitulo": "Introducción a la Programación", "autor": "Ana Torres",
  "ubicacionFisica": "Estante 4B, Dewey 005.1", "estado": "disponible", "soloSala": true }
```

```json
// PrestamoSalaRequest (idReserva solo si viene de una reserva confirmada, RF8.8)
{ "ru": "2019001234", "idEjemplar": 7, "idReserva": null }
```

```json
// PrestamoDomicilioRequest (fecha límite: hoy + plazo, ajustable hacia atrás hasta mañana)
{ "ru": "2019001234", "idEjemplar": 7, "fechaLimiteDevolucion": "2026-08-10", "celularContacto": "70000000", "idReserva": null }
```

```json
// PrestamoResponse (P9.2: usuario, ejemplar, fecha de inicio, estado; P9.4: además fecha límite, RF9.1.5.4 y RF9.2.7.4)
{ "idPrestamo": 15, "fechaPrestamo": "2026-07-26T09:15:00", "estado": "activo", "tipoPrestamo": "domicilio",
  "fechaLimiteDevolucion": "2026-08-10", "celularContacto": "70000000",
  "idUsuario": 12, "usuarioNombre": "Estudiante Pérez", "usuarioRu": "2019001234",
  "idEjemplar": 7, "ejemplarCodigo": "EJ-00123", "ejemplarEstado": "prestado", "libroTitulo": "Introducción a la Programación",
  "idReserva": null, "vencido": false, "cantidadAmpliaciones": 0 }
```

`vencido` y `cantidadAmpliaciones` *(calculados)*: P9.4 señala los vencidos (fecha límite anterior a hoy) y la ventana de ampliación muestra cuántas hubo (RF9.2.8). `ejemplarEstado`: estado actual del ejemplar, que P9.1 y P9.3 muestran tras registrar (RF9.1.4.3 y RF9.2.6.3).

```json
// AmpliacionRequest (fechaNueva = max(fecha límite vigente, hoy) + 7)
{ "fechaNueva": "2026-08-20" }
```

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
  "idPrestamo": 15, "usuarioNombre": "Estudiante Pérez", "ejemplarCodigo": "EJ-00123", "libroTitulo": "Introducción a la Programación",
  "ejemplarEstado": "disponible", "fechaPrestamo": "2026-07-26T09:15:00", "conRetraso": false }
```

`conRetraso` *(calculado)*: la devolución fue posterior a la fecha límite (RF9.3.3). `ejemplarEstado`: estado del ejemplar tras la devolución (RF9.3.4.4). P9.6 lista de la devolución más reciente a la más antigua.

## 11. Tesis: gestión (RF10)

- `GET /tesis?q&idCarrera&gestion&pagina&tamanio` → `Pagina<TesisResponse>` [TESIS_CONSULTAR] (`q`: título, autor o número de inventario, RF10.3.1; activas e inactivas; de la gestión más reciente a la más antigua)
- `GET /tesis/opciones-filtro` → `OpcionesFiltroTesisResponse` [TESIS_CONSULTAR] (valores del desplegable «Gestión» de P10.3, RF10.3.1.1.3; los de «Carrera» salen de `GET /carreras`)
- `GET /tesis/{id}` → `TesisResponse` [TESIS_CONSULTAR, TESIS_ACTUALIZAR, TESIS_DOCUMENTO_CARGAR o TESIS_DOCUMENTO_ACTUALIZAR] (P10.2, P10.4 y P10.5)
- `POST /tesis` `TesisRequest` → `TesisResponse` [TESIS_REGISTRAR] · `PUT /tesis/{id}` `TesisRequest` → `TesisResponse` [TESIS_ACTUALIZAR]
- `PATCH /tesis/{id}/estado` `{ "estado": false }` para desactivar (RF10.6) o `{ "estado": true }` para activar (RF10.7) [TESIS_CAMBIAR_ESTADO]
- `GET /tesis/{id}/documentos` → `DocumentoTesisResponse[]` [TESIS_CONSULTAR, TESIS_DOCUMENTO_CARGAR o TESIS_DOCUMENTO_ACTUALIZAR]
- `POST /tesis/{id}/documentos` (multipart: `tipoSeccion` + `archivo`) → `DocumentoTesisResponse` [TESIS_DOCUMENTO_CARGAR]
- `PUT /tesis/{id}/documentos/{idDocumento}` (multipart: `archivo`) → `DocumentoTesisResponse` [TESIS_DOCUMENTO_ACTUALIZAR]

Validación de `TesisRequest` (400 con `errores[]` por campo): `titulo` (máximo 250), `autor` (máximo 150), `tutor` (máximo 150), `numeroInventario` (máximo 30) e `idCarrera` obligatorios; `palabrasClave` opcional (máximo 250); `gestion` obligatoria, de 4 dígitos y no posterior al año actual («La gestión debe tener 4 dígitos y no ser posterior al año actual.»); `idCarrera` de una carrera activa, salvo en `PUT` cuando la tesis conserva su carrera actual aunque esté inactiva («La carrera seleccionada no está activa.»). Al registrar, el número de inventario es único: si ya existe, 409 con el detalle «Ya existe una tesis con ese número de inventario.». En `PUT` el número de inventario no se cambia (se conserva el actual, RF10.4) ni el estado (solo con `PATCH /tesis/{id}/estado`, como el libro). Una tesis nueva queda activa.

Documentos (RF10.2 y RF10.5): solo PDF de 20 MB como máximo; si no, 400 con `titulo` «Archivo no válido», `detalle` «Solo se admiten archivos PDF.» o «El archivo supera el tamaño máximo de 20 MB.» y el mismo mensaje en `errores[]` del campo `archivo`. Un documento por tipo de sección (`docs/reglas-negocio.md`): `POST` con una sección ya cargada responde 409 «Sección ya cargada» / «La sección ya tiene un documento cargado. Reemplácelo desde «Actualizar documento».». `PUT` reemplaza solo ese documento (mismo `tipoSeccion`, nuevo `nombreArchivo`) sin afectar los demás.

```json
// TesisResponse (tabla de P10.3: título, autor, carrera, facultad, gestión y estado, RF10.3.4)
{ "idTesis": 1, "titulo": "Modelo predictivo de deserción estudiantil", "autor": "Estudiante Rojas", "tutor": "Docente Gómez",
  "gestion": 2026, "numeroInventario": "EJ-TES-0142", "palabrasClave": "deserción, modelo predictivo, minería de datos",
  "estado": true, "idCarrera": 1, "carreraNombre": "Ingeniería de Sistemas", "idFacultad": 1, "facultadNombre": "Facultad de Ciencias y Tecnología" }
```

La facultad no se guarda en la tesis: se obtiene de su carrera. El desplegable «Facultad» de P10.1 y P10.4 solo filtra las carreras.

```json
// TesisRequest (sin estado: se cambia con PATCH /tesis/{id}/estado; numeroInventario se ignora en PUT)
{ "titulo": "Modelo predictivo de deserción estudiantil", "autor": "Estudiante Rojas", "tutor": "Docente Gómez",
  "gestion": 2026, "numeroInventario": "EJ-TES-0142", "palabrasClave": "deserción, modelo predictivo", "idCarrera": 1 }
```

```json
// OpcionesFiltroTesisResponse (gestiones distintas de las tesis registradas, de la más reciente a la más antigua)
{ "gestiones": [2026, 2025, 2024] }
```

```json
// DocumentoTesisResponse (tipoSeccion: Preliminares, Resumen, Marco Teórico, Bibliografía o Anexos, RF10.2.3)
{ "idDocumento": 3, "tipoSeccion": "Marco Teórico", "nombreArchivo": "marco_teorico_v1.pdf", "idTesis": 1 }
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
