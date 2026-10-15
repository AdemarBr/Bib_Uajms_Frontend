# RF7 — Realizar reserva de libro

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/reservas`.

## RF7 Realizar Reserva de Libro (caso de uso padre)

**Actores:** Usuario académico

**Tipo:** Primario

**Referencias:** RF7.1; RF7.2; RF7.3; RF7.4; RF7.5

**Propósito:** Administrar de forma integral la funcionalidad "Realizar Reserva de Libro" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite registrar reserva de libro; seleccionar libro para reserva; consultar disponibilidad del ejemplar; cancelar reserva de libro; consultar estado de reserva.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con alguno de los siguientes roles habilitados: Usuario académico.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Realizar Reserva de Libro" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde el menú lateral del sistema, la opción «Mis reservas», que lo lleva a la interfaz P7.2; la interfaz P7.1 se abre al seleccionar un libro en el catálogo bibliográfico.
- 2.- El sistema despliega la interfaz P7.2 con las opciones específicas de «Mis reservas».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en las tablas reserva, ejemplar y libro.

## RF7.1 Registrar reserva de libro

**Actores:** Usuario académico

**Tipo:** Primario

**Referencias:** RF7.1.1; RF7.1.2; RF7.1.3; RF7.1.4; RF7.1.5

**Propósito:** Permitir registrar formalmente la reserva de un libro en el sistema, asociando la solicitud al usuario académico autenticado y al material bibliográfico seleccionado.

**Resumen:** Este caso de uso permite registrar formalmente la reserva de un libro en el sistema, asociando la solicitud al usuario académico autenticado y al material bibliográfico seleccionado. El sistema debe garantizar que la reserva queda registrada en el sistema y asociada al usuario académico correspondiente.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Usuario académico (docente o estudiante).

**Postcondiciones:** El sistema debe garantizar que la reserva queda registrada en el sistema y asociada al usuario académico correspondiente.

**Curso normal de eventos:**

- 1.- El usuario académico llega a la interfaz P7.1 tras seleccionar el libro en el catálogo.
- 2.- El sistema muestra los datos del libro y del ejemplar sobre el que se realizará la reserva.
- 3.- El usuario académico revisa el panel «Disponibilidad verificada» con el mensaje de verificación de disponibilidad.
- 4.- El sistema habilita el botón «Confirmar reserva» únicamente cuando la disponibilidad ya fue verificada.
- 5.- El usuario académico hace clic en el botón «Confirmar reserva».
- 6.- El sistema verifica nuevamente la disponibilidad antes de registrar la solicitud.
- 7.- El sistema registra la reserva asociada al usuario académico, muestra el mensaje de confirmación con sus datos y notifica automáticamente al Bibliotecario o Administrador de biblioteca. La reserva se crea en la tabla reserva, vinculada a las tablas usuario y ejemplar, y su estado inicial se anota en la tabla historial_estado_reserva.

**Curso alternativo de eventos:**

- ¿La disponibilidad del ejemplar fue verificada? En caso negativo, el sistema mantiene deshabilitado el botón «Confirmar reserva».  ¿El ejemplar continúa disponible al momento de confirmar? En caso negativo, el sistema informa que el ejemplar ya no se encuentra disponible y no registra la reserva.

**Requerimientos (RF7.1):**

- RF7.1.1: Este caso de uso permite registrar formalmente la reserva de un libro en el sistema, asociando la solicitud al usuario académico autenticado y al material bibliográfico seleccionado.
- RF7.1.2: El sistema debe garantizar que la reserva queda registrada en el sistema y asociada al usuario académico correspondiente.
- RF7.1.3: El sistema debe garantizar que el estado de la reserva queda disponible para consulta posterior.
- [Interfaz] RF7.1.4: La interfaz debe presentar el panel «Disponibilidad verificada» y un botón «Confirmar reserva» para registrar la reserva, habilitado únicamente cuando la disponibilidad fue verificada.
- [Interfaz] RF7.1.5: La interfaz debe mostrar un mensaje de confirmación con los datos de la reserva registrada (libro, fecha y estado).

## RF7.2 Seleccionar libro para reserva

**Actores:** Usuario académico

**Tipo:** Primario

**Referencias:** RF7.2.1; RF7.2.2; RF7.2.3; RF7.2.4

**Propósito:** Permitir que el Usuario académico seleccione el libro que desea reservar a partir de los resultados obtenidos en la consulta del catálogo bibliográfico.

**Resumen:** Este caso de uso permite que el Usuario académico seleccione el libro que desea reservar a partir de los resultados obtenidos en la consulta del catálogo bibliográfico. El sistema debe garantizar que el libro queda seleccionado temporalmente para continuar con la verificación de disponibilidad para reserva.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Usuario académico (docente o estudiante).

**Postcondiciones:** El sistema debe garantizar que el libro queda seleccionado temporalmente para continuar con la verificación de disponibilidad para reserva.

**Curso normal de eventos:**

- 1.- El usuario académico ubica el libro en los resultados del catálogo o en su vista de detalle.
- 2.- El sistema muestra el botón «Reservar» junto al libro.
- 3.- El usuario académico acciona el botón «Reservar».
- 4.- El sistema toma el libro seleccionado para continuar con el proceso de reserva.
- 5.- El sistema mantiene el botón habilitado, retiene el libro seleccionado y deriva a la verificación de disponibilidad para reserva.

**Curso alternativo de eventos:**

- ¿El libro cuenta con ejemplares disponibles para reserva? En caso negativo, el sistema muestra el botón deshabilitado y no permite continuar con la reserva del libro.

**Requerimientos (RF7.2):**

- RF7.2.1: Este caso de uso permite que el Usuario académico seleccione el libro que desea reservar a partir de los resultados obtenidos en la consulta del catálogo bibliográfico.
- RF7.2.2: El sistema debe garantizar que el libro queda seleccionado temporalmente para continuar con la verificación de disponibilidad para reserva.
- [Interfaz] RF7.2.3: La interfaz debe incluir un botón «Reservar» visible en los resultados del catálogo y en la vista de detalle del libro.
- [Interfaz] RF7.2.4: La interfaz debe deshabilitar el botón de reserva cuando el libro no tenga ejemplares disponibles.

## RF7.3 Consultar disponibilidad del ejemplar

**Actores:** Usuario académico

**Tipo:** Primario

**Referencias:** RF7.3.1; RF7.3.2; RF7.3.3; RF7.3.4

**Propósito:** Permitir verificar si el ejemplar del libro seleccionado se encuentra disponible para ser reservado, considerando su estado registrado en el sistema.

**Resumen:** Este caso de uso permite verificar si el ejemplar del libro seleccionado se encuentra disponible para ser reservado, considerando su estado registrado en el sistema. El sistema informa si el ejemplar puede ser reservado.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Usuario académico (docente o estudiante).

**Postcondiciones:** El sistema informa si el ejemplar puede ser reservado.

**Curso normal de eventos:**

- 1.- El usuario académico llega a la interfaz P7.1 con el libro previamente seleccionado.
- 2.- El sistema consulta el estado de los ejemplares asociados al libro. La consulta se realiza en la tabla ejemplar.
- 3.- El usuario académico revisa el mensaje de verificación mostrado.
- 4.- El sistema informa si el ejemplar puede ser reservado antes de habilitar la confirmación.

**Curso alternativo de eventos:**

- ¿El ejemplar puede ser reservado? En caso negativo, el sistema informa el motivo por el cual el ejemplar no puede reservarse y mantiene deshabilitada la confirmación.

**Requerimientos (RF7.3):**

- RF7.3.1: Este caso de uso permite verificar si el ejemplar del libro seleccionado se encuentra disponible para ser reservado, considerando su estado registrado en el sistema.
- RF7.3.2: El sistema informa si el ejemplar puede ser reservado.
- RF7.3.3: Si cumple las condiciones, permite continuar con el registro de la reserva mediante el caso de uso Registrar reserva de libro; si no cumple, informa al usuario que no es posible realizar la reserva.
- [Interfaz] RF7.3.4: La interfaz debe mostrar un mensaje indicando si el ejemplar está disponible para reserva antes de habilitar el botón de confirmación.

## RF7.4 Cancelar reserva de libro

**Actores:** Usuario académico

**Tipo:** Primario

**Referencias:** RF7.4.1; RF7.4.2; RF7.4.3; RF7.4.4

**Propósito:** Permitir que el Usuario académico cancele una reserva registrada previamente, siempre que el estado de la reserva permita dicha acción.

**Resumen:** Este caso de uso permite que el Usuario académico cancele una reserva registrada previamente, siempre que el estado de la reserva permita dicha acción. El sistema debe garantizar que la reserva queda cancelada en el sistema y el material queda disponible para nuevas solicitudes según las reglas definidas.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Usuario académico (docente o estudiante).

**Postcondiciones:** El sistema debe garantizar que la reserva queda cancelada en el sistema y el material queda disponible para nuevas solicitudes según las reglas definidas.

**Curso normal de eventos:**

- 1.- El usuario académico ubica la reserva dentro del listado «Mis reservas» de la interfaz P7.2.
- 2.- El sistema muestra la acción «Cancelar» junto a las reservas cuyo estado lo permite.
- 3.- El usuario académico hace clic en la acción «Cancelar».
- 4.- El sistema solicita la confirmación mediante una ventana con los botones «Volver» y «Cancelar reserva».
- 5.- El usuario académico hace clic en el botón «Cancelar reserva» de la ventana.
- 6.- El sistema cancela la reserva y deja el material disponible para nuevas solicitudes según las reglas definidas. El cambio de estado se guarda en la tabla reserva y se anota en la tabla historial_estado_reserva.
- 7.- El sistema libera el ejemplar para que otros usuarios puedan solicitarlo. La disponibilidad se actualiza en la tabla ejemplar.

**Curso alternativo de eventos:**

- ¿La reserva continúa en un estado que permite cancelarla? En caso negativo, el sistema informa que la reserva ya no puede cancelarse debido a su estado actual.  ¿El usuario académico hace clic en el botón «Cancelar reserva» de la ventana y no en «Volver»? En caso negativo, el sistema cierra la ventana y mantiene la reserva sin cambios.

**Requerimientos (RF7.4):**

- RF7.4.1: Este caso de uso permite que el Usuario académico cancele una reserva registrada previamente, siempre que el estado de la reserva permita dicha acción.
- RF7.4.2: El sistema debe garantizar que la reserva queda cancelada en el sistema y el material queda disponible para nuevas solicitudes según las reglas definidas.
- [Interfaz] RF7.4.3: La interfaz debe mostrar, junto a cada reserva del usuario, la acción «Cancelar» para cancelarla cuando su estado lo permita.
- [Interfaz] RF7.4.4: La interfaz debe solicitar confirmación antes de cancelar la reserva, mediante una ventana con los botones «Volver» y «Cancelar reserva».

## RF7.5 Consultar estado de reserva

**Actores:** Usuario académico

**Tipo:** Primario

**Referencias:** RF7.5.1; RF7.5.2; RF7.5.3; RF7.5.4

**Propósito:** Permitir que el Usuario académico consulte el estado de una reserva registrada previamente en el sistema.

**Resumen:** Este caso de uso permite que el Usuario académico consulte el estado de una reserva registrada previamente en el sistema. El sistema muestra el estado de la reserva consultada.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Usuario académico (docente o estudiante).

**Postcondiciones:** El sistema muestra el estado de la reserva consultada.

**Curso normal de eventos:**

- 1.- El usuario académico accede a la interfaz P7.2 de sus reservas.
- 2.- El sistema lista las reservas registradas por el usuario académico. Los datos se obtienen de las tablas reserva, ejemplar y libro.
- 3.- El usuario académico revisa el indicador de estado de cada reserva.
- 4.- El sistema muestra el estado mediante una etiqueta de color en cada fila del listado.

**Curso alternativo de eventos:**

- ¿La reserva ya fue atendida por el personal de la biblioteca? En caso negativo, el sistema muestra la reserva en estado pendiente, a la espera de ser atendida.

**Requerimientos (RF7.5):**

- RF7.5.1: Este caso de uso permite que el Usuario académico consulte el estado de una reserva registrada previamente en el sistema.
- RF7.5.2: El sistema muestra el estado de la reserva consultada.
- RF7.5.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF7.5.4: La interfaz debe mostrar el estado de la reserva mediante un indicador visual (por ejemplo, una etiqueta de color).
