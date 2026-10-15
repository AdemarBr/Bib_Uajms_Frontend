# RF4 — Administrar catálogo de libros

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/catalogo`.

## RF4 Administrar Catálogo de Libros (caso de uso padre)

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF4.1; RF4.2; RF4.3; RF4.4; RF4.5; RF4.6; RF4.7

**Propósito:** Administrar de forma integral la funcionalidad "Administrar Catálogo de Libros" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite registrar libro; importar libros mediante archivo; consultar libros registrados; actualizar datos del libro; desactivar libro; activar libro; consultar historial de cambios del libro.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con alguno de los siguientes roles habilitados: Administrador de biblioteca, Catalogador.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Administrar Catálogo de Libros" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde el menú lateral del sistema, la opción «Gestión de catálogo», que lo lleva a la interfaz P4.1, P4.2 o P4.3 según el caso de uso hijo que corresponda; las interfaces P4.4 y P4.5 se abren desde el libro seleccionado en el listado de la interfaz P4.3.
- 2.- El sistema despliega la interfaz correspondiente (P4.1, P4.2 o P4.3) con las opciones específicas de «Gestión de catálogo».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en las tablas libro e historial_cambio_libro.

## RF4.1 Registrar libro

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF4.1.1; RF4.1.2; RF4.1.3; RF4.1.4; RF4.1.5; RF4.1.6; RF4.1.7

**Propósito:** Permitir registrar un nuevo libro en el catálogo bibliográfico del sistema.

**Resumen:** Este caso de uso permite registrar un nuevo libro en el catálogo bibliográfico del sistema. El sistema debe garantizar que el libro queda registrado en el catálogo bibliográfico del sistema junto con su fecha de registro, y puede ser consultado, actualizado o relacionado posteriormente con ejemplares físicos.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema debe garantizar que el libro queda registrado en el catálogo bibliográfico del sistema junto con su fecha de registro, y puede ser consultado, actualizado o relacionado posteriormente con ejemplares físicos.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P4.1 de registro de libro.
- 2.- El sistema presenta el formulario de datos bibliográficos del libro.
- 3.- El actor registra el título, el autor y la editorial del libro.
- 4.- El sistema toma los datos bibliográficos principales de identificación.
- 5.- El actor asigna la materia, la clasificación Dewey y, si lo tiene, el ISBN.
- 6.- El sistema toma ambos datos como información de clasificación del material.
- 7.- El actor carga la portada del libro con el botón «Subir imagen».
- 8.- El sistema acepta el archivo de imagen y lo asocia al registro bibliográfico.
- 9.- El actor hace clic en el botón «Guardar» para confirmar el registro del libro.
- 10.- El sistema valida los datos bibliográficos y asigna la fecha de registro.
- 11.- El sistema registra el libro en el catálogo bibliográfico junto con su fecha de registro, quedando disponible para consulta, actualización o relación con ejemplares físicos. El registro se crea en la tabla libro. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿Los datos bibliográficos obligatorios están completos? En caso negativo, el sistema señala los campos bibliográficos faltantes y no registra el libro en el catálogo.

**Requerimientos (RF4.1):**

- RF4.1.1: Este caso de uso permite registrar un nuevo libro en el catálogo bibliográfico del sistema.
- RF4.1.2: El sistema debe garantizar que el libro queda registrado en el catálogo bibliográfico del sistema junto con su fecha de registro, y puede ser consultado, actualizado o relacionado posteriormente con ejemplares físicos.
- RF4.1.3: El sistema debe garantizar que esta fecha de registro es utilizada posteriormente por el caso de uso «Visualizar novedades bibliográficas» para determinar los libros más recientemente incorporados al catálogo.
- [Interfaz] RF4.1.4: La interfaz debe presentar un formulario con los campos: título, autor, editorial, materia, clasificación Dewey, ISBN (opcional) y portada.
- [Interfaz] RF4.1.5: La interfaz debe indicar mediante un mensaje que el libro fue registrado correctamente, sin requerir que el actor ingrese la fecha de registro.
- [Interfaz] RF4.1.6: La interfaz debe incluir, junto al campo «Portada», un botón «Subir imagen» para seleccionar y cargar la imagen de portada del libro.
- [Interfaz] RF4.1.7: La interfaz debe incluir un botón «Guardar» que registra el libro con los datos ingresados.

## RF4.2 Importar libros mediante archivo

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF4.2.1; RF4.2.2; RF4.2.3; RF4.2.4; RF4.2.5

**Propósito:** Permitir registrar varios libros en el sistema mediante la carga de un archivo estructurado, reduciendo el registro manual individual cuando se cuenta con información bibliográfica organizada.

**Resumen:** Este caso de uso permite registrar varios libros en el sistema mediante la carga de un archivo estructurado, reduciendo el registro manual individual cuando se cuenta con información bibliográfica organizada. El sistema debe garantizar que los libros válidos contenidos en el archivo quedan registrados en el sistema.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema debe garantizar que los libros válidos contenidos en el archivo quedan registrados en el sistema.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P4.2 de importación de libros.
- 2.- El sistema presenta el control de selección de archivo y el botón para iniciar la importación.
- 3.- El actor selecciona el archivo desde su equipo con el botón «Seleccionar archivo».
- 4.- El sistema toma el archivo seleccionado y verifica que corresponda a un formato admitido.
- 5.- El actor hace clic en el botón «Importar» para iniciar la importación.
- 6.- El sistema procesa cada registro contenido en el archivo de forma individual. Cada libro válido se crea en la tabla libro. La acción queda registrada en la tabla bitacora.
- 7.- El actor revisa el resumen de la importación.
- 8.- El sistema muestra la cantidad de libros incorporados y el detalle de los errores detectados.

**Curso alternativo de eventos:**

- ¿El registro procesado es válido? En caso negativo, el sistema anota la fila observada en el detalle de la importación.  ¿Quedan registros por procesar en el archivo? En caso negativo, el actor revisa el resumen de la importación.

**Requerimientos (RF4.2):**

- RF4.2.1: Este caso de uso permite registrar varios libros en el sistema mediante la carga de un archivo estructurado, reduciendo el registro manual individual cuando se cuenta con información bibliográfica organizada.
- RF4.2.2: El sistema debe garantizar que los libros válidos contenidos en el archivo quedan registrados en el sistema.
- RF4.2.3: Si existen errores, el sistema informa los registros que no pudieron ser importados.
- [Interfaz] RF4.2.4: La interfaz debe incluir un área para arrastrar el archivo o un botón «Seleccionar archivo» para elegirlo desde el equipo del actor, y un botón «Importar» para iniciar la importación.
- [Interfaz] RF4.2.5: La interfaz debe mostrar un resumen tras la importación, indicando cuántos libros se registraron correctamente y el detalle de los registros con errores.

## RF4.3 Consultar libros registrados

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF4.3.1; RF4.3.2; RF4.3.3; RF4.3.4; RF4.3.5; RF4.3.6

**Propósito:** Permitir visualizar los libros registrados en el catálogo del sistema, mostrando información general del material bibliográfico.

**Resumen:** Este caso de uso permite visualizar los libros registrados en el catálogo del sistema, mostrando información general del material bibliográfico. El sistema muestra la información de los libros registrados.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema muestra la información de los libros registrados.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P4.3 de consulta de libros registrados.
- 2.- El sistema carga la tabla paginada con los libros del catálogo. Los datos se obtienen de la tabla libro.
- 3.- El actor revisa la información bibliográfica de cada libro.
- 4.- El sistema muestra las columnas de título, autor, materia, clasificación Dewey y estado.
- 5.- El actor recorre las páginas del catálogo bibliográfico.
- 6.- El sistema pagina los resultados conservando el orden del catálogo.

**Curso alternativo de eventos:**

- ¿Existen libros registrados en el catálogo? En caso negativo, el sistema presenta la tabla vacía e invita a registrar o importar libros al catálogo.

**Requerimientos (RF4.3):**

- RF4.3.1: Este caso de uso permite visualizar los libros registrados en el catálogo del sistema, mostrando información general del material bibliográfico.
- RF4.3.2: El sistema muestra la información de los libros registrados.
- RF4.3.3: El sistema debe garantizar que no se modifica información, salvo que posteriormente el actor seleccione una acción de actualización, desactivación o revisión de historial.
- [Interfaz] RF4.3.4: La interfaz debe mostrar los libros en una tabla con columnas de título, autor, materia, clasificación Dewey y estado.
- [Interfaz] RF4.3.5: La interfaz debe permitir seleccionar un libro de la tabla para acceder a las acciones disponibles.
- [Interfaz] RF4.3.6: La interfaz debe mostrar la cantidad total de libros encontrados y una paginación para recorrer el listado.

## RF4.3.1 Buscar libro registrado

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF4.3.1.1; RF4.3.1.2; RF4.3.1.3; RF4.3.1.4

**Propósito:** Permitir localizar de manera rápida un libro registrado en el sistema mediante criterios de búsqueda bibliográfica.

**Resumen:** Este caso de uso permite localizar de manera rápida un libro registrado en el sistema mediante criterios de búsqueda bibliográfica. El sistema muestra los libros que coinciden con el criterio de búsqueda ingresado.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema muestra los libros que coinciden con el criterio de búsqueda ingresado.

**Curso normal de eventos:**

- 1.- El actor ingresa el criterio de búsqueda en el campo habilitado de la interfaz P4.3.
- 2.- El sistema toma el criterio ingresado, que puede ser título, autor o ISBN.
- 3.- El actor lanza la búsqueda sobre el catálogo bibliográfico.
- 4.- El sistema recorre el catálogo comparando los libros con el criterio ingresado. La búsqueda se realiza sobre la tabla libro.

**Curso alternativo de eventos:**

- ¿Existen libros que coincidan con el criterio ingresado? En caso negativo, el sistema informa que no se encontraron libros con ese criterio y permite modificar la búsqueda.

**Requerimientos (RF4.3.1):**

- RF4.3.1.1: Este caso de uso permite localizar de manera rápida un libro registrado en el sistema mediante criterios de búsqueda bibliográfica.
- RF4.3.1.2: El sistema muestra los libros que coinciden con el criterio de búsqueda ingresado.
- [Interfaz] RF4.3.1.3: La interfaz debe incluir un campo de texto para ingresar el criterio de búsqueda (título, autor o ISBN).
- [Interfaz] RF4.3.1.4: La interfaz debe indicar mediante un mensaje cuando la búsqueda no encuentra coincidencias.

## RF4.3.1.1 Aplicar filtros de libros registrados

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF4.3.1.1.1; RF4.3.1.1.2; RF4.3.1.1.3

**Propósito:** Permitir aplicar filtros sobre los libros registrados para reducir o clasificar los resultados de búsqueda según criterios bibliográficos o institucionales.

**Resumen:** Este caso de uso permite aplicar filtros sobre los libros registrados para reducir o clasificar los resultados de búsqueda según criterios bibliográficos o institucionales. El sistema muestra los libros filtrados de acuerdo con los criterios seleccionados por el actor.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema muestra los libros filtrados de acuerdo con los criterios seleccionados por el actor.

**Curso normal de eventos:**

- 1.- El actor despliega los controles de filtro disponibles en la interfaz P4.3.
- 2.- El sistema muestra los filtros de biblioteca, facultad, materia, autor, estado y clasificación.
- 3.- El actor elige materia, autor, estado o clasificación.
- 4.- El sistema combina los criterios seleccionados para delimitar el listado.
- 5.- El actor aplica los criterios elegidos sobre el catálogo.
- 6.- El sistema recalcula la lista de libros según la combinación de criterios. Los datos se obtienen de las tablas libro, ejemplar, biblioteca, carrera y facultad.

**Curso alternativo de eventos:**

- ¿La combinación de filtros seleccionada devuelve libros? En caso negativo, el sistema informa que ningún libro cumple los criterios seleccionados y permite limpiar los filtros aplicados.

**Requerimientos (RF4.3.1.1):**

- RF4.3.1.1.1: Este caso de uso permite aplicar filtros sobre los libros registrados para reducir o clasificar los resultados de búsqueda según criterios bibliográficos o institucionales.
- RF4.3.1.1.2: El sistema muestra los libros filtrados de acuerdo con los criterios seleccionados por el actor.
- [Interfaz] RF4.3.1.1.3: La interfaz debe presentar los filtros disponibles (biblioteca, facultad, materia, autor, estado, clasificación) como controles desplegables o casillas de selección.

## RF4.4 Actualizar datos del libro

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF4.4.1; RF4.4.2; RF4.4.3; RF4.4.4; RF4.4.5

**Propósito:** Permitir modificar la información bibliográfica de un libro registrado en el sistema.

**Resumen:** Este caso de uso permite modificar la información bibliográfica de un libro registrado en el sistema. El sistema debe garantizar que los datos del libro quedan actualizados en el catálogo bibliográfico del sistema.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema debe garantizar que los datos del libro quedan actualizados en el catálogo bibliográfico del sistema.

**Curso normal de eventos:**

- 1.- El actor selecciona el libro a modificar desde el listado de la interfaz P4.3.
- 2.- El sistema abre la interfaz P4.4 con el formulario prellenado con los datos bibliográficos actuales.
- 3.- El actor modifica los datos bibliográficos editables del libro.
- 4.- El sistema habilita los campos de título, autor, editorial, materia y clasificación Dewey.
- 5.- El actor reemplaza la portada del libro con el botón «Subir imagen» cuando corresponde.
- 6.- El sistema acepta la nueva imagen y sustituye la portada anterior.
- 7.- El actor hace clic en el botón «Guardar cambios» del formulario del libro.
- 8.- El sistema valida los datos modificados antes de guardarlos.
- 9.- El sistema actualiza los datos del libro en el catálogo bibliográfico. Los cambios se guardan en la tabla libro, y cada dato modificado se anota en la tabla historial_cambio_libro. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿Los datos bibliográficos modificados son válidos? En caso negativo, el sistema señala los campos con error y conserva los datos bibliográficos anteriores.

**Requerimientos (RF4.4):**

- RF4.4.1: Este caso de uso permite modificar la información bibliográfica de un libro registrado en el sistema.
- RF4.4.2: El sistema debe garantizar que los datos del libro quedan actualizados en el catálogo bibliográfico del sistema.
- [Interfaz] RF4.4.3: La interfaz debe presentar un formulario prellenado con los datos bibliográficos actuales del libro (título, autor, editorial, materia, clasificación Dewey, ISBN, portada), habilitando los campos editables.
- [Interfaz] RF4.4.4: La interfaz debe incluir, junto al campo «Portada», un botón «Subir imagen» para reemplazar la imagen de portada del libro.
- [Interfaz] RF4.4.5: La interfaz debe incluir un botón «Guardar cambios» que aplica las modificaciones realizadas al libro.

## RF4.5 Desactivar libro

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF4.5.1; RF4.5.2; RF4.5.3; RF4.5.4; RF4.5.5; RF4.5.6

**Propósito:** Permitir cambiar el estado de un libro registrado para que no se encuentre activo dentro del catálogo operativo del sistema.

**Resumen:** Este caso de uso permite cambiar el estado de un libro registrado para que no se encuentre activo dentro del catálogo operativo del sistema. El sistema debe garantizar que el libro queda desactivado en el sistema, conservando su información histórica para control y consulta interna si corresponde.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema debe garantizar que el libro queda desactivado en el sistema, conservando su información histórica para control y consulta interna si corresponde.

**Curso normal de eventos:**

- 1.- El actor ubica el control de estado del libro dentro de la interfaz P4.4.
- 2.- El sistema muestra el control que permite cambiar el estado del libro a desactivado.
- 3.- El actor hace clic en el botón «Desactivar libro».
- 4.- El sistema advierte que el libro dejará de mostrarse en el catálogo y muestra una ventana de confirmación con los botones «Cancelar» y «Confirmar».
- 5.- El actor hace clic en el botón «Confirmar» de la ventana de confirmación.
- 6.- El sistema deja el libro desactivado, conservando su información histórica para control y consulta interna cuando corresponda. El cambio de estado se guarda en la tabla libro. La acción queda registrada en la tabla bitacora.
- 7.- El sistema retira el libro del catálogo público y conserva su historial.

**Curso alternativo de eventos:**

- ¿El actor hace clic en el botón «Confirmar» de la ventana y no en «Cancelar»? En caso negativo, el sistema cancela la operación y conserva el libro activo dentro del catálogo.

**Requerimientos (RF4.5):**

- RF4.5.1: Este caso de uso permite cambiar el estado de un libro registrado para que no se encuentre activo dentro del catálogo operativo del sistema.
- RF4.5.2: El sistema debe garantizar que el libro queda desactivado en el sistema, conservando su información histórica para control y consulta interna si corresponde.
- [Interfaz] RF4.5.3: La interfaz debe mostrar, junto al libro seleccionado, un control para cambiar su estado a desactivado.
- [Interfaz] RF4.5.4: La interfaz debe solicitar confirmación antes de aplicar la desactivación.
- [Interfaz] RF4.5.5: El control para desactivar el libro es el botón «Desactivar libro» de la interfaz P4.4.
- [Interfaz] RF4.5.6: La confirmación se solicita en una ventana titulada «¿Desactivar este libro?» con los botones «Cancelar» y «Confirmar».

## RF4.6 Consultar historial de cambios del libro

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF4.6.1; RF4.6.2; RF4.6.3; RF4.6.4

**Propósito:** Permitir consultar las modificaciones realizadas sobre la información de un libro registrado en el sistema.

**Resumen:** Este caso de uso permite consultar las modificaciones realizadas sobre la información de un libro registrado en el sistema. El sistema muestra el historial de cambios del libro.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.

**Postcondiciones:** El sistema muestra el historial de cambios del libro.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P4.5 desde el libro seleccionado.
- 2.- El sistema carga el historial de cambios registrados para ese libro. Los datos se obtienen de la tabla historial_cambio_libro.
- 3.- El actor revisa la lista cronológica de modificaciones.
- 4.- El sistema muestra la fecha, el campo modificado, el valor anterior y el valor nuevo de cada cambio.

**Curso alternativo de eventos:**

- ¿El libro registra cambios previos en su información? En caso negativo, el sistema señala que el libro conserva los datos con los que fue registrado.

**Requerimientos (RF4.6):**

- RF4.6.1: Este caso de uso permite consultar las modificaciones realizadas sobre la información de un libro registrado en el sistema.
- RF4.6.2: El sistema muestra el historial de cambios del libro.
- RF4.6.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF4.6.4: La interfaz debe mostrar el historial en una lista cronológica, indicando la fecha, el campo modificado, el valor anterior y el valor nuevo.

## RF4.7 Activar libro

**Actores:** Administrador de biblioteca, Catalogador

**Tipo:** Primario

**Referencias:** RF4.7.1; RF4.7.2; RF4.7.3; RF4.7.4; RF4.7.5; RF4.7.6

**Propósito:** Permitir cambiar el estado de un libro desactivado para que vuelva a encontrarse activo dentro del catálogo operativo del sistema.

**Resumen:** Este caso de uso permite cambiar el estado de un libro desactivado para que vuelva a encontrarse activo dentro del catálogo operativo del sistema. El sistema debe garantizar que el libro queda activo y vuelve a mostrarse en el catálogo bibliográfico, conservando su información histórica.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador de biblioteca o Catalogador.
- El libro se encuentra desactivado.

**Postcondiciones:** El sistema debe garantizar que el libro queda activo y vuelve a mostrarse en el catálogo bibliográfico, conservando su información histórica.

**Curso normal de eventos:**

- 1.- El actor ubica el control de estado del libro desactivado dentro de la interfaz P4.4.
- 2.- El sistema muestra el control que permite cambiar el estado del libro a activo.
- 3.- El actor hace clic en el botón «Activar libro».
- 4.- El sistema advierte que el libro volverá a mostrarse en el catálogo y muestra una ventana de confirmación con los botones «Cancelar» y «Confirmar».
- 5.- El actor hace clic en el botón «Confirmar» de la ventana de confirmación.
- 6.- El sistema deja el libro activo, conservando su información histórica. El cambio de estado se guarda en la tabla libro. La acción queda registrada en la tabla bitacora.
- 7.- El sistema vuelve a mostrar el libro en el catálogo público.

**Curso alternativo de eventos:**

- ¿El actor hace clic en el botón «Confirmar» de la ventana y no en «Cancelar»? En caso negativo, el sistema cancela la operación y conserva el libro desactivado.

**Requerimientos (RF4.7):**

- RF4.7.1: Este caso de uso permite cambiar el estado de un libro desactivado para que vuelva a encontrarse activo dentro del catálogo operativo del sistema.
- RF4.7.2: El sistema debe garantizar que el libro queda activo y vuelve a mostrarse en el catálogo bibliográfico, conservando su información histórica.
- [Interfaz] RF4.7.3: La interfaz debe mostrar, junto al libro seleccionado que se encuentra desactivado, un control para cambiar su estado a activo.
- [Interfaz] RF4.7.4: La interfaz debe solicitar confirmación antes de aplicar la activación.
- [Interfaz] RF4.7.5: El control para activar el libro es el botón «Activar libro» de la interfaz P4.4, que reemplaza al botón «Desactivar libro» mientras el libro está desactivado.
- [Interfaz] RF4.7.6: La confirmación se solicita en una ventana titulada «¿Activar este libro?» con los botones «Cancelar» y «Confirmar».
