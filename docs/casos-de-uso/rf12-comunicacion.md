# RF12 — Gestionar comunicación usuario-bibliotecario

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/comunicacion`.

## RF12 Gestionar Comunicación Usuario-Bibliotecario (caso de uso padre)

**Actores:** Usuario académico, Bibliotecario

**Tipo:** Primario

**Referencias:** RF12.1; RF12.2; RF12.3; RF12.4

**Propósito:** Administrar de forma integral la funcionalidad "Gestionar Comunicación Usuario-bibliotecario" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite enviar consulta al bibliotecario; consultar mensajes enviados; consultar mensajes recibidos; responder consulta del usuario.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con alguno de los siguientes roles habilitados: Usuario académico, Bibliotecario.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Gestionar Comunicación Usuario-bibliotecario" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde el menú lateral del sistema, la opción «Comunicación», que lo lleva a la interfaz P12.1, P12.2 según el caso de uso hijo que corresponda.
- 2.- El sistema despliega la interfaz correspondiente (P12.1, P12.2) con las opciones específicas de «Comunicación».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en la tabla mensaje.

## RF12.1 Enviar consulta al bibliotecario

**Actores:** Usuario académico

**Tipo:** Primario

**Referencias:** RF12.1.1; RF12.1.2; RF12.1.3

**Propósito:** Permitir que el Usuario académico envíe una consulta al Bibliotecario mediante el sistema, relacionada con información bibliográfica, disponibilidad de libros, reservas u orientación sobre el uso de los servicios bibliotecarios.

**Resumen:** Este caso de uso permite que el Usuario académico envíe una consulta al Bibliotecario mediante el sistema, relacionada con información bibliográfica, disponibilidad de libros, reservas u orientación sobre el uso de los servicios bibliotecarios. El sistema debe garantizar que la consulta queda registrada en el sistema y disponible para ser revisada por el Bibliotecario.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Usuario académico (docente o estudiante).

**Postcondiciones:** El sistema debe garantizar que la consulta queda registrada en el sistema y disponible para ser revisada por el Bibliotecario.

**Curso normal de eventos:**

- 1.- El usuario académico accede a la interfaz P12.1 «Bandeja de Mensajes» y pulsa el botón «Nueva consulta».
- 2.- El sistema presenta el área de texto para redactar la consulta y el botón «Enviar consulta», en la interfaz P12.2 «Ver Conversación».
- 3.- El usuario académico redacta el contenido de su consulta.
- 4.- El sistema toma el texto ingresado por el usuario.
- 5.- El usuario académico hace clic en el botón «Enviar consulta».
- 6.- El sistema registra la consulta, crea un nuevo hilo de comunicación y lo agrega a la Bandeja de Mensajes del Bibliotecario. La consulta se crea en la tabla mensaje.

**Curso alternativo de eventos:**

- ¿La consulta contiene contenido para ser enviado? En caso negativo, el sistema impide el envío e informa que la consulta no puede enviarse vacía.

**Requerimientos (RF12.1):**

- RF12.1.1: Este caso de uso permite que el Usuario académico envíe una consulta al Bibliotecario mediante el sistema, relacionada con información bibliográfica, disponibilidad de libros, reservas u orientación sobre el uso de los servicios bibliotecarios.
- RF12.1.2: El sistema debe garantizar que la consulta queda registrada en el sistema y disponible para ser revisada por el Bibliotecario.
- [Interfaz] RF12.1.3: La interfaz debe incluir un área de texto para redactar la consulta y un botón «Enviar consulta» para enviarla; esta interfaz se abre desde el botón «Nueva consulta» de la Bandeja de Mensajes (P12.1).

## RF12.2 Consultar mensajes enviados

**Actores:** Usuario académico, Bibliotecario

**Tipo:** Primario

**Referencias:** RF12.2.1; RF12.2.2; RF12.2.3; RF12.2.4

**Propósito:** Permitir consultar los mensajes que el actor ha enviado dentro del sistema.

**Resumen:** Este caso de uso permite consultar los mensajes que el actor ha enviado dentro del sistema. El sistema muestra los mensajes enviados por el actor.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Usuario académico o Bibliotecario.

**Postcondiciones:** El sistema muestra los mensajes enviados por el actor.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P12.1 «Bandeja de Mensajes», donde el sistema filtra los hilos según su rol: el Usuario académico ve únicamente los hilos que inició, el Bibliotecario ve todos los hilos.
- 2.- El sistema carga la lista de hilos de comunicación correspondiente al actor. Los datos se obtienen de las tablas mensaje y usuario.
- 3.- El actor revisa la lista ordenada por fecha.
- 4.- El sistema muestra el remitente, un resumen del hilo y el estado de cada uno: respondido o pendiente. El resumen de cada hilo se genera a partir del inicio del texto de la consulta; no se almacena como un dato aparte en la tabla mensaje.
- 5.- El actor selecciona un hilo para ver el detalle de los mensajes que envió dentro de él.
- 6.- El sistema muestra la interfaz P12.2 «Ver Conversación» con el contenido completo del hilo, incluyendo los mensajes enviados por el actor.

**Curso alternativo de eventos:**

- ¿El hilo seleccionado ya fue respondido? En caso negativo, el sistema señala que el hilo continúa a la espera de respuesta.

**Requerimientos (RF12.2):**

- RF12.2.1: Este caso de uso permite consultar los mensajes que el actor ha enviado dentro del sistema.
- RF12.2.2: El sistema muestra los mensajes enviados por el actor.
- RF12.2.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF12.2.4: La interfaz debe mostrar los mensajes enviados en una lista ordenada por fecha, indicando el destinatario y el estado (respondido o pendiente).

## RF12.3 Consultar mensajes recibidos

**Actores:** Usuario académico, Bibliotecario

**Tipo:** Primario

**Referencias:** RF12.3.1; RF12.3.2; RF12.3.3; RF12.3.4

**Propósito:** Permitir consultar los mensajes recibidos dentro del sistema.

**Resumen:** Este caso de uso permite consultar los mensajes recibidos dentro del sistema. El sistema muestra los mensajes recibidos por el actor.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Usuario académico o Bibliotecario.

**Postcondiciones:** El sistema muestra los mensajes recibidos por el actor.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P12.1 «Bandeja de Mensajes», donde el sistema filtra los hilos según su rol: el Usuario académico ve los hilos donde recibió una respuesta, el Bibliotecario ve todos los hilos con consultas pendientes o respondidas.
- 2.- El sistema carga la lista de hilos con los mensajes recibidos por el actor. Los datos se obtienen de las tablas mensaje y usuario.
- 3.- El actor revisa la lista ordenada por fecha.
- 4.- El sistema muestra el remitente y el estado de cada hilo: Pendiente o Respondido.
- 5.- El actor abre un hilo para ver su contenido.
- 6.- El sistema muestra la interfaz P12.2 «Ver Conversación» con el contenido completo de los mensajes recibidos dentro del hilo, conservando su estado (Pendiente o Respondido).

**Curso alternativo de eventos:**

- ¿El hilo seleccionado ya fue respondido? En caso negativo, el sistema señala que el hilo continúa a la espera de respuesta.

**Requerimientos (RF12.3):**

- RF12.3.1: Este caso de uso permite consultar los mensajes recibidos dentro del sistema.
- RF12.3.2: El sistema muestra los mensajes recibidos por el actor.
- RF12.3.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF12.3.4: La interfaz debe mostrar los mensajes recibidos en una lista ordenada por fecha, indicando el remitente y el estado (Pendiente o Respondido).

## RF12.4 Responder consulta del usuario

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF12.4.1; RF12.4.2; RF12.4.3

**Propósito:** Permitir que el Bibliotecario responda una consulta enviada por un Usuario académico dentro del sistema.

**Resumen:** Este caso de uso permite que el Bibliotecario responda una consulta enviada por un Usuario académico dentro del sistema. El sistema debe garantizar que la respuesta queda registrada en el sistema y disponible para ser consultada por el Usuario académico correspondiente.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema debe garantizar que la respuesta queda registrada en el sistema y disponible para ser consultada por el Usuario académico correspondiente.

**Curso normal de eventos:**

- 1.- El Bibliotecario abre la consulta recibida desde la interfaz P12.1 «Bandeja de Mensajes» y accede al hilo correspondiente en la interfaz P12.2 «Ver Conversación».
- 2.- El sistema muestra el contenido de la consulta original junto al área de respuesta. Los datos se obtienen de la tabla mensaje.
- 3.- El Bibliotecario redacta la respuesta a la consulta.
- 4.- El sistema toma el texto ingresado como respuesta.
- 5.- El Bibliotecario hace clic en el botón «Enviar respuesta».
- 6.- El sistema registra la respuesta asociada a la consulta original. La respuesta se crea en la tabla mensaje, vinculada a la consulta original, cuyo estado pasa a «Respondido» en la misma tabla. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿La respuesta contiene contenido para ser enviado? En caso negativo, el sistema impide el envío e informa que la respuesta no puede enviarse vacía.

**Requerimientos (RF12.4):**

- RF12.4.1: Este caso de uso permite que el Bibliotecario responda una consulta enviada por un Usuario académico dentro del sistema.
- RF12.4.2: El sistema debe garantizar que la respuesta queda registrada en el sistema y disponible para ser consultada por el Usuario académico correspondiente.
- [Interfaz] RF12.4.3: La interfaz debe incluir un área de texto para redactar la respuesta, junto al contenido de la consulta original, y un botón «Enviar respuesta» para enviarla.
