# Modelo de datos (PostgreSQL, 3FN)

21 tablas. Fuente de verdad: las migraciones Flyway del backend (`V1__esquema.sql`). Nombres en snake_case en la base de datos y camelCase en Java y JSON.

## facultad

Facultades de la universidad; agrupan a las carreras.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_facultad | serial | sí | PK | Identificador único de la facultad. |
| nombre | varchar(100) | sí | único | Nombre oficial de la facultad. |
| estado | boolean | sí |  | Indica si la facultad está activa. Por defecto: `true`. |

## carrera

Carreras de la universidad; cada una pertenece a una facultad.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_carrera | serial | sí | PK | Identificador único de la carrera. |
| nombre | varchar(100) | sí |  | Nombre oficial de la carrera. |
| estado | boolean | sí |  | Indica si la carrera está activa. Por defecto: `true`. |
| id_facultad | integer | sí | FK → facultad | Facultad a la que pertenece la carrera. |

Restricción: `uq_carrera_nombre_facultad UNIQUE (nombre, id_facultad)`

## biblioteca

Bibliotecas físicas: la Biblioteca Central, la de postgrado y las de facultad o de carrera.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_biblioteca | serial | sí | PK | Identificador único de la biblioteca. |
| nombre | varchar(100) | sí | único | Nombre de la biblioteca. |
| ubicacion | varchar(150) | sí |  | Ubicación física de la biblioteca. |
| descripcion | varchar(250) | no |  | Descripción breve de la biblioteca. |
| id_facultad | integer | no | FK → facultad | Facultad a la que pertenece, cuando es de toda una facultad. |
| estado | boolean | sí |  | Indica si la biblioteca está activa. Por defecto: `true`. |
| id_carrera | integer | no | FK → carrera | Carrera a la que pertenece, cuando es de una carrera específica. |

Restricción: `ck_biblioteca_facultad_o_carrera CHECK (id_facultad IS NULL OR id_carrera IS NULL)`

## rol

Roles que se asignan a los usuarios del sistema.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_rol | serial | sí | PK | Identificador único del rol. |
| nombre | varchar(60) | sí | único | Nombre del rol. |
| id_tipo_usuario | integer | sí | FK → tipo_usuario | Tipo de usuario al que corresponde el rol. |

## permiso

Permisos que habilitan funcionalidades del sistema.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_permiso | serial | sí | PK | Identificador único del permiso. |
| codigo | varchar(60) | sí | único | Identificador fijo del permiso que usan el frontend y el backend. |
| nombre | varchar(100) | sí |  | Funcionalidad del sistema que habilita el permiso. |

## rol_permiso

Permisos asignados a cada rol (relación muchos a muchos).

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_rol | integer | sí | PK, FK → rol | Rol al que se asigna el permiso. |
| id_permiso | integer | sí | PK, FK → permiso | Permiso asignado al rol. |

## tipo_usuario

Tipos de usuario y su forma de autenticación (académico, interno).

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_tipo_usuario | serial | sí | PK | Identificador único del tipo de usuario. |
| nombre | varchar(20) | sí | único | Tipo de usuario: 'académico' o 'interno'. |
| tipo_autenticacion | varchar(15) | sí |  | Forma de autenticación: 'institucional' o 'local'. Regla: `tipo_autenticacion IN ('institucional','local')`. |

## usuario

Usuarios del sistema: estudiantes, docentes y personal interno.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_usuario | serial | sí | PK | Identificador único del usuario. |
| nombre | varchar(120) | sí |  | Nombre completo del usuario. |
| nombre_usuario | varchar(50) | sí | único | Nombre de usuario para iniciar sesión. |
| password_hash | varchar(255) | no |  | Contraseña cifrada; nulo si se autentica con el servicio institucional. |
| correo | varchar(120) | no |  | Correo institucional (opcional). |
| ru | varchar(15) | no | único | Registro Universitario (estudiantes y docentes). |
| estado | boolean | sí |  | Indica si el usuario está activo. Por defecto: `true`. |
| id_rol | integer | sí | FK → rol | Rol asignado al usuario. |
| id_biblioteca | integer | no | FK → biblioteca | Biblioteca de la que es responsable (personal interno). |
| id_carrera | integer | no | FK → carrera | Carrera del usuario académico; la facultad se obtiene de la carrera. |

## libro

Registros bibliográficos del catálogo.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_libro | serial | sí | PK | Identificador único del libro. |
| titulo | varchar(250) | sí |  | Título del libro. |
| autor | varchar(200) | sí |  | Autor o autores del libro. |
| editorial | varchar(120) | no |  | Editorial. |
| materia | varchar(100) | sí |  | Materia o tema del libro. |
| clasificacion_dewey | varchar(30) | no |  | Clasificación Decimal Dewey. |
| isbn | varchar(20) | no | único | ISBN del libro (opcional). |
| portada | varchar(255) | no |  | Ruta de la imagen de portada. |
| fecha_incorporacion | date | sí |  | Fecha en que el libro se incorporó al catálogo. Por defecto: `CURRENT_DATE`. |
| estado | boolean | sí |  | Indica si el libro está activo en el catálogo. Por defecto: `true`. |

## ejemplar

Ejemplares físicos de cada libro.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_ejemplar | serial | sí | PK | Identificador único del ejemplar. |
| codigo_ejemplar | varchar(30) | sí | único | Código que identifica de manera única al ejemplar. |
| ubicacion_fisica | varchar(100) | no |  | Ubicación física dentro de la biblioteca (estante). |
| estado | varchar(20) | sí |  | Estado operativo: disponible, reservado, prestado, no disponible, en mantenimiento o desactivado. Por defecto: `'disponible'`. Regla: `estado IN ('disponible','reservado','prestado','no disponible','en mantenimiento','desactivado')`. |
| solo_sala | boolean | sí |  | Indica si es de uso exclusivo en sala; por defecto lo es. Por defecto: `true`. |
| id_libro | integer | sí | FK → libro | Libro al que pertenece el ejemplar. |
| id_biblioteca | integer | sí | FK → biblioteca | Biblioteca donde se encuentra el ejemplar. |

## historial_cambio_libro

Registro de las modificaciones realizadas a los datos de un libro.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_historial | serial | sí | PK | Identificador único del cambio. |
| fecha | date | sí |  | Fecha de la modificación. Por defecto: `CURRENT_DATE`. |
| campo_modificado | varchar(60) | sí |  | Campo del libro que fue modificado. |
| valor_anterior | varchar(500) | no |  | Valor del campo antes de la modificación. |
| valor_nuevo | varchar(500) | no |  | Valor del campo después de la modificación. |
| id_libro | integer | sí | FK → libro | Libro modificado. |

## reserva

Reservas de libros realizadas por los usuarios.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_reserva | serial | sí | PK | Identificador único de la reserva. |
| fecha | date | sí |  | Fecha en que se realizó la reserva. Por defecto: `CURRENT_DATE`. |
| estado | varchar(15) | sí |  | Estado: 'Pendiente', 'Confirmada', 'Rechazada' o 'Cancelada'. Regla: `estado IN ('Pendiente','Confirmada','Rechazada','Cancelada')`. |
| atendida | boolean | sí |  | Indica si la reserva ya derivó en un préstamo; es independiente del estado. Por defecto: `false`. |
| motivo | varchar(250) | no |  | Motivo del rechazo o de la cancelación (opcional). |
| id_usuario | integer | sí | FK → usuario | Usuario que realiza la reserva. |
| id_ejemplar | integer | sí | FK → ejemplar | Ejemplar reservado; el libro y la biblioteca se obtienen del ejemplar. |

## historial_estado_reserva

Cambios de estado de cada reserva.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_historial_reserva | serial | sí | PK | Identificador único del cambio de estado. |
| fecha | date | sí |  | Fecha del cambio de estado. Por defecto: `CURRENT_DATE`. |
| estado_anterior | varchar(15) | no |  | Estado de la reserva antes del cambio; nulo en el registro inicial. |
| estado_nuevo | varchar(15) | sí |  | Estado de la reserva después del cambio. Regla: `estado_nuevo IN ('Pendiente','Confirmada','Rechazada','Cancelada')`. |
| id_reserva | integer | sí | FK → reserva | Reserva a la que corresponde el cambio. |

## prestamo

Préstamos de ejemplares, en sala o a domicilio.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_prestamo | serial | sí | PK | Identificador único del préstamo. |
| fecha_prestamo | timestamp | sí |  | Fecha y hora en que se registró el préstamo. Por defecto: `CURRENT_TIMESTAMP`. |
| estado | varchar(15) | sí |  | Estado del préstamo: 'activo' o 'inactivo'. Por defecto: `'activo'`. Regla: `estado IN ('activo','inactivo')`. |
| tipo_prestamo | varchar(10) | sí |  | Tipo de préstamo: 'sala' o 'domicilio'. Regla: `tipo_prestamo IN ('sala','domicilio')`. |
| fecha_limite_devolucion | date | no |  | Fecha límite de devolución; solo en préstamos a domicilio. |
| celular_contacto | varchar(20) | no |  | Celular de contacto de quien recibe el préstamo a domicilio. |
| id_usuario | integer | sí | FK → usuario | Usuario que solicita el préstamo. |
| id_ejemplar | integer | sí | FK → ejemplar | Ejemplar prestado. |
| id_reserva | integer | no | FK → reserva, único | Reserva que originó el préstamo, si existe. |

Restricción: `ck_prestamo_fecha_limite CHECK ((tipo_prestamo = 'domicilio' AND fecha_limite_devolucion IS NOT NULL) OR (tipo_prestamo = 'sala' AND fecha_limite_devolucion IS NULL))`

## ampliacion_prestamo

Ampliaciones del plazo de los préstamos a domicilio.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_ampliacion | serial | sí | PK | Identificador único de la ampliación. |
| fecha_anterior | date | sí |  | Fecha límite de devolución antes de la ampliación. |
| fecha_nueva | date | sí |  | Nueva fecha límite de devolución. |
| id_prestamo | integer | sí | FK → prestamo | Préstamo a domicilio que se amplía. |

Restricción: `ck_ampliacion_fechas CHECK (fecha_nueva > fecha_anterior)`

## devolucion

Devoluciones de los ejemplares prestados.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_devolucion | serial | sí | PK | Identificador único de la devolución. |
| fecha_devolucion | date | sí |  | Fecha en que se devolvió el ejemplar. Por defecto: `CURRENT_DATE`. |
| estado_ejemplar | varchar(20) | sí |  | Estado en que se devuelve: 'Buen estado', 'Con observaciones' o 'Dañado'. Regla: `estado_ejemplar IN ('Buen estado','Con observaciones','Dañado')`. |
| observaciones | varchar(500) | no |  | Detalle de la condición del material; obligatorio si el estado no es Buen estado. |
| id_prestamo | integer | sí | FK → prestamo, único | Préstamo que se cierra con la devolución. |

Restricción: `ck_devolucion_observaciones CHECK (estado_ejemplar = 'Buen estado' OR (observaciones IS NOT NULL AND btrim(observaciones) <> ''))`

## tesis

Tesis académicas registradas.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_tesis | serial | sí | PK | Identificador único de la tesis. |
| titulo | varchar(250) | sí |  | Título de la tesis. |
| autor | varchar(150) | sí |  | Autor de la tesis. |
| tutor | varchar(150) | sí |  | Tutor de la tesis. |
| gestion | smallint | sí |  | Gestión (año) de la tesis. |
| numero_inventario | varchar(30) | sí | único | Número de inventario de la tesis. |
| palabras_clave | varchar(250) | no |  | Palabras clave del tema de la tesis. |
| estado | boolean | sí |  | Indica si la tesis está activa para la consulta. Por defecto: `true`. |
| id_carrera | integer | sí | FK → carrera | Carrera a la que corresponde la tesis. |

## documento_tesis

Documentos digitales de una tesis, uno por tipo de sección.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_documento | serial | sí | PK | Identificador único del documento. |
| tipo_seccion | varchar(20) | sí |  | Sección: Preliminares, Resumen, Marco Teórico, Bibliografía o Anexos. Regla: `tipo_seccion IN ('Preliminares','Resumen','Marco Teórico','Bibliografía','Anexos')`. |
| nombre_archivo | varchar(200) | sí |  | Nombre del archivo cargado. |
| ruta_archivo | varchar(255) | sí |  | Ruta de almacenamiento del archivo. |
| id_tesis | integer | sí | FK → tesis | Tesis a la que pertenece el documento. |

Restricción: `uq_documento_tesis_seccion UNIQUE (id_tesis, tipo_seccion)`

## mensaje

Mensajes y consultas entre usuarios.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_mensaje | serial | sí | PK | Identificador único del mensaje. |
| contenido | text | sí |  | Texto de la consulta o de la respuesta; no puede estar vacío. Regla: `btrim(contenido) <> ''`. |
| fecha | timestamp | sí |  | Fecha y hora de envío. Por defecto: `CURRENT_TIMESTAMP`. |
| estado | varchar(15) | sí |  | Estado: 'Pendiente' o 'Respondido'. Regla: `estado IN ('Pendiente','Respondido')`. |
| id_remitente | integer | sí | FK → usuario | Usuario que envía el mensaje. |
| id_destinatario | integer | no | FK → usuario | Usuario que recibe la respuesta; nulo en las consultas, que van a la bandeja de los bibliotecarios. |
| id_mensaje_respondido | integer | no | FK → mensaje | Mensaje al que responde, si es una respuesta. |

## registro_uso

Fechas de visualización de libros y tesis y de apertura de documentos, para dashboards y reportes.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_registro | serial | sí | PK | Identificador único del registro. |
| fecha | date | sí |  | Fecha de la visualización o apertura. Por defecto: `CURRENT_DATE`. |
| id_libro | integer | no | FK → libro | Libro cuyo detalle se visualizó. |
| id_tesis | integer | no | FK → tesis | Tesis cuyo detalle se visualizó. |
| id_documento | integer | no | FK → documento_tesis | Documento de tesis abierto. |

Restricción: `ck_registro_uso_un_objeto CHECK (num_nonnulls(id_libro, id_tesis, id_documento) = 1)`

## bitacora

Bitácora de auditoría de las acciones de los usuarios internos.

| Columna | Tipo | Obligatorio | Clave | Descripción |
|---|---|---|---|---|
| id_bitacora | serial | sí | PK | Identificador único del registro de bitácora. |
| accion | varchar(30) | sí |  | Acción realizada: inicio de sesión exitoso, creación, actualización, eliminación o desactivación. |
| entidad | varchar(50) | sí |  | Entidad (tabla) afectada por la acción. |
| id_registro_afectado | integer | no |  | Identificador del registro afectado, si corresponde. |
| detalle | varchar(500) | no |  | Descripción breve de la acción. |
| fecha_hora | timestamp | sí |  | Fecha y hora de la acción. Por defecto: `CURRENT_TIMESTAMP`. |
| id_usuario | integer | sí | FK → usuario | Usuario que realizó la acción. |
