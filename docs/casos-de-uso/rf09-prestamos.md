# RF9 — Gestión de préstamos

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/prestamos`.

## RF9 Gestión de Préstamos (caso de uso padre)

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.1; RF9.2; RF9.3

**Propósito:** Administrar de forma integral la funcionalidad "Gestión de Prestamos" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite registrar préstamo en sala; registrar préstamo a domicilio; registrar devolución de libro.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con alguno de los siguientes roles habilitados: Bibliotecario.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Gestión de Prestamos" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde el menú lateral del sistema, la opción «Préstamos», que lo lleva a la interfaz P9.1 a P9.6 según el caso de uso hijo que corresponda.
- 2.- El sistema despliega la interfaz correspondiente (P9.1 a P9.6) con las opciones específicas de «Préstamos».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en las tablas prestamo, ampliacion_prestamo y devolucion.

## RF9.1 Registrar préstamo en sala

**Actores:** Bibliotecario, Servicio de validación institucional

**Tipo:** Primario

**Referencias:** RF9.1.1; RF9.1.6; RF9.1.7; RF9.1.9; RF9.1.10; RF9.1.11; RF9.1.12

**Propósito:** Permitir al Bibliotecario registrar el préstamo de un ejemplar bibliográfico que será utilizado únicamente dentro de los ambientes de la biblioteca, sin autorización para retiro a domicilio.

**Resumen:** Este caso de uso permite al Bibliotecario registrar el préstamo de un ejemplar bibliográfico que será utilizado únicamente dentro de los ambientes de la biblioteca, sin autorización para retiro a domicilio.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** Se completa la operación "Registrar préstamo en sala" y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El Bibliotecario accede a la interfaz P9.1 de registro de préstamo en sala.
- 2.- El sistema presenta el formulario de préstamo para uso dentro de los ambientes de la biblioteca.
- 3.- El Bibliotecario ingresa el R.U del usuario solicitante en el campo «R.U».
- 4.- El sistema envía el RU al Servicio de validación institucional y recupera los datos del usuario a partir de la respuesta recibida. Si el usuario aún no existe en la tabla usuario, el sistema registra en ella sus datos mínimos antes de continuar con el préstamo: el nombre, el RU, la carrera, el nombre de usuario (que es el propio RU, con el que los usuarios académicos inician sesión) y el rol, asignado con el mismo criterio de RF1.3 (Estudiante o Docente cuando el servicio lo informa; en caso contrario, Usuario académico).
- 5.- El Bibliotecario selecciona el ejemplar solicitado de la lista de disponibles.
- 6.- El sistema presenta los ejemplares disponibles del libro requerido. Los datos se obtienen de las tablas ejemplar y libro.
- 7.- El Bibliotecario revisa el indicador de disponibilidad del ejemplar.
- 8.- El sistema informa el estado actual del ejemplar antes de continuar.
- 9.- El Bibliotecario hace clic en el botón «Registrar préstamo en sala» para confirmar el registro.
- 10.- El sistema registra el préstamo en sala, actualiza automáticamente la disponibilidad del ejemplar y lo incorpora al listado de préstamos vigentes, restringido al uso dentro de la biblioteca, sin autorización de retiro a domicilio. El préstamo se crea en la tabla prestamo, vinculado a las tablas usuario y ejemplar, y el nuevo estado del ejemplar se guarda en la tabla ejemplar. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿El usuario está habilitado para solicitar un préstamo en sala? En caso negativo, el sistema informa que el usuario no está habilitado e interrumpe el registro.  ¿El ejemplar seleccionado está disponible? En caso negativo, el sistema informa que el ejemplar no está disponible e interrumpe el registro.  ¿El préstamo proviene de una reserva confirmada? En caso afirmativo, el sistema presenta los datos del usuario y del ejemplar precargados desde la reserva; el usuario ya se encuentra validado.

**Requerimientos (RF9.1):**

- RF9.1.1: Este caso de uso permite al Bibliotecario registrar el préstamo de un ejemplar bibliográfico que será utilizado únicamente dentro de los ambientes de la biblioteca, sin autorización para retiro a domicilio. RF9.1.6: Si el préstamo proviene de una reserva confirmada (ver CU8.8 «Atender reserva confirmada»), el sistema omite la verificación de identidad por RU —el usuario ya fue validado al reservar— y presenta directamente los datos del usuario y del ejemplar precargados, permitiendo modificar el ejemplar desde esta misma pantalla si es necesario. RF9.1.7: Cuando el préstamo no proviene de una reserva, la verificación de identidad del usuario se realiza mediante el caso de uso incluido «Validar usuario institucional» (ver RF1.2), que en este contexto envía únicamente el RU al Servicio de validación institucional.
- [Interfaz] RF9.1.9: La interfaz debe incluir el campo «R.U» para ingresar el Registro Universitario del usuario solicitante y mostrar, como «Usuario verificado», su nombre y carrera una vez validado.
- [Interfaz] RF9.1.10: La interfaz debe incluir el campo «Buscar libro» (por título, autor o ISBN) y la lista «Ejemplares disponibles del libro seleccionado», que muestra de cada ejemplar su código, el autor del libro y su ubicación física (estante y clasificación Dewey), e indica cuál ejemplar está «Seleccionado» y cuáles están «Disponible».
- [Interfaz] RF9.1.11: La interfaz debe mostrar un texto de ayuda que indica que el material solo puede usarse dentro de la biblioteca y que, si el usuario cuenta con una reserva confirmada, el ejemplar correspondiente aparece preseleccionado.
- [Interfaz] RF9.1.12: La interfaz debe incluir un botón «Registrar préstamo en sala» que confirma y registra el préstamo con los datos ingresados.

## RF9.1.2 Seleccionar ejemplar para préstamo en sala

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.1.2.1; RF9.1.2.2; RF9.1.2.3

**Propósito:** Permitir buscar el libro solicitado por el usuario y seleccionar el ejemplar específico que será entregado para consulta dentro de la biblioteca..

**Resumen:** Este caso de uso permite buscar el libro solicitado por título, autor o ISBN y seleccionar, de la lista de ejemplares disponibles, el ejemplar específico que será entregado al usuario para consulta dentro de la biblioteca. El sistema debe garantizar que el ejemplar queda seleccionado para continuar con el registro del préstamo en sala.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema debe garantizar que el ejemplar queda seleccionado para continuar con el registro del préstamo en sala.

**Curso normal de eventos:**

- 1.- El Bibliotecario busca el libro solicitado por título, autor o ISBN en el campo de búsqueda de la interfaz P9.1.
- 2.- El sistema muestra los libros coincidentes con el criterio de búsqueda.
- 3.- El Bibliotecario selecciona el libro solicitado por el usuario.
- 4.- El sistema presenta la lista de ejemplares disponibles del libro seleccionado, con el código, el autor y la ubicación física (estante y clasificación Dewey) de cada ejemplar. Los datos se obtienen de las tablas ejemplar y libro.
- 5.- El Bibliotecario selecciona un ejemplar específico de la lista.
- 6.- El sistema deja el ejemplar seleccionado para continuar con el registro del préstamo en sala.

**Curso alternativo de eventos:**

- ¿El criterio de búsqueda coincide con algún libro registrado en el catálogo? En caso negativo, el sistema informa que no se encontraron resultados y solicita reintentar la búsqueda.
- ¿Existe al menos un ejemplar disponible para su uso dentro de la sala? En caso negativo, el sistema informa que no existen ejemplares disponibles del libro e impide continuar con el préstamo.

**Requerimientos (RF9.1.2):**

- RF9.1.2.1: Este caso de uso permite seleccionar el ejemplar específico que será entregado al usuario para consulta dentro de la biblioteca.
- RF9.1.2.2: El sistema debe garantizar que el ejemplar queda seleccionado para continuar con el registro del préstamo en sala.
- [Interfaz] RF9.1.2.3: La interfaz debe presentar los ejemplares disponibles del libro solicitado en una lista que muestra, de cada ejemplar, su código, el autor del libro y su ubicación física (estante y clasificación Dewey), permitiendo seleccionar uno específico.

## RF9.1.3 Consultar disponibilidad del ejemplar

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.1.3.1; RF9.1.3.2; RF9.1.3.3; RF9.1.3.4

**Propósito:** Permitir verificar si el ejemplar solicitado se encuentra disponible para préstamo en sala.

**Resumen:** Este caso de uso permite verificar si el ejemplar solicitado se encuentra disponible para préstamo en sala. El sistema muestra el estado de disponibilidad del ejemplar.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema muestra el estado de disponibilidad del ejemplar.

**Curso normal de eventos:**

- 1.- El Bibliotecario ubica el indicador de disponibilidad junto al ejemplar seleccionado en la interfaz P9.1.
- 2.- El sistema muestra el indicador visual con el estado del ejemplar.
- 3.- El Bibliotecario revisa el estado del ejemplar antes de continuar.
- 4.- El sistema informa el estado de disponibilidad vigente en ese momento. El estado se obtiene de la tabla ejemplar.

**Curso alternativo de eventos:**

- ¿El ejemplar se encuentra disponible para su uso en sala? En caso negativo, el sistema muestra el estado que restringe al ejemplar e impide continuar con el registro del préstamo.

**Requerimientos (RF9.1.3):**

- RF9.1.3.1: Este caso de uso permite verificar si el ejemplar solicitado se encuentra disponible para préstamo en sala.
- RF9.1.3.2: El sistema muestra el estado de disponibilidad del ejemplar.
- RF9.1.3.3: Si se encuentra disponible para sala, el Bibliotecario puede continuar con el registro del préstamo.
- [Interfaz] RF9.1.3.4: La interfaz debe mostrar el estado de disponibilidad del ejemplar mediante un indicador visual antes de continuar con el registro del préstamo.

## RF9.1.4 Actualizar disponibilidad del ejemplar

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.1.4.1; RF9.1.4.2; RF9.1.4.3

**Propósito:** Permitir actualizar el estado de disponibilidad del ejemplar una vez registrado el préstamo en sala.

**Resumen:** Este caso de uso permite actualizar el estado de disponibilidad del ejemplar una vez registrado el préstamo en sala. El sistema debe garantizar que la disponibilidad del ejemplar queda actualizada en el sistema, evitando que sea considerado disponible para otro préstamo simultáneo mientras se encuentre en uso.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema debe garantizar que la disponibilidad del ejemplar queda actualizada en el sistema, evitando que sea considerado disponible para otro préstamo simultáneo mientras se encuentre en uso.

**Curso normal de eventos:**

- 1.- El Bibliotecario confirma el registro del préstamo en sala.
- 2.- El sistema identifica el ejemplar involucrado en la operación.
- 3.- El sistema marca el ejemplar como no disponible para otro préstamo simultáneo. El cambio se guarda en la tabla ejemplar.
- 4.- El sistema muestra el nuevo estado de disponibilidad inmediatamente después de registrar el préstamo.

**Curso alternativo de eventos:**

- No aplica un curso alternativo propio: la operación se ejecuta de forma automática y sin puntos de decisión.

**Requerimientos (RF9.1.4):**

- RF9.1.4.1: Este caso de uso permite actualizar el estado de disponibilidad del ejemplar una vez registrado el préstamo en sala.
- RF9.1.4.2: El sistema debe garantizar que la disponibilidad del ejemplar queda actualizada en el sistema, evitando que sea considerado disponible para otro préstamo simultáneo mientras se encuentre en uso.
- [Interfaz] RF9.1.4.3: La interfaz debe mostrar el nuevo estado de disponibilidad del ejemplar inmediatamente después de registrar el préstamo en sala.

## RF9.1.5 Consultar préstamos en sala vigentes

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.1.5.1; RF9.1.5.2; RF9.1.5.3; RF9.1.5.4

**Propósito:** Permitir consultar los préstamos en sala que se encuentran activos en el sistema.

**Resumen:** Este caso de uso permite consultar los préstamos en sala que se encuentran activos en el sistema. El sistema muestra los préstamos en sala activos.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema muestra los préstamos en sala activos.

**Curso normal de eventos:**

- 1.- El Bibliotecario accede a la interfaz P9.2 de préstamos en sala vigentes.
- 2.- El sistema carga la tabla con los préstamos en sala que se encuentran activos. Los datos se obtienen de las tablas prestamo, usuario y ejemplar.
- 3.- El Bibliotecario revisa la información de cada préstamo activo.
- 4.- El sistema muestra las columnas de usuario, ejemplar y fecha de inicio del préstamo.

**Curso alternativo de eventos:**

- ¿Existen préstamos en sala activos en este momento? En caso negativo, el sistema presenta la tabla vacía y señala que no hay material en uso dentro de la sala.

**Requerimientos (RF9.1.5):**

- RF9.1.5.1: Este caso de uso permite consultar los préstamos en sala que se encuentran activos en el sistema.
- RF9.1.5.2: El sistema muestra los préstamos en sala activos.
- RF9.1.5.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF9.1.5.4: La interfaz debe mostrar los préstamos activos en una tabla con columnas de usuario, ejemplar, fecha de inicio y estado (activo o inactivo).

## RF9.1.8 Cancelar préstamo en sala

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.1.8.1; RF9.1.8.2; RF9.1.8.3; RF9.1.8.4

**Propósito:** Permitir que el Bibliotecario cancele el registro de un préstamo en sala antes de que sea confirmado.

**Resumen:** Este caso de uso permite que el Bibliotecario cancele el registro de un préstamo en sala antes de que sea confirmado. El sistema debe garantizar que el préstamo no queda registrado y que el ejemplar permanece disponible.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema debe garantizar que el préstamo no queda registrado y que el ejemplar permanece disponible.

**Curso normal de eventos:**

- 1.- El Bibliotecario hace clic en el botón «Cancelar» de la interfaz P9.1 durante el registro del préstamo en sala.
- 2.- El sistema solicita confirmación antes de cancelar la operación, mediante una ventana con los botones «Volver» y «Cancelar préstamo».
- 3.- El Bibliotecario confirma la cancelación con el botón «Cancelar préstamo».
- 4.- El sistema cancela la operación y no registra el préstamo. No se crea ningún registro en la tabla prestamo.

**Curso alternativo de eventos:**

- ¿El Bibliotecario confirma la cancelación con el botón «Cancelar préstamo» de la ventana? En caso negativo, el sistema cierra la ventana con el botón «Volver», mantiene los datos ingresados y permite continuar con el registro del préstamo en sala.

**Requerimientos (RF9.1.8):**

- RF9.1.8.1: Este caso de uso permite que el Bibliotecario cancele el registro de un préstamo en sala antes de que sea confirmado, siempre que aún no haya sido registrado.
- RF9.1.8.2: El sistema debe garantizar que el préstamo no queda registrado cuando se cancela la operación, y que el ejemplar permanece disponible.
- [Interfaz] RF9.1.8.3: La interfaz P9.1 debe mostrar, junto al botón «Registrar préstamo en sala», un botón «Cancelar».
- [Interfaz] RF9.1.8.4: La interfaz debe solicitar confirmación antes de cancelar el préstamo, mediante una ventana con los botones «Volver» y «Cancelar préstamo».

## RF9.2 Registrar préstamo a domicilio

**Actores:** Bibliotecario, Servicio de validación institucional

**Tipo:** Primario

**Referencias:** RF9.2.1; RF9.2.9; RF9.2.10; RF9.2.11; RF9.2.13; RF9.2.14; RF9.2.15; RF9.2.16

**Propósito:** Permitir al Bibliotecario registrar el préstamo presencial de un ejemplar bibliográfico que puede ser retirado fuera de la biblioteca por un tiempo determinado, de acuerdo con las reglas establecidas por la Biblioteca Central.

**Resumen:** Este caso de uso permite al Bibliotecario registrar el préstamo presencial de un ejemplar bibliográfico que puede ser retirado fuera de la biblioteca por un tiempo determinado, de acuerdo con las reglas establecidas por la Biblioteca Central.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** Se completa la operación "Registrar préstamo a domicilio" y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El Bibliotecario accede a la interfaz P9.3 de registro de préstamo a domicilio.
- 2.- El sistema presenta el formulario de préstamo con autorización de retiro fuera de la biblioteca.
- 3.- El Bibliotecario ingresa el R.U del usuario solicitante en el campo «R.U».
- 4.- El sistema envía el RU al Servicio de validación institucional y recupera los datos del usuario a partir de la respuesta recibida. Si el usuario aún no existe en la tabla usuario, el sistema registra en ella sus datos mínimos antes de continuar con el préstamo: el nombre, el RU, la carrera, el nombre de usuario (que es el propio RU, con el que los usuarios académicos inician sesión) y el rol, asignado con el mismo criterio de RF1.3 (Estudiante o Docente cuando el servicio lo informa; en caso contrario, Usuario académico).
- 5.- El Bibliotecario selecciona el ejemplar solicitado de la lista de disponibles.
- 6.- El sistema presenta los ejemplares disponibles del libro requerido. Los datos se obtienen de las tablas ejemplar y libro.
- 7.- El Bibliotecario revisa la validación de salida a domicilio y el indicador de disponibilidad.
- 8.- El sistema informa si el ejemplar está habilitado para retiro y cuál es su estado actual.
- 9.- El Bibliotecario revisa o ajusta la fecha de devolución calculada por el sistema.
- 10.- El sistema muestra la fecha calculada según el plazo definido, permitiendo ajustarla dentro de los límites permitidos.
- 11.- El Bibliotecario registra en el campo «Celular de contacto» el número de quien recibe el préstamo.
- 12.- El sistema guarda el celular junto con el registro del préstamo, independientemente del dato de contacto que tenga el usuario en su perfil.
- 13.- El Bibliotecario hace clic en el botón «Confirmar préstamo a domicilio» para confirmar el registro.
- 14.- El sistema registra el préstamo a domicilio con su fecha de devolución, actualiza la disponibilidad del ejemplar y lo incorpora al listado de préstamos vigentes, con retiro autorizado de acuerdo con las reglas establecidas por la Biblioteca Central. El préstamo se crea en la tabla prestamo, con su fecha límite de devolución y el celular de contacto, vinculado a las tablas usuario y ejemplar, y el nuevo estado del ejemplar se guarda en la tabla ejemplar. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿El usuario está habilitado para retirar material a domicilio? En caso negativo, el sistema informa la restricción del usuario e interrumpe el registro.  ¿El ejemplar está autorizado para salir a domicilio? En caso negativo, el sistema informa que el ejemplar es de uso exclusivo en sala e interrumpe el registro.  ¿La fecha de devolución está dentro de los límites permitidos? En caso negativo, el sistema restablece la fecha calculada y solicita un nuevo ajuste.  ¿El préstamo proviene de una reserva confirmada? En caso afirmativo, el sistema presenta los datos del usuario y del ejemplar precargados desde la reserva; el usuario ya se encuentra validado.

**Requerimientos (RF9.2):**

- RF9.2.1: Este caso de uso permite al Bibliotecario registrar el préstamo presencial de un ejemplar bibliográfico que puede ser retirado fuera de la biblioteca por un tiempo determinado, de acuerdo con las reglas establecidas por la Biblioteca Central. RF9.2.9: La interfaz debe incluir un campo para ingresar el número de celular de contacto de quien recibe el préstamo a domicilio; este dato se guarda únicamente como parte del registro del préstamo, y no como dato del perfil del usuario. RF9.2.10: Si el préstamo proviene de una reserva confirmada (ver CU8.8 «Atender reserva confirmada»), el sistema omite la verificación de identidad por RU —el usuario ya fue validado al reservar— y presenta directamente los datos del usuario y del ejemplar precargados, permitiendo modificar el ejemplar desde esta misma pantalla si es necesario. RF9.2.11: Cuando el préstamo no proviene de una reserva, la verificación de identidad del usuario se realiza mediante el caso de uso incluido «Validar usuario institucional» (ver RF1.2), que en este contexto envía únicamente el RU al Servicio de validación institucional.
- [Interfaz] RF9.2.13: La interfaz debe incluir el campo «R.U» para ingresar el Registro Universitario del usuario solicitante y mostrar su nombre con la marca «verificado» una vez validado.
- [Interfaz] RF9.2.14: La interfaz debe incluir el campo «Buscar libro» (por título, autor o ISBN) y la lista «Ejemplares disponibles del libro seleccionado», que muestra de cada ejemplar su código, el autor del libro y su ubicación física (estante y clasificación Dewey), con el indicador «Habilitado para préstamo a domicilio» cuando el ejemplar puede salir de la biblioteca.
- [Interfaz] RF9.2.15: La interfaz debe mostrar el campo «Fecha de devolución», calculado automáticamente y ajustable dentro de los límites permitidos, junto con un botón «Confirmar fecha».
- [Interfaz] RF9.2.16: La interfaz debe incluir un botón «Confirmar préstamo a domicilio» que registra el préstamo con los datos ingresados, incluido el «Celular de contacto».

## RF9.2.2 Seleccionar ejemplar para préstamo a domicilio

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.2.2.1; RF9.2.2.2; RF9.2.2.3

**Propósito:** Permitir seleccionar el ejemplar físico específico que será entregado al usuario para préstamo a domicilio.

**Resumen:** Este caso de uso permite buscar el libro solicitado por título, autor o ISBN y seleccionar, de la lista de ejemplares habilitados para retiro, el ejemplar físico específico que será entregado al usuario para préstamo a domicilio. El sistema debe garantizar que el ejemplar queda seleccionado para continuar con el registro del préstamo a domicilio.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema debe garantizar que el ejemplar queda seleccionado para continuar con el registro del préstamo a domicilio.

**Curso normal de eventos:**

- 1.- El Bibliotecario busca el libro solicitado por título, autor o ISBN en el campo de búsqueda de la interfaz P9.3.
- 2.- El sistema muestra los libros coincidentes con el criterio de búsqueda.
- 3.- El Bibliotecario selecciona el libro solicitado por el usuario.
- 4.- El sistema presenta la lista de ejemplares del libro habilitados para retiro, con el código, el autor y la ubicación física (estante y clasificación Dewey) de cada ejemplar. Los datos se obtienen de las tablas ejemplar y libro.
- 5.- El Bibliotecario selecciona un ejemplar específico de la lista.
- 6.- El sistema deja el ejemplar seleccionado para continuar con el registro del préstamo a domicilio.

**Curso alternativo de eventos:**

- ¿El criterio de búsqueda coincide con algún libro registrado en el catálogo? En caso negativo, el sistema informa que no se encontraron resultados y solicita reintentar la búsqueda.
- ¿Existe al menos un ejemplar disponible del libro solicitado? En caso negativo, el sistema informa que no existen ejemplares disponibles del libro e impide continuar con el préstamo.

**Requerimientos (RF9.2.2):**

- RF9.2.2.1: Este caso de uso permite seleccionar el ejemplar físico específico que será entregado al usuario para préstamo a domicilio.
- RF9.2.2.2: El sistema debe garantizar que el ejemplar queda seleccionado para continuar con el registro del préstamo a domicilio.
- [Interfaz] RF9.2.2.3: La interfaz debe presentar los ejemplares disponibles del libro solicitado en una lista que muestra, de cada ejemplar, su código, el autor del libro y su ubicación física (estante y clasificación Dewey), permitiendo seleccionar uno específico.

## RF9.2.3 Validar si el ejemplar puede salir a domicilio

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.2.3.1; RF9.2.3.2; RF9.2.3.3; RF9.2.3.4

**Propósito:** Permitir verificar si el ejemplar solicitado está permitido para préstamo a domicilio, considerando que algunos materiales o colecciones solo pueden consultarse en sala.

**Resumen:** Este caso de uso permite verificar si el ejemplar solicitado está permitido para préstamo a domicilio, considerando que algunos materiales o colecciones solo pueden consultarse en sala. El sistema confirma si el ejemplar puede salir a domicilio.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema confirma si el ejemplar puede salir a domicilio.

**Curso normal de eventos:**

- 1.- El Bibliotecario confirma el ejemplar seleccionado para el préstamo.
- 2.- El sistema consulta las condiciones de circulación registradas para ese ejemplar. La consulta se realiza en la tabla ejemplar.
- 3.- El Bibliotecario revisa el mensaje indicador mostrado por el sistema.
- 4.- El sistema informa si el ejemplar se encuentra habilitado para préstamo a domicilio.

**Curso alternativo de eventos:**

- ¿El ejemplar tiene condiciones de circulación registradas? En caso negativo, el sistema aplica la restricción por defecto y lo trata como material de uso exclusivo en sala.  ¿El ejemplar está autorizado para ser retirado fuera de la biblioteca? En caso negativo, el sistema informa que el ejemplar es de uso exclusivo en sala e impide continuar con el préstamo a domicilio.

**Requerimientos (RF9.2.3):**

- RF9.2.3.1: Este caso de uso permite verificar si el ejemplar solicitado está permitido para préstamo a domicilio, considerando que algunos materiales o colecciones solo pueden consultarse en sala.
- RF9.2.3.2: El sistema confirma si el ejemplar puede salir a domicilio.
- RF9.2.3.3: Si el ejemplar no está habilitado para préstamo a domicilio, el Bibliotecario no continúa con el registro de este tipo de préstamo.
- [Interfaz] RF9.2.3.4: La interfaz debe mostrar un mensaje indicando si el ejemplar está habilitado para préstamo a domicilio antes de continuar con el registro.

## RF9.2.4 Consultar disponibilidad del ejemplar

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.2.4.1; RF9.2.4.2; RF9.2.4.3; RF9.2.4.4

**Propósito:** Permitir verificar si el ejemplar solicitado se encuentra disponible para ser prestado a domicilio.

**Resumen:** Este caso de uso permite verificar si el ejemplar solicitado se encuentra disponible para ser prestado a domicilio. El sistema muestra el estado de disponibilidad del ejemplar.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema muestra el estado de disponibilidad del ejemplar.

**Curso normal de eventos:**

- 1.- El Bibliotecario ubica el indicador de disponibilidad junto al ejemplar seleccionado en la interfaz P9.3.
- 2.- El sistema muestra el indicador visual con el estado del ejemplar.
- 3.- El Bibliotecario revisa el estado del ejemplar antes de continuar.
- 4.- El sistema informa el estado de disponibilidad vigente en ese momento. El estado se obtiene de la tabla ejemplar.

**Curso alternativo de eventos:**

- ¿El ejemplar se encuentra disponible para ser prestado a domicilio? En caso negativo, el sistema muestra el estado que restringe al ejemplar e impide continuar con el registro del préstamo.

**Requerimientos (RF9.2.4):**

- RF9.2.4.1: Este caso de uso permite verificar si el ejemplar solicitado se encuentra disponible para ser prestado a domicilio.
- RF9.2.4.2: El sistema muestra el estado de disponibilidad del ejemplar.
- RF9.2.4.3: Si el ejemplar se encuentra disponible, el Bibliotecario puede continuar con la validación para préstamo a domicilio.
- [Interfaz] RF9.2.4.4: La interfaz debe mostrar el estado de disponibilidad del ejemplar mediante un indicador visual antes de continuar con el registro del préstamo.

## RF9.2.5 Asignar fecha de devolución

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.2.5.1; RF9.2.5.2; RF9.2.5.3; RF9.2.5.4

**Propósito:** Permitir establecer la fecha límite en la que el usuario debe devolver el ejemplar prestado a domicilio.

**Resumen:** Este caso de uso permite establecer la fecha límite en la que el usuario debe devolver el ejemplar prestado a domicilio. El sistema debe garantizar que la fecha de devolución queda asociada al registro del préstamo a domicilio.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema debe garantizar que la fecha de devolución queda asociada al registro del préstamo a domicilio.

**Curso normal de eventos:**

- 1.- El Bibliotecario revisa la fecha de devolución calculada automáticamente por el sistema en la interfaz P9.3.
- 2.- El sistema muestra la fecha correspondiente al plazo definido por la Biblioteca Central.
- 3.- El Bibliotecario acepta la fecha resultante.
- 4.- El sistema permite modificar la fecha únicamente dentro de los límites permitidos.
- 5.- El Bibliotecario confirma la fecha de devolución con el botón «Confirmar fecha».
- 6.- El sistema valida que la fecha confirmada respete el plazo máximo establecido.
- 7.- El sistema asocia la fecha de devolución al registro del préstamo a domicilio. La fecha se guarda en la tabla prestamo.

**Curso alternativo de eventos:**

- ¿El actor ajusta la fecha propuesta por el sistema? En caso negativo, el sistema conserva la fecha calculada automáticamente y la asocia al préstamo.  ¿La fecha ajustada se encuentra dentro de los límites permitidos? En caso negativo, el sistema rechaza el ajuste realizado y restablece la fecha de devolución calculada automáticamente.

**Requerimientos (RF9.2.5):**

- RF9.2.5.1: Este caso de uso permite establecer la fecha límite en la que el usuario debe devolver el ejemplar prestado a domicilio.
- RF9.2.5.2: El sistema debe garantizar que la fecha de devolución queda asociada al registro del préstamo a domicilio.
- [Interfaz] RF9.2.5.3: La interfaz debe mostrar la fecha de devolución calculada automáticamente, con la opción de ajustarla dentro de los límites permitidos.
- [Interfaz] RF9.2.5.4: La interfaz debe incluir un botón «Confirmar fecha» para confirmar la fecha asignada.

## RF9.2.6 Actualizar disponibilidad del ejemplar

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.2.6.1; RF9.2.6.2; RF9.2.6.3

**Propósito:** Permitir actualizar el estado de disponibilidad del ejemplar una vez registrado el préstamo a domicilio.

**Resumen:** Este caso de uso permite actualizar el estado de disponibilidad del ejemplar una vez registrado el préstamo a domicilio. El sistema debe garantizar que la disponibilidad del ejemplar queda actualizada en el sistema, evitando que sea considerado disponible para otro préstamo mientras se encuentre prestado.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema debe garantizar que la disponibilidad del ejemplar queda actualizada en el sistema, evitando que sea considerado disponible para otro préstamo mientras se encuentre prestado.

**Curso normal de eventos:**

- 1.- El Bibliotecario confirma el registro del préstamo a domicilio.
- 2.- El sistema identifica el ejemplar involucrado en la operación.
- 3.- El sistema marca el ejemplar como prestado hasta la fecha de devolución. El cambio se guarda en la tabla ejemplar.
- 4.- El sistema muestra el nuevo estado de disponibilidad inmediatamente después de registrar el préstamo.

**Curso alternativo de eventos:**

- No aplica un curso alternativo propio: la operación se ejecuta de forma automática y sin puntos de decisión.

**Requerimientos (RF9.2.6):**

- RF9.2.6.1: Este caso de uso permite actualizar el estado de disponibilidad del ejemplar una vez registrado el préstamo a domicilio.
- RF9.2.6.2: El sistema debe garantizar que la disponibilidad del ejemplar queda actualizada en el sistema, evitando que sea considerado disponible para otro préstamo mientras se encuentre prestado.
- [Interfaz] RF9.2.6.3: La interfaz debe mostrar el nuevo estado de disponibilidad del ejemplar inmediatamente después de registrar el préstamo a domicilio.

## RF9.2.7 Consultar préstamos a domicilio vigentes

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.2.7.1; RF9.2.7.2; RF9.2.7.3; RF9.2.7.4

**Propósito:** Permitir consultar los préstamos a domicilio que se encuentran activos en el sistema.

**Resumen:** Este caso de uso permite consultar los préstamos a domicilio que se encuentran activos en el sistema. El sistema muestra los préstamos a domicilio activos.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema muestra los préstamos a domicilio activos.

**Curso normal de eventos:**

- 1.- El Bibliotecario accede a la interfaz P9.4 de préstamos a domicilio vigentes.
- 2.- El sistema carga la tabla con los préstamos a domicilio que se encuentran activos. Los datos se obtienen de las tablas prestamo, usuario y ejemplar.
- 3.- El Bibliotecario revisa la información de cada préstamo activo.
- 4.- El sistema muestra las columnas de usuario, ejemplar, fecha de préstamo y fecha límite de devolución.

**Curso alternativo de eventos:**

- ¿Existen préstamos a domicilio activos en este momento? En caso negativo, el sistema presenta la tabla vacía y señala que no hay material fuera de la biblioteca.

**Requerimientos (RF9.2.7):**

- RF9.2.7.1: Este caso de uso permite consultar los préstamos a domicilio que se encuentran activos en el sistema.
- RF9.2.7.2: El sistema muestra los préstamos a domicilio activos.
- RF9.2.7.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF9.2.7.4: La interfaz debe mostrar los préstamos activos en una tabla con columnas de usuario, ejemplar, fecha de préstamo y fecha límite de devolución.

## RF9.2.8 Ampliar plazo de préstamo a domicilio

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.2.8.1; RF9.2.8.2; RF9.2.8.3; RF9.2.8.4; RF9.2.8.5

**Propósito:** Permitir al Bibliotecario extender la fecha límite de devolución de un préstamo a domicilio ya registrado, sin límite en la cantidad de veces que se puede solicitar.

**Resumen:** Este caso de uso permite al Bibliotecario ampliar el plazo de un préstamo a domicilio vigente o vencido. El sistema registra la nueva fecha límite junto con la fecha anterior y con la cantidad total de ampliaciones del préstamo, sin sobrescribir el historial.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.
- El préstamo a domicilio debe encontrarse registrado en el sistema.

**Postcondiciones:** La fecha límite del préstamo queda actualizada y la ampliación queda registrada junto con la fecha anterior, sin límite en la cantidad de ampliaciones permitidas.

**Curso normal de eventos:**

- 1.- El Bibliotecario accede a la interfaz P9.4 de préstamos a domicilio vigentes.
- 2.- El sistema presenta el listado de préstamos activos, señalando cuáles se encuentran vencidos. Los datos se obtienen de las tablas prestamo, usuario y ejemplar.
- 3.- El Bibliotecario identifica el préstamo que requiere ampliación y hace clic en la acción «Ampliar plazo».
- 4.- El sistema abre una ventana con la fecha límite vigente y la cantidad de ampliaciones ya registradas para ese préstamo, con los botones «Cancelar» y «Confirmar ampliación».
- 5.- El Bibliotecario confirma que desea ampliar el plazo.
- 6.- El sistema calcula la nueva fecha límite y la presenta con el botón «Confirmar ampliación».
- 7.- El Bibliotecario hace clic en el botón «Confirmar ampliación» para confirmar la nueva fecha límite.
- 8.- El sistema registra la nueva fecha límite junto con la fecha anterior y muestra la cantidad de ampliaciones registradas del préstamo. La ampliación se crea en la tabla ampliacion_prestamo, y la nueva fecha límite se guarda en la tabla prestamo. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿El préstamo se encuentra vencido al momento de solicitar la ampliación? En caso afirmativo, el sistema permite continuar con la ampliación de igual manera, quedando la decisión a criterio del Bibliotecario o personal autorizado según su rol. ¿Existe un límite de ampliaciones para el préstamo? El sistema no establece un límite; el Bibliotecario decide si corresponde seguir ampliando el plazo en función del historial mostrado.

**Requerimientos (RF9.2.8):**

- RF9.2.8.1: Este caso de uso permite al Bibliotecario ampliar el plazo de un préstamo a domicilio vigente o vencido, registrando una nueva fecha límite de devolución. / RF9.2.8.2: El sistema debe registrar cada ampliación junto con la fecha anterior, sin límite en la cantidad de ampliaciones por préstamo. / RF9.2.8.3: El sistema debe permitir la ampliación incluso si el préstamo ya está vencido, quedando la decisión a criterio del Bibliotecario o personal autorizado según su rol. /  / Interfaces: / RF9.2.8.4: La interfaz debe mostrar, junto al préstamo, un indicador visual cuando se encuentre vencido y la cantidad de ampliaciones ya realizadas, y debe presentar la acción «Ampliar plazo» en la columna «Acciones» del listado de préstamos a domicilio vigentes. RF9.2.8.5: Al seleccionar «Ampliar plazo», la interfaz debe abrir una ventana que muestre la fecha límite vigente, la cantidad de ampliaciones registradas y la nueva fecha límite propuesta, con los botones «Cancelar» y «Confirmar ampliación».

## RF9.2.12 Cancelar préstamo a domicilio

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.2.12.1; RF9.2.12.2; RF9.2.12.3; RF9.2.12.4

**Propósito:** Permitir que el Bibliotecario cancele el registro de un préstamo a domicilio antes de que sea confirmado.

**Resumen:** Este caso de uso permite que el Bibliotecario cancele el registro de un préstamo a domicilio antes de que sea confirmado. El sistema debe garantizar que el préstamo no queda registrado y que el ejemplar permanece disponible.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema debe garantizar que el préstamo no queda registrado y que el ejemplar permanece disponible.

**Curso normal de eventos:**

- 1.- El Bibliotecario hace clic en el botón «Cancelar» de la interfaz P9.3 durante el registro del préstamo a domicilio.
- 2.- El sistema solicita confirmación antes de cancelar la operación, mediante una ventana con los botones «Volver» y «Cancelar préstamo».
- 3.- El Bibliotecario confirma la cancelación con el botón «Cancelar préstamo».
- 4.- El sistema cancela la operación y no registra el préstamo. No se crea ningún registro en la tabla prestamo.

**Curso alternativo de eventos:**

- ¿El Bibliotecario confirma la cancelación con el botón «Cancelar préstamo» de la ventana? En caso negativo, el sistema cierra la ventana con el botón «Volver», mantiene los datos ingresados y permite continuar con el registro del préstamo a domicilio.

**Requerimientos (RF9.2.12):**

- RF9.2.12.1: Este caso de uso permite que el Bibliotecario cancele el registro de un préstamo a domicilio antes de que sea confirmado, siempre que aún no haya sido registrado.
- RF9.2.12.2: El sistema debe garantizar que el préstamo no queda registrado cuando se cancela la operación, y que el ejemplar permanece disponible.
- [Interfaz] RF9.2.12.3: La interfaz P9.3 debe mostrar, junto al botón «Confirmar préstamo a domicilio», un botón «Cancelar».
- [Interfaz] RF9.2.12.4: La interfaz debe solicitar confirmación antes de cancelar el préstamo, mediante una ventana con los botones «Volver» y «Cancelar préstamo».

## RF9.3 Registrar devolución de libro

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.3.1; RF9.3.6; RF9.3.7; RF9.3.8; RF9.3.9

**Propósito:** Permitir al Bibliotecario registrar la devolución de un ejemplar bibliográfico que fue prestado previamente, verificando el préstamo vigente, registrando el estado del ejemplar devuelto que el Bibliotecario revisa manualmente, la disponibilidad del material y el posible retraso en la devolución.

**Resumen:** Este caso de uso permite al Bibliotecario registrar la devolución de un ejemplar bibliográfico que fue prestado previamente, verificando el préstamo vigente, registrando el estado del ejemplar devuelto que el Bibliotecario revisa manualmente, la disponibilidad del material y el posible retraso en la devolución. El sistema solo registra el estado que el Bibliotecario indica tras la revisión física. La devolución realizada antes de la fecha de vencimiento (devolución anticipada) se admite y se trata como devolución dentro del plazo, sin indicador de retraso.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** Se completa la operación "Registrar devolución de libro" y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El Bibliotecario accede a la interfaz P9.5 de registro de devolución.
- 2.- El sistema presenta el formulario de devolución de material bibliográfico.
- 3.- El Bibliotecario busca el préstamo vigente por código de ejemplar, usuario o número de préstamo en el campo «Buscar préstamo vigente».
- 4.- El sistema recupera el préstamo vigente correspondiente al criterio ingresado. El préstamo se obtiene de la tabla prestamo.
- 5.- El Bibliotecario revisa físicamente el ejemplar devuelto y elige su estado entre «Buen estado», «Con observaciones» y «Dañado».
- 6.- El sistema registra el estado indicado por el Bibliotecario y habilita el campo «Observaciones» cuando corresponde.
- 7.- El Bibliotecario registra en el campo «Observaciones» el detalle de la condición del material cuando el estado no es «Buen estado».
- 8.- El sistema verifica que el detalle de las observaciones haya sido registrado cuando el estado no es «Buen estado».
- 9.- El Bibliotecario revisa el control de retraso de la devolución.
- 10.- El sistema señala visualmente si la devolución se realiza fuera del plazo establecido.
- 11.- El Bibliotecario hace clic en el botón «Registrar devolución» para confirmar el registro.
- 12.- El sistema registra la devolución, cierra el préstamo vigente y actualiza la disponibilidad del ejemplar según su estado: lo deja disponible si fue devuelto en «Buen estado» y no disponible si se registró «Con observaciones» o «Dañado». La devolución se crea en la tabla devolucion, el cierre del préstamo se guarda en la tabla prestamo y el nuevo estado del ejemplar se guarda en la tabla ejemplar. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿Existe un préstamo vigente que coincida con el criterio? En caso negativo, el sistema informa que no se encontró un préstamo vigente con ese criterio.  ¿El ejemplar fue devuelto en buen estado y dentro del plazo? En caso negativo, el sistema deja constancia del estado observado y de los días de retraso.  ¿Se registró el detalle en el campo «Observaciones» cuando el estado no es «Buen estado»? En caso negativo, el sistema señala que el campo «Observaciones» es obligatorio y no registra la devolución.  ¿El estado elegido es «Buen estado»? En caso afirmativo, el sistema no solicita el detalle en «Observaciones» y el Bibliotecario continúa con la revisión del control de retraso.

**Requerimientos (RF9.3):**

- RF9.3.1: Este caso de uso permite al Bibliotecario registrar la devolución de un ejemplar bibliográfico que fue prestado previamente, verificando el préstamo vigente, registrando el estado del ejemplar devuelto que el Bibliotecario revisa manualmente, la disponibilidad del material y el posible retraso en la devolución. El sistema solo registra el estado que el Bibliotecario indica tras la revisión física. La devolución realizada antes de la fecha de vencimiento (devolución anticipada) se admite y se trata como devolución dentro del plazo, sin indicador de retraso. La devolución se registra tanto para los préstamos en sala como para los préstamos a domicilio y, al registrarla, el préstamo pasa a estado inactivo; en los préstamos en sala no existe fecha de vencimiento ni control de retraso.
- [Interfaz] RF9.3.6: La interfaz debe incluir el campo «Buscar préstamo vigente» (código de ejemplar, usuario o número de préstamo) y mostrar el préstamo encontrado con el ejemplar, el usuario y la fecha de vencimiento.
- [Interfaz] RF9.3.7: La interfaz debe incluir un botón «Registrar devolución» que confirma la devolución y cierra el préstamo vigente.
- [Interfaz] RF9.3.8: La interfaz debe incluir las opciones «Buen estado», «Con observaciones» y «Dañado» para que el Bibliotecario registre el estado del ejemplar devuelto tras revisarlo físicamente.
- [Interfaz] RF9.3.9: La interfaz debe incluir el campo «Observaciones» para detallar la condición del material; es obligatorio cuando el estado no es «Buen estado» y la devolución no se registra sin ese detalle.

## RF9.3.2 Buscar préstamo vigente

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.3.2.1; RF9.3.2.2; RF9.3.2.3; RF9.3.2.4

**Propósito:** Permitir localizar el préstamo activo asociado al ejemplar que el usuario está devolviendo.

**Resumen:** Este caso de uso permite localizar el préstamo activo asociado al ejemplar que el usuario está devolviendo. El sistema muestra el préstamo vigente asociado al ejemplar o usuario correspondiente, permitiendo continuar con la devolución.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema muestra el préstamo vigente asociado al ejemplar o usuario correspondiente, permitiendo continuar con la devolución.

**Curso normal de eventos:**

- 1.- El Bibliotecario ubica el campo de búsqueda dentro de la interfaz P9.5.
- 2.- El sistema presenta el campo de búsqueda por código de ejemplar, usuario o número de préstamo.
- 3.- El Bibliotecario ingresa el criterio de búsqueda correspondiente.
- 4.- El sistema recorre los préstamos vigentes comparándolos con el criterio ingresado. La búsqueda se realiza sobre las tablas prestamo, usuario y ejemplar.
- 5.- El Bibliotecario selecciona el préstamo encontrado.
- 6.- El sistema muestra los datos del préstamo seleccionado para continuar con la devolución.

**Curso alternativo de eventos:**

- ¿Existe un préstamo vigente que coincida con el criterio ingresado? En caso negativo, el sistema informa que no se encontró un préstamo vigente con ese criterio y permite modificar la búsqueda.

**Requerimientos (RF9.3.2):**

- RF9.3.2.1: Este caso de uso permite localizar el préstamo activo asociado al ejemplar que el usuario está devolviendo.
- RF9.3.2.2: El sistema muestra el préstamo vigente asociado al ejemplar o usuario correspondiente, permitiendo continuar con la devolución.
- [Interfaz] RF9.3.2.3: La interfaz debe incluir un campo de búsqueda por código de ejemplar, usuario o número de préstamo.
- [Interfaz] RF9.3.2.4: La interfaz debe mostrar los préstamos coincidentes en una lista con los datos del usuario y el material prestado.

## RF9.3.3 Controlar retraso en devolución

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.3.3.1; RF9.3.3.2; RF9.3.3.3; RF9.3.3.4

**Propósito:** Permitir verificar si la devolución del ejemplar se realizó dentro del plazo establecido o si existe retraso.

**Resumen:** Este caso de uso permite verificar si la devolución del ejemplar se realizó dentro del plazo establecido o si existe retraso. El sistema informa si existe retraso en la devolución.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema informa si existe retraso en la devolución.

**Curso normal de eventos:**

- 1.- El Bibliotecario confirma el préstamo que será devuelto.
- 2.- El sistema compara la fecha actual con la fecha límite de devolución del préstamo. La fecha límite se obtiene de la tabla prestamo.
- 3.- El Bibliotecario revisa el indicador de retraso mostrado por el sistema.
- 4.- El sistema muestra una etiqueta de color cuando la devolución se realiza fuera del plazo establecido.

**Curso alternativo de eventos:**

- ¿La devolución se realiza fuera del plazo establecido? En caso negativo, el sistema no muestra indicador de retraso y registra la devolución como realizada dentro del plazo.

**Requerimientos (RF9.3.3):**

- RF9.3.3.1: Este caso de uso permite verificar si la devolución del ejemplar se realizó dentro del plazo establecido o si existe retraso.
- RF9.3.3.2: El sistema informa si existe retraso en la devolución.
- RF9.3.3.3: El sistema debe garantizar que no se contempla el cobro de multas dentro del alcance del sistema.
- [Interfaz] RF9.3.3.4: La interfaz debe mostrar un indicador visual (por ejemplo, una etiqueta de color) cuando la devolución se realiza fuera del plazo establecido.

## RF9.3.4 Actualizar disponibilidad del ejemplar

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.3.4.1; RF9.3.4.2; RF9.3.4.3; RF9.3.4.4

**Propósito:** Permitir actualizar la disponibilidad del ejemplar una vez registrada la devolución del libro.

**Resumen:** Este caso de uso permite actualizar la disponibilidad del ejemplar una vez registrada la devolución del libro. El sistema debe garantizar que la disponibilidad del ejemplar queda actualizada en el sistema.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** La disponibilidad del ejemplar queda actualizada en el sistema: disponible si el estado registrado es «Buen estado»; no disponible si es «Con observaciones» o «Dañado». Para volver a habilitar un ejemplar no disponible, el Administrador de biblioteca o el Catalogador cambia su estado a disponible mediante «Actualizar estado del ejemplar» (RF5.5) una vez revisado.

**Curso normal de eventos:**

- 1.- El Bibliotecario confirma el registro de la devolución.
- 2.- El sistema identifica el ejemplar devuelto en la operación.
- 3.- El sistema verifica el estado que el Bibliotecario registró para el ejemplar devuelto.
- 4.- Si el estado registrado es «Buen estado», el sistema libera el ejemplar, lo devuelve al estado disponible y lo deja habilitado para nuevas reservas y préstamos; si es «Con observaciones» o «Dañado», lo mantiene como no disponible. En ambos casos muestra el nuevo estado de disponibilidad inmediatamente después de registrar la devolución. El cambio se guarda en la tabla ejemplar.

**Curso alternativo de eventos:**

- ¿El estado registrado del ejemplar es «Buen estado»? En caso negativo, el sistema mantiene el ejemplar como no disponible para nuevas reservas y préstamos y muestra el nuevo estado de disponibilidad.

**Requerimientos (RF9.3.4):**

- RF9.3.4.1: Este caso de uso permite actualizar la disponibilidad del ejemplar una vez registrada la devolución del libro.
- RF9.3.4.2: El sistema debe garantizar que la disponibilidad del ejemplar queda actualizada en el sistema.
- RF9.3.4.3: El sistema debe dejar el ejemplar disponible para nuevas reservas y préstamos únicamente cuando el estado registrado en la devolución sea «Buen estado»; si es «Con observaciones» o «Dañado», debe mantenerlo como no disponible.
- [Interfaz] RF9.3.4.4: La interfaz debe mostrar el nuevo estado de disponibilidad del ejemplar inmediatamente después de registrar la devolución, sin requerir una acción adicional del Bibliotecario.

## RF9.3.5 Consultar historial de devoluciones

**Actores:** Bibliotecario

**Tipo:** Primario

**Referencias:** RF9.3.5.1; RF9.3.5.2; RF9.3.5.3; RF9.3.5.4; RF9.3.5.5

**Propósito:** Permitir consultar el historial de devoluciones registradas en el sistema.

**Resumen:** Este caso de uso permite consultar el historial de devoluciones registradas en el sistema. El sistema muestra el historial de devoluciones registradas.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Bibliotecario.

**Postcondiciones:** El sistema muestra el historial de devoluciones registradas.

**Curso normal de eventos:**

- 1.- El Bibliotecario accede a la interfaz P9.6 de historial de devoluciones.
- 2.- El sistema carga la tabla con las devoluciones registradas. Los datos se obtienen de las tablas devolucion, prestamo, usuario y ejemplar.
- 3.- El Bibliotecario usa el campo de búsqueda para filtrar el historial por usuario, ejemplar o rango de fechas.
- 4.- El sistema filtra el historial según el criterio ingresado.
- 5.- El Bibliotecario revisa la información histórica de cada devolución.
- 6.- El sistema muestra las columnas de usuario, ejemplar, fecha de préstamo, fecha de devolución, estado del ejemplar y observaciones.

**Curso alternativo de eventos:**

- ¿Existen devoluciones registradas en el historial? En caso negativo, el sistema presenta el historial vacío para el periodo consultado.

**Requerimientos (RF9.3.5):**

- RF9.3.5.1: Este caso de uso permite consultar el historial de devoluciones registradas en el sistema.
- RF9.3.5.2: El sistema muestra el historial de devoluciones registradas.
- RF9.3.5.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF9.3.5.4: La interfaz debe mostrar el historial en una tabla con columnas de usuario, ejemplar, fecha de préstamo, fecha de devolución, estado del ejemplar y observaciones.
- [Interfaz] RF9.3.5.5: La interfaz debe incluir un campo de búsqueda por usuario, ejemplar o rango de fechas.
