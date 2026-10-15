# RF5 — Administrar ejemplares y ubicación física

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/ejemplares`.

## RF5 Administrar Ejemplares y Ubicación Física (caso de uso padre)

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF5.1; RF5.2; RF5.3; RF5.4; RF5.5; RF5.6; RF5.7

**Propósito:** Administrar de forma integral la funcionalidad "Administrar Ejemplares y Ubicación Física" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite registrar ejemplar de libro; asignar código de ejemplar; consultar ejemplares registrados; actualizar datos del ejemplar; actualizar estado del ejemplar; consultar disponibilidad del ejemplar; consultar ubicación del ejemplar.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con alguno de los siguientes roles habilitados: Administrador de biblioteca, Catalogador.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Administrar Ejemplares y Ubicación Física" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde el menú lateral del sistema, la opción «Ejemplares», que lo lleva a la interfaz P5.1 o P5.2 según el caso de uso hijo que corresponda; la interfaz P5.3 se abre desde el listado de la interfaz P5.2.
- 2.- El sistema despliega la interfaz correspondiente (P5.1 o P5.2) con las opciones específicas de «Ejemplares».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en las tablas ejemplar, libro y biblioteca.

## RF5.1 Registrar ejemplar de libro

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF5.1.1; RF5.1.2; RF5.1.3; RF5.1.4; RF5.1.5

**Propósito:** Permitir registrar un ejemplar físico correspondiente a un libro previamente registrado en el catálogo.

**Resumen:** Este caso de uso permite registrar un ejemplar físico correspondiente a un libro previamente registrado en el catálogo. El sistema debe garantizar que el ejemplar queda registrado en el sistema y puede ser consultado, actualizado, utilizado en reservas, préstamos o procesos de disponibilidad.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema debe garantizar que el ejemplar queda registrado en el sistema y puede ser consultado, actualizado, utilizado en reservas, préstamos o procesos de disponibilidad.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P5.1 de registro de ejemplar.
- 2.- El sistema presenta el formulario de registro del ejemplar físico.
- 3.- El actor busca y selecciona el libro al que corresponde el ejemplar.
- 4.- El sistema permite localizar el libro dentro del catálogo mediante búsqueda o selección.
- 5.- El actor ingresa el código del ejemplar.
- 6.- El sistema valida que el código no se repita con uno ya existente. La validación se realiza en la tabla ejemplar.
- 7.- El actor indica la biblioteca y la ubicación física del ejemplar.
- 8.- El sistema toma la ubicación como dato de localización dentro de la biblioteca.
- 9.- El actor hace clic en el botón «Guardar» para confirmar el registro del ejemplar.
- 10.- El sistema verifica los datos ingresados antes de crear el registro.
- 11.- El sistema registra el ejemplar y lo deja disponible para consulta, actualización, reservas, préstamos y control de disponibilidad. El registro se crea en la tabla ejemplar, vinculado a las tablas libro y biblioteca. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿El código del ejemplar es único dentro del sistema? En caso negativo, el sistema informa que el código ya se encuentra en uso y solicita el ingreso de un código distinto.

**Requerimientos (RF5.1):**

- RF5.1.1: Este caso de uso permite registrar un ejemplar físico correspondiente a un libro previamente registrado en el catálogo.
- RF5.1.2: El sistema debe garantizar que el ejemplar queda registrado en el sistema y puede ser consultado, actualizado, utilizado en reservas, préstamos o procesos de disponibilidad.
- [Interfaz] RF5.1.3: La interfaz debe presentar un formulario con los campos: libro asociado (mediante selección o búsqueda), código de ejemplar y ubicación física.
- [Interfaz] RF5.1.4: La interfaz debe incluir el desplegable «Biblioteca» para indicar la biblioteca física donde se ubica el ejemplar.
- [Interfaz] RF5.1.5: La interfaz debe incluir un botón «Guardar» que registra el ejemplar con los datos ingresados.

## RF5.2 Asignar código de ejemplar

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF5.2.1; RF5.2.2; RF5.2.3

**Propósito:** Permitir asignar o registrar el código que identifica de manera única a un ejemplar físico dentro del sistema bibliotecario.

**Resumen:** Este caso de uso permite asignar o registrar el código que identifica de manera única a un ejemplar físico dentro del sistema bibliotecario. El sistema debe garantizar que el ejemplar queda identificado con un código dentro del sistema, permitiendo su control, búsqueda y relación con préstamos, reservas y disponibilidad.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema debe garantizar que el ejemplar queda identificado con un código dentro del sistema, permitiendo su control, búsqueda y relación con préstamos, reservas y disponibilidad.

**Curso normal de eventos:**

- 1.- El actor ubica el campo de código de ejemplar dentro del formulario de la interfaz P5.1.
- 2.- El sistema presenta el campo de texto destinado al código del ejemplar.
- 3.- El actor ingresa el código que identificará al ejemplar.
- 4.- El sistema verifica que el código ingresado no coincida con uno ya registrado. La verificación se realiza en la tabla ejemplar.
- 5.- El sistema acepta el código y lo asocia al ejemplar, permitiendo su control, búsqueda y relación con préstamos, reservas y disponibilidad. El código se guarda en la tabla ejemplar. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿El código ingresado ya se encuentra en uso? En caso afirmativo, el sistema advierte la duplicidad del código e impide continuar hasta que sea corregido.

**Requerimientos (RF5.2):**

- RF5.2.1: Este caso de uso permite asignar o registrar el código que identifica de manera única a un ejemplar físico dentro del sistema bibliotecario.
- RF5.2.2: El sistema debe garantizar que el ejemplar queda identificado con un código dentro del sistema, permitiendo su control, búsqueda y relación con préstamos, reservas y disponibilidad.
- [Interfaz] RF5.2.3: La interfaz debe presentar un campo de texto para ingresar el código del ejemplar, validando que no se repita con uno ya existente.

## RF5.3 Consultar ejemplares registrados

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF5.3.1; RF5.3.2; RF5.3.3; RF5.3.4; RF5.3.5

**Propósito:** Permitir visualizar los ejemplares registrados en el sistema, mostrando información general relacionada con el libro, código, biblioteca física, ubicación, estado y disponibilidad.

**Resumen:** Este caso de uso permite visualizar los ejemplares registrados en el sistema, mostrando información general relacionada con el libro, código, biblioteca física, ubicación, estado y disponibilidad. El sistema muestra la información de los ejemplares registrados.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema muestra la información de los ejemplares registrados.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P5.2 de consulta de ejemplares.
- 2.- El sistema carga la tabla paginada con los ejemplares registrados. Los datos se obtienen de las tablas ejemplar, libro y biblioteca.
- 3.- El actor revisa la información de cada ejemplar.
- 4.- El sistema muestra las columnas de código, libro relacionado, biblioteca, ubicación, estado y disponibilidad.
- 5.- El actor recorre las páginas del inventario de ejemplares.
- 6.- El sistema pagina los resultados conservando el orden del listado.

**Curso alternativo de eventos:**

- ¿Existen ejemplares registrados en el sistema? En caso negativo, el sistema presenta la tabla vacía e invita a registrar ejemplares para los libros del catálogo.

**Requerimientos (RF5.3):**

- RF5.3.1: Este caso de uso permite visualizar los ejemplares registrados en el sistema, mostrando información general relacionada con el libro, código, biblioteca física, ubicación, estado y disponibilidad.
- RF5.3.2: El sistema muestra la información de los ejemplares registrados.
- RF5.3.3: El sistema debe garantizar que no se modifica información, salvo que posteriormente el actor seleccione una acción de actualización o cambio de estado.
- [Interfaz] RF5.3.4: La interfaz debe mostrar los ejemplares en una tabla con columnas de código, libro relacionado, biblioteca, ubicación, estado y disponibilidad.
- [Interfaz] RF5.3.5: La interfaz debe incluir una paginación para recorrer el listado de ejemplares.

## RF5.3.1 Buscar ejemplar de libro

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF5.3.1.1; RF5.3.1.2; RF5.3.1.3; RF5.3.1.4

**Propósito:** Permitir localizar un ejemplar físico registrado en el sistema mediante criterios de búsqueda como código de ejemplar, título del libro, biblioteca física, facultad, estado o clasificación.

**Resumen:** Este caso de uso permite localizar un ejemplar físico registrado en el sistema mediante criterios de búsqueda como código de ejemplar, título del libro, biblioteca física, facultad, estado o clasificación. El sistema muestra los ejemplares que coinciden con el criterio de búsqueda ingresado.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema muestra los ejemplares que coinciden con el criterio de búsqueda ingresado.

**Curso normal de eventos:**

- 1.- El actor ingresa el criterio de búsqueda en el campo habilitado de la interfaz P5.2.
- 2.- El sistema toma el criterio ingresado, que puede ser el código del ejemplar o el título del libro.
- 3.- El actor lanza la búsqueda sobre el inventario de ejemplares.
- 4.- El sistema recorre los ejemplares registrados comparándolos con el criterio ingresado. La búsqueda se realiza sobre las tablas ejemplar y libro.

**Curso alternativo de eventos:**

- ¿Existen ejemplares que coincidan con el criterio ingresado? En caso negativo, el sistema informa que no se encontraron ejemplares con ese criterio y permite modificar la búsqueda.

**Requerimientos (RF5.3.1):**

- RF5.3.1.1: Este caso de uso permite localizar un ejemplar físico registrado en el sistema mediante criterios de búsqueda como código de ejemplar, título del libro, biblioteca física, facultad, estado o clasificación.
- RF5.3.1.2: El sistema muestra los ejemplares que coinciden con el criterio de búsqueda ingresado.
- [Interfaz] RF5.3.1.3: La interfaz debe incluir un campo de texto para ingresar el criterio de búsqueda (código de ejemplar o título del libro).
- [Interfaz] RF5.3.1.4: La interfaz debe indicar mediante un mensaje cuando la búsqueda no encuentra coincidencias.

## RF5.3.1.1 Aplicar filtros de ejemplares

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF5.3.1.1.1; RF5.3.1.1.2; RF5.3.1.1.3; RF5.3.1.1.4

**Propósito:** Permitir aplicar filtros sobre los ejemplares registrados para reducir o clasificar los resultados según criterios relacionados con la biblioteca física, facultad, estado, disponibilidad, tipo de préstamo o ubicación.

**Resumen:** Este caso de uso permite aplicar filtros sobre los ejemplares registrados para reducir o clasificar los resultados según criterios relacionados con la biblioteca física, facultad, estado, disponibilidad, tipo de préstamo o ubicación. El sistema muestra la lista de ejemplares filtrada según los criterios seleccionados por el actor.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema muestra la lista de ejemplares filtrada según los criterios seleccionados por el actor.

**Curso normal de eventos:**

- 1.- El actor despliega los controles de filtro disponibles en la interfaz P5.2.
- 2.- El sistema muestra los filtros de biblioteca, facultad, estado, disponibilidad y ubicación.
- 3.- El actor elige biblioteca, estado, disponibilidad o ubicación.
- 4.- El sistema combina los criterios seleccionados para delimitar el listado.
- 5.- El actor aplica los criterios elegidos sobre los ejemplares.
- 6.- El sistema recalcula la lista de ejemplares según la combinación de criterios. Los datos se obtienen de las tablas ejemplar, libro, biblioteca, carrera y facultad.

**Curso alternativo de eventos:**

- ¿La combinación de filtros seleccionada devuelve ejemplares? En caso negativo, el sistema informa que ningún ejemplar cumple los criterios seleccionados y permite limpiar los filtros aplicados.

**Requerimientos (RF5.3.1.1):**

- RF5.3.1.1.1: Este caso de uso permite aplicar filtros sobre los ejemplares registrados para reducir o clasificar los resultados según criterios relacionados con la biblioteca física, facultad, estado, disponibilidad, tipo de préstamo o ubicación.
- RF5.3.1.1.2: El sistema muestra la lista de ejemplares filtrada según los criterios seleccionados por el actor.
- [Interfaz] RF5.3.1.1.3: La interfaz debe presentar los filtros disponibles (biblioteca, facultad, estado, disponibilidad, ubicación) como controles desplegables o casillas de selección.
- [Interfaz] RF5.3.1.1.4: La interfaz debe mostrar la cantidad de ejemplares resultantes tras aplicar los filtros, mediante el contador «N ejemplares encontrados».

## RF5.4 Actualizar datos del ejemplar

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF5.4.1; RF5.4.2; RF5.4.3; RF5.4.4

**Propósito:** Permitir modificar la información de un ejemplar físico registrado en el sistema.

**Resumen:** Este caso de uso permite modificar la información de un ejemplar físico registrado en el sistema. El sistema debe garantizar que los datos del ejemplar quedan actualizados en el sistema.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema debe garantizar que los datos del ejemplar quedan actualizados en el sistema.

**Curso normal de eventos:**

- 1.- El actor selecciona el ejemplar a modificar desde el listado de la interfaz P5.2.
- 2.- El sistema abre la interfaz P5.3 con el formulario prellenado con los datos actuales del ejemplar.
- 3.- El actor modifica el código, la biblioteca o la ubicación del ejemplar.
- 4.- El sistema habilita los campos editables del formulario.
- 5.- El actor hace clic en el botón «Guardar cambios» para guardar los cambios del ejemplar.
- 6.- El sistema valida que el código modificado siga siendo único dentro del sistema.
- 7.- El sistema actualiza los datos del ejemplar y los deja registrados en el sistema. Los cambios se guardan en la tabla ejemplar. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿El código modificado sigue siendo único dentro del sistema? En caso negativo, el sistema informa la duplicidad del código y conserva los datos anteriores del ejemplar.

**Requerimientos (RF5.4):**

- RF5.4.1: Este caso de uso permite modificar la información de un ejemplar físico registrado en el sistema.
- RF5.4.2: El sistema debe garantizar que los datos del ejemplar quedan actualizados en el sistema.
- [Interfaz] RF5.4.3: La interfaz debe presentar un formulario prellenado con los datos actuales del ejemplar (código, biblioteca, ubicación), habilitando los campos editables.
- [Interfaz] RF5.4.4: La interfaz debe incluir un botón «Guardar cambios» que aplica las modificaciones realizadas al ejemplar.

## RF5.5 Actualizar estado del ejemplar

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF5.5.1; RF5.5.2; RF5.5.3; RF5.5.4; RF5.5.5

**Propósito:** Permitir modificar el estado operativo de un ejemplar físico, como disponible, reservado, prestado, no disponible, en mantenimiento o desactivado, según las reglas definidas por la biblioteca.

**Resumen:** Este caso de uso permite modificar el estado operativo de un ejemplar físico, como disponible, reservado, prestado, no disponible, en mantenimiento o desactivado, según las reglas definidas por la biblioteca. El sistema debe garantizar que el estado del ejemplar queda actualizado en el sistema, afectando su disponibilidad para consulta, reserva o préstamo según corresponda. También permite habilitar nuevamente un ejemplar que quedó no disponible tras una devolución registrada como «Con observaciones» o «Dañado», cambiando su estado a disponible una vez que fue revisado; esta acción la realiza el Administrador de biblioteca o el Catalogador.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema debe garantizar que el estado del ejemplar queda actualizado en el sistema, afectando su disponibilidad para consulta, reserva o préstamo según corresponda.

**Curso normal de eventos:**

- 1.- El actor despliega el campo de estado dentro del formulario de la interfaz P5.3.
- 2.- El sistema muestra los estados posibles: disponible, reservado, prestado, no disponible, en mantenimiento o desactivado.
- 3.- El actor selecciona el nuevo estado del ejemplar.
- 4.- El sistema toma el estado seleccionado para el ejemplar.
- 5.- El actor hace clic en el botón «Guardar cambios» del formulario de la interfaz P5.3.
- 6.- El sistema actualiza el estado y ajusta la disponibilidad del ejemplar para consulta, reserva o préstamo según corresponda. El cambio de estado se guarda en la tabla ejemplar. La acción queda registrada en la tabla bitacora.
- 7.- El sistema recalcula la disponibilidad del ejemplar para reservas y préstamos.

**Curso alternativo de eventos:**

- ¿El nuevo estado modifica la disponibilidad del ejemplar? En caso negativo, el sistema actualiza únicamente el estado del ejemplar sin modificar su disponibilidad actual.

**Requerimientos (RF5.5):**

- RF5.5.1: Este caso de uso permite modificar el estado operativo de un ejemplar físico, como disponible, reservado, prestado, no disponible, en mantenimiento o desactivado, según las reglas definidas por la biblioteca.
- RF5.5.2: El sistema debe garantizar que el estado del ejemplar queda actualizado en el sistema, afectando su disponibilidad para consulta, reserva o préstamo según corresponda.
- [Interfaz] RF5.5.3: La interfaz debe presentar un campo de selección (desplegable) con los estados posibles: disponible, reservado, prestado, no disponible, en mantenimiento o desactivado.
- [Interfaz] RF5.5.4: La interfaz debe mostrar el nuevo estado junto al ejemplar una vez confirmado el cambio.
- [Interfaz] RF5.5.5: El cambio de estado se confirma con el botón «Guardar cambios» del formulario de la interfaz P5.3.

## RF5.6 Consultar disponibilidad del ejemplar

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF5.6.1; RF5.6.2; RF5.6.3; RF5.6.4

**Propósito:** Permitir verificar si un ejemplar físico se encuentra disponible, reservado, prestado o no disponible dentro del sistema.

**Resumen:** Este caso de uso permite verificar si un ejemplar físico se encuentra disponible, reservado, prestado o no disponible dentro del sistema. El sistema muestra la disponibilidad del ejemplar.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema muestra la disponibilidad del ejemplar.

**Curso normal de eventos:**

- 1.- El actor ubica en la tabla de la interfaz P5.2 el ejemplar cuya disponibilidad desea consultar.
- 2.- El sistema muestra la columna de disponibilidad correspondiente a ese ejemplar. El dato se obtiene de la tabla ejemplar.
- 3.- El actor revisa el indicador visual de disponibilidad.
- 4.- El sistema muestra una etiqueta de color que refleja el estado actual del ejemplar.

**Curso alternativo de eventos:**

- ¿El ejemplar se encuentra disponible? En caso negativo, el sistema muestra el indicador correspondiente al estado que lo restringe: reservado, prestado, en mantenimiento o no disponible.

**Requerimientos (RF5.6):**

- RF5.6.1: Este caso de uso permite verificar si un ejemplar físico se encuentra disponible, reservado, prestado o no disponible dentro del sistema.
- RF5.6.2: El sistema muestra la disponibilidad del ejemplar.
- RF5.6.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF5.6.4: La interfaz debe mostrar el estado de disponibilidad mediante un indicador visual (por ejemplo, una etiqueta de color) junto al ejemplar consultado.

## RF5.7 Consultar ubicación del ejemplar

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF5.7.1; RF5.7.2; RF5.7.3; RF5.7.4

**Propósito:** Permitir consultar la ubicación física registrada de un ejemplar, considerando la biblioteca física donde se encuentra y la clasificación utilizada para ubicarlo dentro de los estantes.

**Resumen:** Este caso de uso permite consultar la ubicación física registrada de un ejemplar, considerando la biblioteca física donde se encuentra y la clasificación utilizada para ubicarlo dentro de los estantes. El sistema muestra la ubicación física del ejemplar.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema muestra la ubicación física del ejemplar.

**Curso normal de eventos:**

- 1.- El actor ubica en la tabla de la interfaz P5.2 el ejemplar cuya ubicación desea consultar.
- 2.- El sistema muestra la columna de ubicación correspondiente a ese ejemplar. Los datos se obtienen de las tablas ejemplar y biblioteca.
- 3.- El actor revisa la biblioteca física y la clasificación Dewey asignadas.
- 4.- El sistema muestra ambos datos para permitir la localización del material.

**Curso alternativo de eventos:**

- ¿El ejemplar tiene una ubicación registrada? En caso negativo, el sistema indica que aún no se ha asignado una ubicación física a ese ejemplar.

**Requerimientos (RF5.7):**

- RF5.7.1: Este caso de uso permite consultar la ubicación física registrada de un ejemplar, considerando la biblioteca física donde se encuentra y la clasificación utilizada para ubicarlo dentro de los estantes.
- RF5.7.2: El sistema muestra la ubicación física del ejemplar.
- RF5.7.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF5.7.4: La interfaz debe mostrar la biblioteca física y la clasificación Dewey asociadas al ejemplar consultado.
