# Reglas de negocio e integridad

## Reglas de integridad por tabla

| Tabla | Regla |
|---|---|
| usuario | El nombre de usuario y el RU no se repiten. La contraseña cifrada es nula para los usuarios que se validan con el servicio institucional; esta última condición la garantiza la aplicación, porque depende del tipo de usuario del rol asignado. |
| biblioteca | Una biblioteca pertenece a una facultad o a una carrera, nunca a las dos; la Biblioteca Central y la de postgrado no pertenecen a ninguna. |
| ejemplar | El estado solo admite disponible, reservado, prestado, no disponible, en mantenimiento o desactivado. |
| mensaje | El estado solo admite Pendiente o Respondido. |
| reserva | El estado solo admite los valores Pendiente, Confirmada, Rechazada o Cancelada. |
| prestamo | El estado solo admite activo o inactivo. La fecha límite de devolución es obligatoria en los préstamos a domicilio y debe estar vacía en los préstamos en sala. Cada reserva origina como máximo un préstamo. El tipo de un préstamo registrado no puede modificarse. |
| ampliacion_prestamo | La nueva fecha límite debe ser posterior a la fecha anterior. Solo se admiten ampliaciones de préstamos a domicilio; los préstamos en sala no tienen fecha límite, porque el ejemplar se devuelve al salir de la biblioteca. |
| devolucion | Cada préstamo tiene como máximo una devolución. El estado del ejemplar solo admite Buen estado, Con observaciones o Dañado, y las observaciones son obligatorias cuando no es Buen estado. |
| documento_tesis | Una tesis tiene como máximo un documento por tipo de sección. |
| registro_uso | Cada registro se refiere a exactamente uno de estos objetos: libro, tesis o documento de tesis. |
| bitacora | La cuenta técnica de la aplicación solo tiene permiso de inserción sobre esta tabla. La columna id_registro_afectado no es clave foránea porque puede referirse a registros de cualquier tabla; la columna entidad indica a cuál. |

## Disparadores de integridad (V1)

Solo para integridad de préstamos; la bitácora no usa disparadores.


- `tg_ampliacion_solo_domicilio`: rechaza ampliaciones de préstamos que no sean a domicilio.
- `tg_prestamo_tipo_inmutable`: impide modificar el tipo de un préstamo registrado.

## Préstamos y plazos

- El préstamo en sala no tiene fecha límite: el ejemplar se devuelve al salir de la biblioteca.
- Préstamo a domicilio: la fecha límite se calcula como hoy + 30 días y puede ajustarse hacia atrás; al registrarlo no puede superar **30 días**. Solo las ampliaciones pueden superar ese plazo, sin límite de ampliaciones.
- Los valores configurables van en `application.properties` (`biblioteca.prestamo.plazo-maximo-dias=30`; `biblioteca.catalogo.cantidad-novedades`, cuyo valor no está fijado: el documento solo da como ejemplo 20 o 50) y no en la base de datos.
- Si el usuario académico validado por RU no existe en `usuario`, se registran sus datos mínimos antes del préstamo: nombre, RU, carrera, nombre de usuario = RU y rol según RF1.3 (Estudiante o Docente si el servicio lo informa; si no, Usuario académico).

## Usuarios y autenticación

- Usuarios académicos (Estudiante, Docente, Usuario académico): inician sesión con RU y contraseña validados por el servicio institucional; `password_hash` es nulo y el sistema nunca guarda su contraseña (RF04 de seguridad).
- Usuarios internos: credenciales locales creadas por el Administrador general; la contraseña se genera automáticamente con un generador aleatorio seguro (`SecureRandom`), se muestra una sola vez y se guarda como hash **Argon2id** (no BCrypt). No se envía por correo ni por otro medio.
- Argon2id con los parámetros mínimos de OWASP: memoria 19 MiB (19456 KiB), 2 iteraciones, paralelismo 1, sal de 16 bytes, hash de 32 bytes. Solo hash, sin clave adicional.
- El Administrador general del sistema no se crea desde el sistema ni desde el backend: lo crea el administrador de la base de datos con un hash Argon2id generado fuera de PostgreSQL. No hay usuarios ni contraseñas en el repositorio ni en las migraciones.
- Los intentos fallidos de inicio de sesión no se registran en la bitácora; solo se cuentan en memoria para el bloqueo temporal (ver «Protección del inicio de sesión»).

## Protección del inicio de sesión (contra saturación por Argon2id)

Argon2id consume memoria y CPU a propósito; estas cuatro medidas evitan que muchos intentos de inicio de sesión saturen el servidor. Todas se aplican **antes** de calcular el hash:

1. Límite de peticiones a `POST /auth/login` por IP y por nombre de usuario (por defecto 10 por minuto por IP y 5 por minuto por usuario). Al superarlo, 429.
2. Se rechaza sin calcular el hash una contraseña vacía o de más de 128 caracteres, con el mismo 401 genérico de credenciales incorrectas.
3. Bloqueo temporal por usuario tras intentos fallidos seguidos (por defecto 5 fallos → 15 minutos). Los contadores viven en memoria, no en la base de datos. Responde 429 sin revelar si el usuario existe.
4. Límite de cálculos de hash simultáneos (por defecto 4): si están ocupados, la petición espera un tiempo corto (por defecto 2 segundos) y, si no hay lugar, responde 429.

Los valores se configuran en `application.properties` (`biblioteca.login.*`).

## Sesión

- No se guarda nada de la sesión en la base de datos (sesión sin estado).
- Token de acceso: JWT de 15 minutos, firmado con HS256; el frontend lo guarda solo en memoria (una señal) y lo envía en `Authorization: Bearer`.
- Token de renovación: JWT firmado, en una cookie `HttpOnly`, `Secure`, `SameSite=Strict`, con `Path=/api/v1/auth`, que vence 15 minutos después de la última renovación. Incluye el id del usuario, la hora de inicio de sesión, la IP y un hash (SHA-256) del navegador (`User-Agent`) desde los que se inició la sesión.
- Inactividad: el frontend solo pide `POST /auth/refresh` si el usuario tuvo actividad (clic, tecla o navegación) en los últimos 15 minutos. Las peticiones automáticas no cuentan como actividad. Sin actividad durante 15 minutos, la sesión termina y se vuelve a `/iniciar-sesion`.
- Duración máxima: 8 horas desde el inicio de sesión, aunque haya actividad; después se debe iniciar sesión de nuevo.
- Cookie robada: al renovar, el backend compara la IP y el navegador de la petición con los guardados en el token de renovación. Si no coinciden, rechaza la renovación (401), borra la cookie y el usuario debe iniciar sesión de nuevo. Limitaciones aceptadas: no detecta a un atacante que salga por la misma IP pública (por ejemplo, en la misma red de la universidad), y un usuario que cambia de red debe volver a iniciar sesión.
- En cada renovación el backend vuelve a leer el usuario: si fue desactivado, rechaza la renovación; los permisos se recargan, de modo que un cambio de rol se aplica en un máximo de 15 minutos.
- Al recargar la página, el frontend llama a `POST /auth/refresh` para recuperar la sesión con la cookie.
- Cerrar sesión: `POST /auth/cerrar-sesion` borra la cookie y el frontend borra el token de memoria. Un token de acceso ya emitido sigue siendo válido hasta su vencimiento (máximo 15 minutos): es el costo aceptado de no guardar sesiones.
- Detrás de un proxy (nginx) en producción, el backend debe leer la IP real del cliente (`server.forward-headers-strategy`); si no, todas las peticiones parecerían venir del proxy.
- Renovación anticipada: el frontend llama a `/auth/refresh` un minuto antes de que venza el token de acceso, solo si hubo actividad; así el token y la cookie no vencen mientras el usuario trabaja.
- Despliegue: por `SameSite=Strict`, en producción el frontend y el backend deben estar en el mismo sitio (mismo dominio, por ejemplo con nginx sirviendo el frontend y redirigiendo `/api` al backend). En desarrollo, `localhost:4200` y `localhost:8080` cuentan como el mismo sitio; se recomienda probar con Chrome o Firefox (Safari puede rechazar cookies `Secure` en `http://localhost`).
- Prototipo (Iteración 4): no hay tokens reales ni cookie; la sesión vive solo en memoria y se pierde al recargar la página.

## Bitácora

- Una sola tabla `bitacora` con usuario, acción, entidad, id del registro afectado, detalle y fecha y hora.
- Se registra: inicio de sesión exitoso de usuarios internos, creación, actualización y eliminación o desactivación de registros hechas por usuarios internos (RF06 de seguridad). La renovación del token (`/auth/refresh`) no es un inicio de sesión y no se registra.
- No se registran consultas ni acciones de estudiantes, docentes o visitantes.
- La bitácora se registra en la aplicación (en la capa de servicio del backend), no con disparadores de la base de datos.
- Cuenta técnica `app_biblioteca`: la usan el backend y Flyway; crea las tablas y puede leer, insertar, actualizar y borrar en todas ellas, excepto en `bitacora`, que pertenece al administrador de la base de datos y donde solo puede insertar (RF12 de seguridad), más la lectura de `id_bitacora` y el uso de su secuencia, que Hibernate necesita para el `RETURNING`. Ese traspaso lo hace el administrador de la base de datos después del primer arranque, fuera del repositorio.
- La consulta de la bitácora la hace el administrador de la base de datos, fuera del sistema. El backend nunca lee la bitácora.
- Ninguna migración de Flyway puede modificar la tabla `bitacora` (la cuenta técnica no es su dueña); un cambio en ella lo hace a mano el administrador de la base de datos.
- El historial de cambios del libro (`historial_cambio_libro`) y el historial de estados de la reserva (`historial_estado_reserva`) son tablas propias, independientes de la bitácora.

## Otros

- Notificaciones de reservas: no se guardan; el usuario ve el cambio en el estado de su reserva.
- «Ítems más consultados» se calcula con las visualizaciones registradas en `registro_uso`.
- El resumen de cada hilo de mensajes se genera a partir del inicio del texto de la consulta; no hay columna «asunto».
- Las facultades y las carreras se registran desde P3.2 (RF3.2 y RF3.4). Solo la Biblioteca Central y la de postgrado, que no pertenecen a ninguna facultad ni carrera, se cargan por base de datos; sus datos (ubicación y descripción) están pendientes de definir y aún no figuran en V2.
- La Biblioteca Central solo permite editar nombre, ubicación y descripción; su estado es siempre activo (RF3.7.5).
