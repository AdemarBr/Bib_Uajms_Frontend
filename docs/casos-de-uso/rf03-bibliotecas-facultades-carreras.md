# RF3 — Administrar bibliotecas, facultades y carreras

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/estructura`.

## RF3 Administrar Bibliotecas, Facultades y Carreras (caso de uso padre)

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF3.1; RF3.2; RF3.3; RF3.4; RF3.5; RF3.6; RF3.7

**Propósito:** Administrar de forma integral la funcionalidad "Administrar Bibliotecas, Facultades y Carreras" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite consultar bibliotecas, facultades y carreras; registrar facultad; actualizar datos de facultad; registrar carrera; actualizar datos de carrera; registrar biblioteca física; actualizar datos de biblioteca.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con alguno de los siguientes roles habilitados: Administrador general del sistema.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Administrar Bibliotecas, Facultades y Carreras" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde el menú lateral del sistema, la opción «Bibliotecas, facultades y carreras», que lo lleva a la interfaz P3.1 a P3.5 según el caso de uso hijo que corresponda.
- 2.- El sistema despliega la interfaz correspondiente (P3.1 a P3.5) con las opciones específicas de «Bibliotecas, facultades y carreras».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en las tablas facultad, carrera y biblioteca.

## RF3.1 Consultar bibliotecas, facultades y carreras

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF3.1.1; RF3.1.2; RF3.1.3; RF3.1.4; RF3.1.5; RF3.1.6; RF3.1.7

**Propósito:** Permitir visualizar la información registrada sobre bibliotecas físicas, facultades y carreras disponibles en el sistema.

**Resumen:** Este caso de uso permite visualizar la información registrada sobre bibliotecas físicas, facultades y carreras disponibles en el sistema. El sistema muestra la información de bibliotecas, facultades y carreras registradas.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema muestra la información de bibliotecas, facultades y carreras registradas.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P3.1 de consulta de bibliotecas, facultades y carreras.
- 2.- El sistema presenta pestañas o secciones separadas para cada tipo de registro.
- 3.- El actor selecciona la pestaña correspondiente al tipo que desea consultar.
- 4.- El sistema carga la tabla del tipo seleccionado: facultades, carreras o bibliotecas. Los datos se obtienen de las tablas facultad, carrera y biblioteca.
- 5.- El actor revisa los registros listados.
- 6.- El sistema muestra los datos de cada registro dentro de la tabla correspondiente.

**Curso alternativo de eventos:**

- ¿Existen registros del tipo seleccionado? En caso negativo, el sistema señala que la sección consultada aún no tiene registros dados de alta.

**Requerimientos (RF3.1):**

- RF3.1.1: Este caso de uso permite visualizar la información registrada sobre bibliotecas físicas, facultades y carreras disponibles en el sistema.
- RF3.1.2: El sistema muestra la información de bibliotecas, facultades y carreras registradas.
- RF3.1.3: El sistema debe garantizar que no se modifica información, salvo que posteriormente el actor seleccione una acción de actualización.
- [Interfaz] RF3.1.4: La interfaz debe presentar pestañas o secciones separadas para bibliotecas, facultades y carreras.
- [Interfaz] RF3.1.5: La interfaz debe mostrar cada listado en formato de tabla, con las columnas relevantes a cada tipo de registro.
- [Interfaz] RF3.1.6: Las pestañas deben llamarse «Facultades», «Carreras» y «Bibliotecas».
- [Interfaz] RF3.1.7: La tabla de «Facultades» debe tener las columnas «Nombre», «Carreras», «Biblioteca» y «Estado»; la de «Carreras», las columnas «Nombre», «Facultad» y «Estado»; y la de «Bibliotecas», las columnas «Nombre», «Ubicación», «Facultad / Carrera» y «Estado».

## RF3.2 Registrar facultad

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF3.2.1; RF3.2.2; RF3.2.3; RF3.2.4; RF3.2.5

**Propósito:** Permitir registrar una facultad dentro del sistema para clasificar libros, tesis, carreras, usuarios, reportes y ubicación académica del material.

**Resumen:** Este caso de uso permite registrar una facultad dentro del sistema para clasificar libros, tesis, carreras, usuarios, reportes y ubicación académica del material. El sistema debe garantizar que la facultad queda registrada en el sistema y puede ser utilizada para clasificar carreras, tesis, libros, ejemplares y reportes.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe garantizar que la facultad queda registrada en el sistema y puede ser utilizada para clasificar carreras, tesis, libros, ejemplares y reportes.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P3.2 y selecciona «Facultad» en el selector de tipo de registro.
- 2.- El sistema muestra el campo de nombre y deja deshabilitado el desplegable «Facultad a la que pertenece», que no aplica al registro de una facultad.
- 3.- El actor ingresa el nombre de la facultad.
- 4.- El sistema toma el nombre de la facultad como dato obligatorio.
- 5.- El actor hace clic en el botón «Guardar» para confirmar el registro de la facultad.
- 6.- El sistema verifica que la facultad no se encuentre registrada previamente. La verificación se realiza en la tabla facultad.
- 7.- El sistema registra la facultad y la deja disponible para clasificar carreras, tesis, libros, ejemplares y reportes. El registro se crea en la tabla facultad. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿La facultad ingresada ya se encuentra registrada? En caso afirmativo, el sistema informa la duplicidad y no crea un nuevo registro para evitar facultades repetidas; el actor ajusta el nombre de la facultad para que no duplique otra registrada.

**Requerimientos (RF3.2):**

- RF3.2.1: Este caso de uso permite registrar una facultad dentro del sistema para clasificar libros, tesis, carreras, usuarios, reportes y ubicación académica del material.
- RF3.2.2: El sistema debe garantizar que la facultad queda registrada en el sistema y puede ser utilizada para clasificar carreras, tesis, libros, ejemplares y reportes.
- [Interfaz] RF3.2.3: La interfaz debe presentar un formulario con el campo: nombre de la facultad.
- [Interfaz] RF3.2.4: La interfaz debe incluir un selector «Tipo de registro» (Facultad o Carrera), compartido con el registro de carreras; al elegir «Facultad», el desplegable «Facultad a la que pertenece» se muestra deshabilitado con el texto «No aplica para Facultad».
- [Interfaz] RF3.2.5: La interfaz debe incluir un botón «Guardar» que registra la facultad con el nombre ingresado.

## RF3.3 Actualizar datos de facultad

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF3.3.1; RF3.3.2; RF3.3.3; RF3.3.4; RF3.3.5

**Propósito:** Permitir modificar información de una facultad registrada en el sistema.

**Resumen:** Este caso de uso permite modificar información de una facultad registrada en el sistema. El sistema debe garantizar que la información de la facultad queda actualizada en el sistema.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe garantizar que la información de la facultad queda actualizada en el sistema.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P3.3 y selecciona «Facultad» en el selector de tipo de registro.
- 2.- El sistema lista las facultades registradas para su selección.
- 3.- El actor selecciona la facultad que desea modificar.
- 4.- El sistema precarga el formulario con el nombre actual y las carreras relacionadas.
- 5.- El actor modifica el nombre o cambia el estado de la facultad.
- 6.- El sistema habilita el campo editable conservando la relación con sus carreras.
- 7.- El actor hace clic en el botón «Guardar cambios» para enviar los cambios de la facultad.
- 8.- El sistema valida que el nuevo nombre no duplique otra facultad registrada.
- 9.- El sistema actualiza la información de la facultad y la deja disponible con sus datos modificados. Los cambios se guardan en la tabla facultad. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿El nuevo nombre es válido y no duplica otra facultad? En caso negativo, el sistema informa el conflicto detectado y conserva el nombre anterior de la facultad.

**Requerimientos (RF3.3):**

- RF3.3.1: Este caso de uso permite modificar información de una facultad registrada en el sistema.
- RF3.3.2: El sistema debe garantizar que la información de la facultad queda actualizada en el sistema.
- [Interfaz] RF3.3.3: La interfaz debe presentar un formulario prellenado con los datos actuales de la facultad (nombre, estado, carreras relacionadas), habilitando los campos editables; el estado se cambia mediante un interruptor entre activo e inactivo.
- [Interfaz] RF3.3.4: La interfaz debe incluir el selector «Tipo de registro» (Facultad o Carrera), compartido con la actualización de carreras, y un desplegable para seleccionar la facultad que se desea modificar.
- [Interfaz] RF3.3.5: La interfaz debe incluir un botón «Guardar cambios» que aplica las modificaciones realizadas a la facultad.

## RF3.4 Registrar carrera

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF3.4.1; RF3.4.2; RF3.4.3; RF3.4.4; RF3.4.5

**Propósito:** Permitir registrar una carrera académica dentro del sistema, para organizar tesis, usuarios académicos, reportes y material relacionado con una unidad académica específica.

**Resumen:** Este caso de uso permite registrar una carrera académica dentro del sistema, para organizar tesis, usuarios académicos, reportes y material relacionado con una unidad académica específica. El sistema debe garantizar que la carrera queda registrada en el sistema y puede ser utilizada para clasificar tesis, consultas, reportes y datos académicos.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe garantizar que la carrera queda registrada en el sistema y puede ser utilizada para clasificar tesis, consultas, reportes y datos académicos.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P3.2 y selecciona «Carrera» en el selector de tipo de registro.
- 2.- El sistema muestra el campo de nombre y el desplegable «Facultad a la que pertenece».
- 3.- El actor ingresa el nombre de la carrera.
- 4.- El sistema toma el nombre de la carrera como dato obligatorio.
- 5.- El actor selecciona la facultad a la que pertenece la carrera.
- 6.- El sistema pobla el desplegable con las facultades ya registradas y no admite el ingreso de texto libre.
- 7.- El actor hace clic en el botón «Guardar» para confirmar el registro de la carrera.
- 8.- El sistema verifica que la carrera no exista previamente dentro de esa facultad. La verificación se realiza en la tabla carrera.
- 9.- El sistema registra la carrera y la deja disponible para clasificar tesis, consultas, reportes y datos académicos. El registro se crea en la tabla carrera, vinculado a la tabla facultad. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿La carrera ya se encuentra registrada dentro de la facultad seleccionada? En caso afirmativo, el sistema informa la duplicidad y no crea un nuevo registro, evitando registrar la misma carrera con nombres distintos; el actor ajusta el nombre de la carrera o cambia la facultad seleccionada.

**Requerimientos (RF3.4):**

- RF3.4.1: Este caso de uso permite registrar una carrera académica dentro del sistema, para organizar tesis, usuarios académicos, reportes y material relacionado con una unidad académica específica.
- RF3.4.2: El sistema debe garantizar que la carrera queda registrada en el sistema y puede ser utilizada para clasificar tesis, consultas, reportes y datos académicos.
- [Interfaz] RF3.4.3: La interfaz debe presentar un formulario con los campos: nombre de la carrera y facultad a la que pertenece (mediante selección desplegable).
- [Interfaz] RF3.4.4: La interfaz debe incluir el selector «Tipo de registro» con la opción «Carrera» seleccionada, que habilita el desplegable «Facultad a la que pertenece».
- [Interfaz] RF3.4.5: La interfaz debe incluir un botón «Guardar» que registra la carrera con los datos ingresados.

## RF3.5 Actualizar datos de carrera

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF3.5.1; RF3.5.2; RF3.5.3; RF3.5.4; RF3.5.5

**Propósito:** Permitir modificar la información registrada de una carrera académica dentro del sistema.

**Resumen:** Este caso de uso permite modificar la información registrada de una carrera académica dentro del sistema. El sistema debe garantizar que la información de la carrera queda actualizada en el sistema.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe garantizar que la información de la carrera queda actualizada en el sistema.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P3.3 y selecciona «Carrera» en el selector de tipo de registro.
- 2.- El sistema lista las carreras registradas para su selección.
- 3.- El actor selecciona la carrera que desea modificar.
- 4.- El sistema precarga el formulario con el nombre actual y el desplegable de facultad preseleccionado con la facultad vigente.
- 5.- El actor modifica el nombre de la carrera, cambia su estado o la reasigna a otra facultad.
- 6.- El sistema habilita el campo de nombre y permite cambiar la facultad desde el desplegable.
- 7.- El actor hace clic en el botón «Guardar cambios» para guardar los cambios de la carrera.
- 8.- El sistema valida los datos modificados antes de guardarlos.
- 9.- El sistema actualiza la información de la carrera, incluida su facultad de pertenencia. Los cambios se guardan en la tabla carrera. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿Los datos modificados de la carrera son válidos? En caso negativo, el sistema señala el error detectado y conserva los datos anteriores de la carrera.

**Requerimientos (RF3.5):**

- RF3.5.1: Este caso de uso permite modificar la información registrada de una carrera académica dentro del sistema.
- RF3.5.2: El sistema debe garantizar que la información de la carrera queda actualizada en el sistema.
- [Interfaz] RF3.5.3: La interfaz debe presentar un formulario prellenado con los datos actuales de la carrera (nombre, estado, facultad a la que pertenece), habilitando los campos editables; el estado se cambia mediante un interruptor entre activo e inactivo.
- [Interfaz] RF3.5.4: La interfaz debe incluir el selector «Tipo de registro» con la opción «Carrera» seleccionada y un desplegable «Seleccionar carrera a actualizar».
- [Interfaz] RF3.5.5: La interfaz debe incluir un botón «Guardar cambios» que aplica las modificaciones realizadas a la carrera.

## RF3.6 Registrar biblioteca física

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF3.6.1; RF3.6.2; RF3.6.3; RF3.6.4; RF3.6.5

**Propósito:** Permitir registrar una biblioteca física dentro del sistema, de manera que pueda ser utilizada como ubicación general del material bibliográfico.

**Resumen:** Este caso de uso permite registrar una biblioteca física dentro del sistema, de manera que pueda ser utilizada como ubicación general del material bibliográfico. El sistema debe garantizar que la biblioteca física queda registrada en el sistema y puede ser utilizada posteriormente para asociar ejemplares, ubicar material bibliográfico, generar consultas o reportes, y ser mostrada en el listado del caso de uso «Consultar bibliotecas disponibles».

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe garantizar que la biblioteca física queda registrada en el sistema y puede ser utilizada posteriormente para asociar ejemplares, ubicar material bibliográfico, generar consultas o reportes, y ser mostrada en el listado del caso de uso «Consultar bibliotecas disponibles».

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P3.4 de registro de biblioteca física.
- 2.- El sistema presenta el formulario con los campos de nombre y ubicación, y los desplegables encadenados de Facultad y Carrera.
- 3.- El actor ingresa el nombre, la ubicación física y la descripción de la biblioteca.
- 4.- El sistema toma ambos datos como información de identificación de la biblioteca.
- 5.- El actor selecciona la facultad en el desplegable correspondiente.
- 6.- El sistema recarga de inmediato el desplegable de Carrera con las carreras de esa facultad y lo habilita para su selección.
- 7.- El actor elige la carrera entre las cargadas para esa facultad, o la opción «Toda la facultad» si la biblioteca no es de una carrera específica.
- 8.- El sistema no admite el ingreso de texto libre en ninguno de los dos desplegables, evitando registros inconsistentes.
- 9.- El actor hace clic en el botón «Guardar» para confirmar el registro de la biblioteca.
- 10.- El sistema valida los datos ingresados antes de crear el registro.
- 11.- El sistema registra la biblioteca física y la deja disponible para asociar ejemplares, ubicar material bibliográfico, generar consultas o reportes y aparecer en el listado de bibliotecas disponibles. El registro se crea en la tabla biblioteca, vinculado a la tabla facultad o a la tabla carrera, según corresponda. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿Los datos de la biblioteca son válidos y no duplican un registro existente? En caso negativo, el sistema informa el conflicto detectado y no crea el registro de la biblioteca física; el actor rectifica el nombre, la ubicación o los desplegables encadenados.

**Requerimientos (RF3.6):**

- RF3.6.1: Este caso de uso permite registrar una biblioteca física dentro del sistema, de manera que pueda ser utilizada como ubicación general del material bibliográfico.
- RF3.6.2: El sistema debe garantizar que la biblioteca física queda registrada en el sistema y puede ser utilizada posteriormente para asociar ejemplares, ubicar material bibliográfico, generar consultas o reportes, y ser mostrada en el listado del caso de uso «Consultar bibliotecas disponibles».
- [Interfaz] RF3.6.3: La interfaz debe presentar un formulario con los campos: nombre de la biblioteca, ubicación y descripción.
- [Interfaz] RF3.6.4: La interfaz debe incluir los desplegables encadenados «Facultad» y «Carrera»: «Carrera» permanece deshabilitado («Seleccionar facultad primero») hasta elegir una facultad, se recarga con las carreras de esa facultad y ninguno de los dos acepta texto libre. Si la biblioteca pertenece a toda una facultad y no a una carrera específica, en «Carrera» se elige la opción «Toda la facultad». La Biblioteca Central y la biblioteca de postgrado no pertenecen a ninguna facultad ni carrera y se cargan como datos iniciales, no desde este formulario.
- [Interfaz] RF3.6.5: La interfaz debe incluir un botón «Guardar» que registra la biblioteca física con los datos ingresados.

## RF3.7 Actualizar datos de biblioteca

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF3.7.1; RF3.7.2; RF3.7.3; RF3.7.4; RF3.7.5; RF3.7.6

**Propósito:** Permitir modificar la información registrada de una biblioteca física dentro del sistema.

**Resumen:** Este caso de uso permite modificar la información registrada de una biblioteca física dentro del sistema. El sistema debe garantizar que los datos de la biblioteca física quedan actualizados en el sistema.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe garantizar que los datos de la biblioteca física quedan actualizados en el sistema.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P3.5 y selecciona la biblioteca en el desplegable inicial, que incluye también la Biblioteca Central.
- 2.- El sistema precarga el nombre, la ubicación, la descripción, el estado y los desplegables de Facultad y Carrera con los valores actuales de la biblioteca; si se trata de la Biblioteca Central, muestra esos desplegables deshabilitados con el texto «No aplica — Biblioteca Central».
- 3.- El actor modifica el nombre, la ubicación, la descripción o el estado de la biblioteca.
- 4.- El sistema habilita los campos editables del formulario.
- 5.- El actor ajusta la facultad o la carrera relacionada cuando corresponde.
- 6.- El sistema aplica el mismo comportamiento en cascada del registro, recargando las carreras al cambiar la facultad.
- 7.- El actor hace clic en el botón «Guardar cambios» para guardar los cambios de la biblioteca.
- 8.- El sistema valida los datos modificados antes de guardarlos.
- 9.- El sistema actualiza todos los datos de la biblioteca física, incluidas la facultad y la carrera relacionadas. Los cambios se guardan en la tabla biblioteca. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿La biblioteca seleccionada corresponde a la Biblioteca Central? En caso afirmativo, el sistema deshabilita los desplegables de Facultad y Carrera, muestra «No aplica — Biblioteca Central» y actualiza solo el nombre, la ubicación y la descripción; en caso negativo, el actor modifica el nombre, la ubicación, la descripción o el estado de la biblioteca.  ¿La biblioteca seleccionada corresponde a la Biblioteca Central al guardar los cambios? En caso afirmativo, el sistema muestra los desplegables de Facultad y Carrera deshabilitados y vacíos, con el texto «No aplica — Biblioteca Central», y actualiza únicamente el nombre, la ubicación y la descripción.

**Requerimientos (RF3.7):**

- RF3.7.1: Este caso de uso permite modificar la información registrada de una biblioteca física dentro del sistema.
- RF3.7.2: El sistema debe garantizar que los datos de la biblioteca física quedan actualizados en el sistema.
- [Interfaz] RF3.7.3: La interfaz debe presentar un formulario prellenado con los datos actuales de la biblioteca (nombre, ubicación, descripción, estado, facultad relacionada si corresponde), habilitando los campos editables; el estado se cambia mediante un interruptor entre activo e inactivo.
- [Interfaz] RF3.7.4: La interfaz debe incluir un desplegable inicial «Biblioteca» para seleccionar la biblioteca a actualizar (incluida la Biblioteca Central) y los desplegables «Facultad» y «Carrera», que se recargan en cascada.
- [Interfaz] RF3.7.5: Al seleccionar la Biblioteca Central, la interfaz debe mostrar los desplegables «Facultad» y «Carrera» deshabilitados (no ocultos) con el texto «No aplica — Biblioteca Central»; de esa biblioteca solo se editan el nombre, la ubicación y la descripción; su estado permanece activo.
- [Interfaz] RF3.7.6: La interfaz debe incluir un botón «Guardar cambios» que aplica las modificaciones realizadas a la biblioteca.
