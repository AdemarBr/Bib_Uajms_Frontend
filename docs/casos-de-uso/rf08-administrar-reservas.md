# RF8 — Administrar reservas de libros

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/reservas`.

## RF8 Administrar Reservas de Libros (caso de uso padre)

**Actores:** Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF8.1; RF8.2; RF8.3; RF8.4; RF8.5; RF8.6; RF8.7; RF8.8

**Propósito:** Administrar de forma integral la funcionalidad "Administrar Reservas de Libros" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite consultar reservas registradas; consultar reservas por biblioteca; confirmar reserva; rechazar reserva; cancelar reserva administrativa; actualizar estado de reserva; consultar historial de reservas; atender reserva confirmada.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con alguno de los siguientes roles habilitados: Administrador de biblioteca, Bibliotecario.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Administrar Reservas de Libros" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde el menú lateral del sistema, la opción «Reservas», que lo lleva a la interfaz P8.1, P8.2 según el caso de uso hijo que corresponda.
- 2.- El sistema despliega la interfaz correspondiente (P8.1, P8.2) con las opciones específicas de «Reservas».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en las tablas reserva e historial_estado_reserva.

## RF8.1 Consultar reservas registradas

**Actores:** Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF8.1.1; RF8.1.2; RF8.1.3; RF8.1.4; RF8.1.5

**Propósito:** Permitir visualizar las reservas de libros registradas en el sistema, mostrando información general como usuario solicitante, libro reservado, fecha, biblioteca, estado y demás datos relevantes.

**Resumen:** Este caso de uso permite visualizar las reservas de libros registradas en el sistema, mostrando información general como usuario solicitante, libro reservado, fecha, biblioteca, estado y demás datos relevantes. El sistema muestra las reservas registradas.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra las reservas registradas.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P8.1 de administración de reservas.
- 2.- El sistema carga la tabla con las reservas registradas. Los datos se obtienen de las tablas reserva, usuario, ejemplar, libro y biblioteca.
- 3.- El actor revisa la información de cada reserva.
- 4.- El sistema muestra el listado de reservas registradas con las columnas de usuario, libro, fecha, biblioteca, estado y acciones.
- 5.- El actor aplica filtros o escribe en la barra de búsqueda y hace clic en el botón «Buscar» para localizar una reserva específica.
- 6.- El sistema muestra las reservas que coinciden con los filtros o el término buscado.

**Curso alternativo de eventos:**

- ¿Existen reservas registradas en el sistema? En caso negativo, el sistema presenta la tabla vacía y señala que no hay solicitudes por atender.

**Requerimientos (RF8.1):**

- RF8.1.1: Este caso de uso permite visualizar las reservas de libros registradas en el sistema, mostrando información general como usuario solicitante, libro reservado, fecha, biblioteca, estado y demás datos relevantes.
- RF8.1.2: El sistema muestra las reservas registradas.
- RF8.1.3: El sistema debe garantizar que no se modifica información, salvo que posteriormente el actor seleccione una acción administrativa sobre una reserva.
- [Interfaz] RF8.1.4: La interfaz debe mostrar las reservas en una tabla con columnas de usuario, libro, fecha, biblioteca, estado y acciones.
- [Interfaz] RF8.1.5: La interfaz debe incluir filtros (por estado, biblioteca y fecha) y una barra de búsqueda con un botón «Buscar» para localizar una reserva específica.

## RF8.2 Consultar reservas por biblioteca

**Actores:** Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF8.2.1; RF8.2.2; RF8.2.3

**Propósito:** Permitir consultar las reservas asociadas a una biblioteca física determinada, de acuerdo con el ámbito de responsabilidad del actor.

**Resumen:** Este caso de uso permite consultar las reservas asociadas a una biblioteca física determinada, de acuerdo con el ámbito de responsabilidad del actor. El sistema muestra las reservas correspondientes a la biblioteca seleccionada o asignada.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra las reservas correspondientes a la biblioteca seleccionada o asignada.

**Curso normal de eventos:**

- 1.- El actor despliega el filtro de biblioteca en la interfaz P8.1.
- 2.- El sistema presenta las bibliotecas disponibles en un campo de selección.
- 3.- El actor selecciona la biblioteca cuyas reservas desea consultar.
- 4.- El sistema filtra la tabla mostrando las reservas de la biblioteca seleccionada. Los datos se obtienen de las tablas reserva, ejemplar y biblioteca.

**Curso alternativo de eventos:**

- ¿El actor tiene una biblioteca responsable asignada? En caso negativo, el sistema permite seleccionar cualquier biblioteca del desplegable para consultar sus reservas.

**Requerimientos (RF8.2):**

- RF8.2.1: Este caso de uso permite consultar las reservas asociadas a una biblioteca física determinada, de acuerdo con el ámbito de responsabilidad del actor.
- RF8.2.2: El sistema muestra las reservas correspondientes a la biblioteca seleccionada o asignada.
- [Interfaz] RF8.2.3: La interfaz debe presentar un campo de selección (desplegable) con las bibliotecas disponibles, mostrando las reservas correspondientes en una tabla.

## RF8.3 Confirmar reserva

**Actores:** Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF8.3.1; RF8.3.2; RF8.3.3; RF8.3.4

**Propósito:** Permitir confirmar una reserva registrada cuando el material bibliográfico cumple las condiciones necesarias para ser apartado o atendido por la biblioteca.

**Resumen:** Este caso de uso permite confirmar una reserva registrada cuando el material bibliográfico cumple las condiciones necesarias para ser apartado o atendido por la biblioteca. El sistema debe garantizar que la reserva queda confirmada en el sistema y el estado del material queda actualizado según las reglas definidas para reservas.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema debe garantizar que la reserva queda confirmada en el sistema y el estado del material queda actualizado según las reglas definidas para reservas.

**Curso normal de eventos:**

- 1.- El actor ubica en la tabla de la interfaz P8.1 la reserva pendiente que desea confirmar.
- 2.- El sistema muestra el botón «Confirmar» junto a cada reserva pendiente.
- 3.- El actor hace clic en el botón «Confirmar».
- 4.- El sistema verifica que el ejemplar solicitado continúe disponible. La verificación se realiza en la tabla ejemplar.
- 5.- El actor confirma la operación con el botón «Confirmar» de la ventana de confirmación.
- 6.- El sistema procesa la confirmación de la reserva. El cambio de estado se guarda en la tabla reserva y se anota en la tabla historial_estado_reserva, y el estado del material se actualiza en la tabla ejemplar. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿La reserva seleccionada continúa en estado pendiente? En caso negativo, el sistema informa que la reserva ya fue atendida y no permite confirmarla nuevamente.  ¿El ejemplar continúa disponible para atender la reserva? En caso negativo, el sistema impide la confirmación e informa que el ejemplar ya no se encuentra disponible.

**Requerimientos (RF8.3):**

- RF8.3.1: Este caso de uso permite confirmar una reserva registrada cuando el material bibliográfico cumple las condiciones necesarias para ser apartado o atendido por la biblioteca.
- RF8.3.2: El sistema debe garantizar que la reserva queda confirmada en el sistema y el estado del material queda actualizado según las reglas definidas para reservas.
- [Interfaz] RF8.3.3: La interfaz debe mostrar, junto a cada reserva pendiente, un botón «Confirmar» para confirmarla.
- [Interfaz] RF8.3.4: Al accionar «Confirmar», la interfaz debe abrir una ventana de confirmación con los botones «Cancelar» y «Confirmar»; «Cancelar» cierra la ventana sin aplicar cambios.

## RF8.4 Rechazar reserva

**Actores:** Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF8.4.1; RF8.4.2; RF8.4.3; RF8.4.4; RF8.4.5

**Propósito:** Permitir rechazar una reserva cuando no cumple las condiciones establecidas por la biblioteca o cuando no es posible atender la solicitud del usuario.

**Resumen:** Este caso de uso permite rechazar una reserva cuando no cumple las condiciones establecidas por la biblioteca o cuando no es posible atender la solicitud del usuario. El sistema debe garantizar que la reserva queda rechazada en el sistema y no continúa como solicitud activa.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema debe garantizar que la reserva queda rechazada en el sistema y no continúa como solicitud activa.

**Curso normal de eventos:**

- 1.- El actor ubica en la tabla de la interfaz P8.1 la reserva pendiente que desea rechazar.
- 2.- El sistema muestra el botón «Rechazar» junto a cada reserva pendiente.
- 3.- El actor hace clic en el botón «Rechazar».
- 4.- El sistema abre una ventana con un campo de texto opcional para registrar el motivo del rechazo y los botones «Cancelar» y «Rechazar».
- 5.- El actor registra el motivo cuando corresponde y confirma el rechazo con el botón «Rechazar» de la ventana; el botón «Cancelar» cierra la ventana sin rechazar la reserva.
- 6.- El sistema procesa el rechazo de la reserva y actualiza su estado. El cambio de estado y el motivo se guardan en la tabla reserva, y el cambio se anota en la tabla historial_estado_reserva. La acción queda registrada en la tabla bitacora.
- 7.- El sistema rechaza la reserva y notifica al Usuario académico incluyendo el motivo registrado.

**Curso alternativo de eventos:**

- ¿La reserva seleccionada continúa en estado pendiente? En caso negativo, el sistema informa que la reserva ya fue atendida y no admite un rechazo posterior.  ¿Se registró un motivo para el rechazo? En caso negativo, el sistema rechaza la reserva y notifica al Usuario académico sin detallar un motivo.

**Requerimientos (RF8.4):**

- RF8.4.1: Este caso de uso permite rechazar una reserva cuando no cumple las condiciones establecidas por la biblioteca o cuando no es posible atender la solicitud del usuario.
- RF8.4.2: El sistema debe garantizar que la reserva queda rechazada en el sistema y no continúa como solicitud activa.
- [Interfaz] RF8.4.3: La interfaz debe incluir un campo de texto opcional para registrar el motivo del rechazo.
- [Interfaz] RF8.4.4: La interfaz debe solicitar confirmación antes de aplicar el rechazo.
- [Interfaz] RF8.4.5: La interfaz debe mostrar, junto a cada reserva pendiente, un botón «Rechazar» que abre una ventana con el campo «Motivo (opcional)» y los botones «Cancelar» y «Rechazar».

## RF8.5 Cancelar reserva administrativa

**Actores:** Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF8.5.1; RF8.5.2; RF8.5.3; RF8.5.4; RF8.5.5

**Propósito:** Permitir cancelar una reserva desde la administración del sistema cuando exista una razón operativa o institucional que justifique la cancelación.

**Resumen:** Este caso de uso permite cancelar una reserva desde la administración del sistema cuando exista una razón operativa o institucional que justifique la cancelación. El sistema debe garantizar que la reserva queda cancelada administrativamente en el sistema y deja de estar activa para su atención.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema debe garantizar que la reserva queda cancelada administrativamente en el sistema y deja de estar activa para su atención.

**Curso normal de eventos:**

- 1.- El actor ubica la reserva activa dentro de la tabla de la interfaz P8.1.
- 2.- El sistema muestra la acción «Cancelar» junto a la reserva.
- 3.- El actor hace clic en la acción «Cancelar».
- 4.- El sistema abre una ventana con un campo de texto opcional para registrar el motivo de la cancelación y los botones «Volver» y «Cancelar reserva».
- 5.- El actor registra el motivo cuando corresponde y confirma la cancelación con el botón «Cancelar reserva» de la ventana; el botón «Volver» cierra la ventana sin cancelar la reserva.
- 6.- El sistema procesa la cancelación administrativa de la reserva. El cambio de estado y el motivo se guardan en la tabla reserva, y el cambio se anota en la tabla historial_estado_reserva. La acción queda registrada en la tabla bitacora.
- 7.- El sistema cancela la reserva, la retira de las solicitudes activas y notifica al usuario indicando el motivo.

**Curso alternativo de eventos:**

- ¿La reserva se encuentra activa al momento de la cancelación? En caso negativo, el sistema informa que la reserva ya no está activa y no aplica la cancelación.  ¿Se registró un motivo para la cancelación administrativa? En caso negativo, el sistema cancela la reserva y libera el material sin detallar un motivo.

**Requerimientos (RF8.5):**

- RF8.5.1: Este caso de uso permite cancelar una reserva desde la administración del sistema cuando exista una razón operativa o institucional que justifique la cancelación.
- RF8.5.2: El sistema debe garantizar que la reserva queda cancelada administrativamente en el sistema y deja de estar activa para su atención.
- [Interfaz] RF8.5.3: La interfaz debe incluir un campo de texto opcional para registrar el motivo de la cancelación administrativa.
- [Interfaz] RF8.5.4: La interfaz debe solicitar confirmación antes de aplicar la cancelación.
- [Interfaz] RF8.5.5: La interfaz debe mostrar, junto a cada reserva confirmada, la acción «Cancelar», que abre una ventana con el campo «Motivo (opcional)» y los botones «Volver» y «Cancelar reserva».

## RF8.6 Actualizar estado de reserva

**Actores:** Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF8.6.1; RF8.6.2; RF8.6.3; RF8.6.4; RF8.6.5; RF8.6.6

**Propósito:** Permitir modificar el estado de una reserva de libro de acuerdo con su avance dentro del proceso de atención bibliotecaria.

**Resumen:** Este caso de uso permite modificar el estado de una reserva de libro de acuerdo con su avance dentro del proceso de atención bibliotecaria. El sistema debe garantizar que el estado de la reserva queda actualizado en el sistema.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema debe garantizar que el estado de la reserva queda actualizado en el sistema.

**Curso normal de eventos:**

- 1.- El actor despliega el campo de estado en la fila de la reserva dentro de la interfaz P8.1.
- 2.- El sistema muestra los estados permitidos para esa reserva.
- 3.- El actor selecciona el nuevo estado de la reserva.
- 4.- El sistema toma el estado seleccionado para su validación.
- 5.- El sistema actualiza el estado de la reserva y lo refleja en el listado. El cambio de estado se guarda en la tabla reserva y se anota en la tabla historial_estado_reserva. La acción queda registrada en la tabla bitacora.
- 6.- El sistema propaga el nuevo estado de la reserva al listado y al historial.

**Curso alternativo de eventos:**

- ¿La transición entre el estado actual y el nuevo estado está permitida? En caso negativo, el sistema impide el cambio e informa que la transición de estado solicitada no está permitida.

**Requerimientos (RF8.6):**

- RF8.6.1: Este caso de uso permite modificar el estado de una reserva de libro de acuerdo con su avance dentro del proceso de atención bibliotecaria. RF8.6.5: El estado de la reserva (Pendiente, Confirmada, Rechazada o Cancelada) es independiente del indicador de «atendida»; una reserva queda marcada como atendida únicamente cuando se registra el préstamo vinculado (ver CU8.8 «Atender reserva confirmada»), sin que esto modifique su estado.
- RF8.6.2: El sistema debe garantizar que el estado de la reserva queda actualizado en el sistema.
- [Interfaz] RF8.6.3: La interfaz debe presentar un campo de selección (desplegable) con los estados permitidos para la reserva.
- [Interfaz] RF8.6.4: La interfaz debe mostrar el nuevo estado junto a la reserva una vez confirmado el cambio.
- [Interfaz] RF8.6.6: El campo de selección de estado se ubica en la columna «Estado» de cada fila de la tabla de la interfaz P8.1.

## RF8.7 Consultar historial de reservas

**Actores:** Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF8.7.1; RF8.7.2; RF8.7.3; RF8.7.4

**Propósito:** Permitir revisar el historial de reservas registradas en el sistema, incluyendo reservas anteriores, cambios de estado, usuarios solicitantes y material reservado.

**Resumen:** Este caso de uso permite revisar el historial de reservas registradas en el sistema, incluyendo reservas anteriores, cambios de estado, usuarios solicitantes y material reservado. El sistema muestra el historial de reservas.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra el historial de reservas.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P8.2 de historial de reservas.
- 2.- El sistema carga la tabla de solo lectura con el historial de reservas. Los datos se obtienen de las tablas reserva, historial_estado_reserva, usuario, ejemplar, libro y biblioteca.
- 3.- El actor revisa la información histórica de cada reserva.
- 4.- El sistema muestra las columnas de usuario, libro, fecha, estado y biblioteca.

**Curso alternativo de eventos:**

- ¿Existen reservas registradas en el historial? En caso negativo, el sistema presenta el historial vacío para el periodo consultado.

**Requerimientos (RF8.7):**

- RF8.7.1: Este caso de uso permite revisar el historial de reservas registradas en el sistema, incluyendo reservas anteriores, cambios de estado, usuarios solicitantes y material reservado.
- RF8.7.2: El sistema muestra el historial de reservas.
- RF8.7.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF8.7.4: La interfaz debe mostrar el historial en una tabla con columnas de usuario, libro, fecha, estado y biblioteca.

## RF8.8 Atender reserva confirmada

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF8.8.1; RF8.8.2; RF8.8.3; RF8.8.4; RF8.8.5

**Propósito:** Permitir atender una reserva confirmada cuando el usuario se presenta en persona, eligiendo si el préstamo será en sala o a domicilio y derivando al registro correspondiente con los datos precargados.

**Resumen:** Este caso de uso permite al Bibliotecario localizar la reserva confirmada de un usuario que se presenta en la biblioteca, elegir si el préstamo será en sala o a domicilio y confirmar la operación con el botón «Prestar». El sistema deriva al registro del préstamo correspondiente con los datos precargados y marca la reserva como atendida una vez registrado el préstamo.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario y la reserva se encuentra en estado Confirmada.

**Postcondiciones:** La reserva queda marcada como atendida una vez registrado el préstamo vinculado, de forma independiente a su estado de Confirmada, y el sistema deriva al registro del préstamo en sala o a domicilio con los datos precargados.

**Curso normal de eventos:**

- 1.- El Bibliotecario busca la reserva confirmada correspondiente al usuario que se presenta, utilizando los filtros o el campo «Buscar» de la interfaz P8.1.
- 2.- El sistema muestra la reserva confirmada en la tabla, con el selector de modalidad (sala o domicilio) en su fila.
- 3.- El Bibliotecario ubica la reserva confirmada en la tabla.
- 4.- El sistema verifica que la reserva continúe vigente. La verificación se realiza en la tabla reserva.
- 5.- El Bibliotecario elige en el selector de la fila si el préstamo será en sala o a domicilio, según lo señale el usuario presente.
- 6.- El sistema habilita el botón «Prestar».
- 7.- El Bibliotecario hace clic en el botón «Prestar».
- 8.- El sistema abre la ventana «Confirmar préstamo» con los botones «Cancelar» y «Confirmar».
- 9.- El Bibliotecario hace clic en el botón «Confirmar» de la ventana.
- 10.- El sistema deriva al registro del préstamo en sala (P9.1) o a domicilio (P9.3), según corresponda, con los datos del usuario y del ejemplar precargados desde la reserva.
- 11.- El sistema marca la reserva como atendida, de forma independiente a su estado (Confirmada). La marca se guarda en la tabla reserva. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿La reserva continúa vigente? En caso negativo, el sistema informa que la reserva ya no se encuentra vigente e impide continuar.  ¿El Bibliotecario confirma el préstamo en la ventana? En caso negativo, el sistema cierra la ventana y cancela la operación sin modificar la reserva.

**Requerimientos (RF8.8):**

- RF8.8.1: Este caso de uso permite atender una reserva confirmada cuando el usuario se presenta en persona, indicando si el préstamo será en sala o a domicilio y derivando al registro correspondiente.
- RF8.8.2: El sistema debe garantizar que la reserva queda marcada como atendida una vez registrado el préstamo vinculado, de forma independiente a su estado de Confirmada.
- RF8.8.3: El sistema debe impedir continuar si la reserva ya no se encuentra vigente (por ejemplo, si fue cancelada).
- [Interfaz] RF8.8.4: La interfaz debe mostrar, junto a la reserva confirmada localizada mediante los filtros o la búsqueda de la interfaz P8.1, un control para elegir entre préstamo en sala o a domicilio, y un botón «Prestar» que deriva al registro del préstamo con los datos precargados desde la reserva.
- [Interfaz] RF8.8.5: Al accionar «Prestar», la interfaz debe abrir la ventana «Confirmar préstamo» con los botones «Cancelar» y «Confirmar»; «Cancelar» cierra la ventana y detiene toda la operación.
