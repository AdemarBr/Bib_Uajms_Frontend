# RF10 — Administrar tesis digitales

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/tesis`.

## RF10 Administrar Tesis Digitales (caso de uso padre)

**Actores:** Responsable de tesis y solvencias

**Tipo:** Primario

**Referencias:** RF10.1; RF10.2; RF10.3; RF10.4; RF10.5; RF10.6; RF10.7

**Propósito:** Administrar de forma integral la funcionalidad "Administrar Tesis Digitales" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite registrar tesis; cargar documentos digitales de tesis; consultar tesis registradas; actualizar datos de tesis; actualizar documento digital de tesis; desactivar tesis; activar tesis.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con alguno de los siguientes roles habilitados: Responsable de tesis y solvencias.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Administrar Tesis Digitales" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde el menú lateral del sistema, la opción «Gestión de tesis», que lo lleva a la interfaz P10.1 o P10.3 según el caso de uso hijo que corresponda; las interfaces P10.2, P10.4 y P10.5 se abren desde la tesis seleccionada en el listado de la interfaz P10.3.
- 2.- El sistema despliega la interfaz correspondiente (P10.1 o P10.3) con las opciones específicas de «Gestión de tesis».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en las tablas tesis y documento_tesis.

## RF10.1 Registrar tesis

**Actores:** Responsable de tesis y solvencias

**Tipo:** Primario

**Referencias:** RF10.1.1; RF10.1.2; RF10.1.3; RF10.1.4

**Propósito:** Permitir registrar una nueva tesis académica en el sistema, incluyendo la información necesaria para su identificación, clasificación y posterior consulta.

**Resumen:** Este caso de uso permite registrar una nueva tesis académica en el sistema, incluyendo la información necesaria para su identificación, clasificación y posterior consulta. El sistema debe garantizar que la tesis queda registrada en el sistema y puede ser consultada, actualizada, clasificada o vinculada con su archivo digital correspondiente.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Responsable de tesis y solvencias.

**Postcondiciones:** El sistema debe garantizar que la tesis queda registrada en el sistema y puede ser consultada, actualizada, clasificada o vinculada con su archivo digital correspondiente.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P10.1 de registro de tesis.
- 2.- El sistema presenta el formulario de registro de la tesis académica.
- 3.- El actor registra el título, el autor y el tutor de la tesis.
- 4.- El sistema toma los datos de identificación de la tesis.
- 5.- El actor selecciona la carrera y la facultad correspondientes.
- 6.- El sistema presenta los desplegables con las carreras y facultades registradas. Los datos se obtienen de las tablas carrera y facultad.
- 7.- El actor registra el año o gestión, el número de inventario asignado y las palabras clave.
- 8.- El sistema toma ambos datos como información de control de la tesis.
- 9.- El actor hace clic en el botón «Registrar tesis» para confirmar el registro.
- 10.- El sistema verifica que el número de inventario no se encuentre registrado previamente. La verificación se realiza en la tabla tesis.
- 11.- El sistema registra la tesis y la deja disponible para consulta, actualización, clasificación o vinculación con sus documentos digitales. El registro se crea en la tabla tesis, vinculado a la tabla carrera. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿El número de inventario ingresado ya se encuentra registrado? En caso afirmativo, el sistema informa la duplicidad del número de inventario y no registra la tesis; el actor asigna un número de inventario que no esté registrado previamente.  ¿El actor hace clic en el botón «Cancelar»? En caso afirmativo, el sistema descarta los datos ingresados y no registra la tesis.

**Requerimientos (RF10.1):**

- RF10.1.1: Este caso de uso permite registrar una nueva tesis académica en el sistema, incluyendo la información necesaria para su identificación, clasificación y posterior consulta.
- RF10.1.2: El sistema debe garantizar que la tesis queda registrada en el sistema y puede ser consultada, actualizada, clasificada o vinculada con su archivo digital correspondiente.
- [Interfaz] RF10.1.3: La interfaz debe presentar un formulario con los campos: título, autor, tutor, carrera, facultad, año o gestión, número de inventario y palabras clave.
- [Interfaz] RF10.1.4: La interfaz debe incluir un botón «Registrar tesis» que registra la tesis con los datos ingresados, y un botón «Cancelar» que descarta el formulario.

## RF10.2 Cargar documentos digitales de tesis

**Actores:** Responsable de tesis y solvencias

**Tipo:** Primario

**Referencias:** RF10.2.1; RF10.2.2; RF10.2.3; RF10.2.4

**Propósito:** Permitir cargar uno o más documentos digitales de una tesis dentro del sistema, cada uno clasificado por tipo de sección, de manera que puedan ser visualizados posteriormente según las reglas establecidas.

**Resumen:** Este caso de uso permite cargar uno o más documentos digitales de una tesis dentro del sistema, cada uno clasificado por tipo de sección, de manera que puedan ser visualizados posteriormente según las reglas establecidas. El sistema debe garantizar que cada documento digital queda cargado, clasificado por tipo y asociado a la tesis correspondiente.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Responsable de tesis y solvencias.

**Postcondiciones:** El sistema debe garantizar que cada documento digital queda cargado, clasificado por tipo y asociado a la tesis correspondiente.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P10.2 desde la tesis previamente registrada.
- 2.- El sistema presenta el control de carga de documentos por tipo de sección.
- 3.- El actor selecciona el tipo de documento que va a cargar.
- 4.- El sistema muestra los tipos disponibles: Preliminares, Resumen, Marco Teórico, Bibliografía y Anexos.
- 5.- El actor carga el archivo correspondiente a esa sección con el botón «Subir archivo».
- 6.- El sistema toma el archivo y verifica su formato y tamaño.
- 7.- El actor repite la operación para cada sección de la tesis.
- 8.- El sistema clasifica el documento por tipo de sección, lo asocia a la tesis y permite cargar un documento por cada tipo de sección, sin limitarse a un único archivo. Cada documento se crea en la tabla documento_tesis, vinculado a la tabla tesis. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿El archivo cumple el formato y el tamaño admitidos? En caso negativo, el sistema rechaza el archivo indicando el motivo y conserva lo ya cargado.  ¿Quedan secciones de la tesis por cargar? En caso afirmativo, el actor repite la operación para cada sección pendiente.

**Requerimientos (RF10.2):**

- RF10.2.1: Este caso de uso permite cargar uno o más documentos digitales de una tesis dentro del sistema, cada uno clasificado por tipo de sección, de manera que puedan ser visualizados posteriormente según las reglas establecidas.
- RF10.2.2: El sistema debe garantizar que cada documento digital queda cargado, clasificado por tipo y asociado a la tesis correspondiente.
- [Interfaz] RF10.2.3: La interfaz debe incluir un control para seleccionar el tipo de documento (Preliminares, Resumen, Marco Teórico, Bibliografía, Anexos) y cargar el archivo correspondiente, permitiendo repetir la operación para cada sección.
- [Interfaz] RF10.2.4: La interfaz debe incluir un botón «Subir archivo» por cada sección, e indicar su estado como «Pendiente» o «Cargado».

## RF10.3 Consultar tesis registradas

**Actores:** Responsable de tesis y solvencias

**Tipo:** Primario

**Referencias:** RF10.3.1; RF10.3.2; RF10.3.3; RF10.3.4

**Propósito:** Permitir visualizar las tesis registradas en el sistema, mostrando información general como título, autor, carrera, facultad, gestión, número de inventario y estado.

**Resumen:** Este caso de uso permite visualizar las tesis registradas en el sistema, mostrando información general como título, autor, carrera, facultad, gestión, número de inventario y estado. El sistema muestra la información de las tesis registradas.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Responsable de tesis y solvencias.

**Postcondiciones:** El sistema muestra la información de las tesis registradas.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P10.3 de consulta de tesis registradas.
- 2.- El sistema carga la tabla paginada con las tesis registradas. Los datos se obtienen de las tablas tesis, carrera y facultad.
- 3.- El actor revisa la información de cada tesis.
- 4.- El sistema muestra las columnas de título, autor, carrera, facultad, gestión y estado.
- 5.- El actor recorre las páginas del repositorio de tesis.
- 6.- El sistema pagina los resultados conservando el orden del listado.

**Curso alternativo de eventos:**

- ¿Existen tesis registradas en el sistema? En caso negativo, el sistema presenta la tabla vacía e invita a registrar la primera tesis.

**Requerimientos (RF10.3):**

- RF10.3.1: Este caso de uso permite visualizar las tesis registradas en el sistema, mostrando información general como título, autor, carrera, facultad, gestión, número de inventario y estado.
- RF10.3.2: El sistema muestra la información de las tesis registradas.
- RF10.3.3: El sistema debe garantizar que no se modifica información, salvo que posteriormente el actor seleccione una acción de actualización, desactivación o revisión.
- [Interfaz] RF10.3.4: La interfaz debe mostrar las tesis en una tabla con columnas de título, autor, carrera, facultad, gestión y estado.

## RF10.3.1 Buscar tesis registrada

**Actores:** Responsable de tesis y solvencias

**Tipo:** Primario

**Referencias:** RF10.3.1.1; RF10.3.1.2; RF10.3.1.3; RF10.3.1.4

**Propósito:** Permitir localizar una tesis registrada en el sistema mediante criterios de búsqueda como título, autor o número de inventario.

**Resumen:** Este caso de uso permite localizar una tesis registrada en el sistema mediante criterios de búsqueda como título, autor o número de inventario. El sistema muestra las tesis que coinciden con el criterio de búsqueda ingresado.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Responsable de tesis y solvencias.

**Postcondiciones:** El sistema muestra las tesis que coinciden con el criterio de búsqueda ingresado.

**Curso normal de eventos:**

- 1.- El actor ingresa el criterio de búsqueda en el campo habilitado de la interfaz P10.3.
- 2.- El sistema toma el criterio ingresado, que puede ser título, autor o número de inventario.
- 3.- El actor lanza la búsqueda sobre las tesis registradas.
- 4.- El sistema recorre las tesis registradas comparándolas con el criterio ingresado. La búsqueda se realiza sobre la tabla tesis.

**Curso alternativo de eventos:**

- ¿Existen tesis que coincidan con el criterio ingresado? En caso negativo, el sistema informa que no se encontraron tesis con ese criterio y permite modificar la búsqueda.

**Requerimientos (RF10.3.1):**

- RF10.3.1.1: Este caso de uso permite localizar una tesis registrada en el sistema mediante criterios de búsqueda como título, autor o número de inventario.
- RF10.3.1.2: El sistema muestra las tesis que coinciden con el criterio de búsqueda ingresado.
- [Interfaz] RF10.3.1.3: La interfaz debe incluir un campo de texto para ingresar el criterio de búsqueda (título, autor o número de inventario).
- [Interfaz] RF10.3.1.4: La interfaz debe indicar mediante un mensaje cuando la búsqueda no encuentra coincidencias.

## RF10.3.1.1 Aplicar filtros de tesis registradas

**Actores:** Responsable de tesis y solvencias

**Tipo:** Primario

**Referencias:** RF10.3.1.1.1; RF10.3.1.1.2; RF10.3.1.1.3

**Propósito:** Permitir aplicar filtros sobre las tesis registradas para reducir o clasificar los resultados según criterios académicos o administrativos.

**Resumen:** Este caso de uso permite aplicar filtros sobre las tesis registradas para reducir o clasificar los resultados según criterios académicos o administrativos. El sistema muestra la lista de tesis filtrada de acuerdo con los criterios seleccionados por el actor.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Responsable de tesis y solvencias.

**Postcondiciones:** El sistema muestra la lista de tesis filtrada de acuerdo con los criterios seleccionados por el actor.

**Curso normal de eventos:**

- 1.- El actor despliega los controles de filtro disponibles en la interfaz P10.3.
- 2.- El sistema muestra los filtros de carrera y gestión.
- 3.- El actor elige la carrera o la gestión.
- 4.- El sistema combina los criterios seleccionados para delimitar el listado.
- 5.- El actor aplica los criterios elegidos sobre las tesis.
- 6.- El sistema recalcula la lista de tesis según la combinación de criterios. Los datos se obtienen de las tablas tesis y carrera.

**Curso alternativo de eventos:**

- ¿La combinación de filtros seleccionada devuelve tesis? En caso negativo, el sistema informa que ninguna tesis cumple los criterios seleccionados y permite limpiar los filtros aplicados.

**Requerimientos (RF10.3.1.1):**

- RF10.3.1.1.1: Este caso de uso permite aplicar filtros sobre las tesis registradas para reducir o clasificar los resultados según criterios académicos o administrativos.
- RF10.3.1.1.2: El sistema muestra la lista de tesis filtrada de acuerdo con los criterios seleccionados por el actor.
- [Interfaz] RF10.3.1.1.3: La interfaz debe presentar los filtros disponibles (carrera y gestión) como controles desplegables.

## RF10.4 Actualizar datos de tesis

**Actores:** Responsable de tesis y solvencias

**Tipo:** Primario

**Referencias:** RF10.4.1; RF10.4.2; RF10.4.3; RF10.4.4

**Propósito:** Permitir modificar la información registrada de una tesis académica dentro del sistema.

**Resumen:** Este caso de uso permite modificar la información registrada de una tesis académica dentro del sistema. El sistema debe garantizar que los datos de la tesis quedan actualizados en el sistema.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Responsable de tesis y solvencias.

**Postcondiciones:** El sistema debe garantizar que los datos de la tesis quedan actualizados en el sistema.

**Curso normal de eventos:**

- 1.- El actor selecciona la tesis a modificar desde el listado de la interfaz P10.3.
- 2.- El sistema abre la interfaz P10.4 con el formulario prellenado con los datos actuales de la tesis.
- 3.- El actor modifica los datos editables de la tesis.
- 4.- El sistema habilita los campos de título, autor, tutor, carrera, facultad, año o gestión, palabras clave y estado de la tesis.
- 5.- El actor hace clic en el botón «Guardar cambios» para guardar los cambios de la tesis.
- 6.- El sistema valida los datos modificados antes de guardarlos.
- 7.- El sistema actualiza los datos de la tesis y los deja registrados en el sistema. Los cambios se guardan en la tabla tesis. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿Los datos modificados de la tesis son válidos? En caso negativo, el sistema señala los campos con error y conserva los datos anteriores de la tesis.

**Requerimientos (RF10.4):**

- RF10.4.1: Este caso de uso permite modificar la información registrada de una tesis académica dentro del sistema.
- RF10.4.2: El sistema debe garantizar que los datos de la tesis quedan actualizados en el sistema.
- [Interfaz] RF10.4.3: La interfaz debe presentar un formulario prellenado con los datos actuales de la tesis (título, autor, tutor, carrera, facultad, año o gestión, palabras clave y estado de la tesis), habilitando los campos editables.
- [Interfaz] RF10.4.4: La interfaz debe incluir un botón «Guardar cambios» que aplica las modificaciones realizadas a la tesis.

## RF10.5 Actualizar documento digital de tesis

**Actores:** Responsable de tesis y solvencias

**Tipo:** Primario

**Referencias:** RF10.5.1; RF10.5.2; RF10.5.3; RF10.5.4

**Propósito:** Permitir reemplazar o actualizar uno de los documentos digitales asociados a una tesis registrada, seleccionado por tipo de sección.

**Resumen:** Este caso de uso permite reemplazar o actualizar uno de los documentos digitales asociados a una tesis registrada, seleccionado por tipo de sección. El sistema debe garantizar que el documento digital seleccionado queda actualizado en el sistema, sin afectar los demás documentos de la tesis.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Responsable de tesis y solvencias.

**Postcondiciones:** El sistema debe garantizar que el documento digital seleccionado queda actualizado en el sistema, sin afectar los demás documentos de la tesis.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P10.5 desde la tesis seleccionada.
- 2.- El sistema lista los documentos digitales de la tesis organizados por tipo de sección. Los datos se obtienen de la tabla documento_tesis.
- 3.- El actor selecciona en el campo «Sección a reemplazar» el tipo de sección del documento que desea reemplazar.
- 4.- El sistema identifica el documento seleccionado dentro de la tesis y lo muestra en el panel «Archivo actual».
- 5.- El actor carga el nuevo archivo desde su equipo.
- 6.- El sistema toma el archivo y verifica su formato antes del reemplazo.
- 7.- El actor hace clic en el botón «Reemplazar documento» para confirmar el reemplazo.
- 8.- El sistema reemplaza únicamente el documento seleccionado, sin afectar los demás documentos digitales de la tesis. El cambio se guarda en la tabla documento_tesis. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿El nuevo archivo cumple el formato admitido? En caso negativo, el sistema descarta la carga y conserva el documento anterior.

**Requerimientos (RF10.5):**

- RF10.5.1: Este caso de uso permite reemplazar o actualizar uno de los documentos digitales asociados a una tesis registrada, seleccionado por tipo de sección.
- RF10.5.2: El sistema debe garantizar que el documento digital seleccionado queda actualizado en el sistema, sin afectar los demás documentos de la tesis.
- [Interfaz] RF10.5.3: La interfaz debe permitir seleccionar el documento digital a reemplazar mediante el campo «Sección a reemplazar», mostrar el panel «Archivo actual», y cargar el nuevo archivo desde el equipo del actor, sin afectar los demás documentos de la tesis.
- [Interfaz] RF10.5.4: La interfaz debe incluir un botón «Reemplazar documento» que confirma la sustitución del archivo seleccionado.

## RF10.6 Desactivar tesis

**Actores:** Responsable de tesis y solvencias

**Tipo:** Primario

**Referencias:** RF10.6.1; RF10.6.2; RF10.6.3; RF10.6.4; RF10.6.5

**Propósito:** Permitir cambiar el estado de una tesis registrada para que no se encuentre activa dentro del repositorio operativo del sistema.

**Resumen:** Este caso de uso permite cambiar el estado de una tesis registrada para que no se encuentre activa dentro del repositorio operativo del sistema. El sistema debe garantizar que la tesis queda desactivada en el sistema, conservando su información histórica para control interno si corresponde.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Responsable de tesis y solvencias.

**Postcondiciones:** El sistema debe garantizar que la tesis queda desactivada en el sistema, conservando su información histórica para control interno si corresponde.

**Curso normal de eventos:**

- 1.- El actor ubica el control de estado de la tesis dentro de la interfaz P10.4.
- 2.- El sistema muestra el control que permite cambiar el estado de la tesis a desactivada.
- 3.- El actor hace clic en el botón «Desactivar tesis».
- 4.- El sistema advierte que la tesis dejará de mostrarse en las consultas y muestra una ventana de confirmación con los botones «Cancelar» y «Confirmar».
- 5.- El actor hace clic en el botón «Confirmar» de la ventana de confirmación.
- 6.- El sistema deja la tesis desactivada, conservando su información histórica para control interno cuando corresponda. El cambio de estado se guarda en la tabla tesis. La acción queda registrada en la tabla bitacora.
- 7.- El sistema retira la tesis de las consultas públicas y conserva su registro.

**Curso alternativo de eventos:**

- ¿El actor hace clic en el botón «Confirmar» de la ventana y no en «Cancelar»? En caso negativo, el sistema cancela la operación y conserva la tesis activa dentro del sistema.

**Requerimientos (RF10.6):**

- RF10.6.1: Este caso de uso permite cambiar el estado de una tesis registrada para que no se encuentre activa dentro del repositorio operativo del sistema.
- RF10.6.2: El sistema debe garantizar que la tesis queda desactivada en el sistema, conservando su información histórica para control interno si corresponde.
- [Interfaz] RF10.6.3: La interfaz debe mostrar, junto a la tesis seleccionada, un control para cambiar su estado a desactivada.
- [Interfaz] RF10.6.4: La interfaz debe solicitar confirmación antes de aplicar la desactivación.
- [Interfaz] RF10.6.5: El control para desactivar la tesis es el botón «Desactivar tesis» de la interfaz P10.4; la confirmación se solicita en una ventana con los botones «Cancelar» y «Confirmar».

## RF10.7 Activar tesis

**Actores:** Responsable de tesis y solvencias

**Tipo:** Primario

**Referencias:** RF10.7.1; RF10.7.2; RF10.7.3; RF10.7.4; RF10.7.5

**Propósito:** Permitir cambiar el estado de una tesis desactivada para que vuelva a encontrarse activa dentro del repositorio operativo del sistema.

**Resumen:** Este caso de uso permite cambiar el estado de una tesis desactivada para que vuelva a encontrarse activa dentro del repositorio operativo del sistema. El sistema debe garantizar que la tesis queda activa y vuelve a mostrarse en las consultas públicas, conservando su información histórica.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Responsable de tesis y solvencias.
- La tesis se encuentra desactivada.

**Postcondiciones:** El sistema debe garantizar que la tesis queda activa y vuelve a mostrarse en las consultas públicas, conservando su información histórica.

**Curso normal de eventos:**

- 1.- El actor ubica el control de estado de la tesis desactivada dentro de la interfaz P10.4.
- 2.- El sistema muestra el control que permite cambiar el estado de la tesis a activa.
- 3.- El actor hace clic en el botón «Activar tesis».
- 4.- El sistema advierte que la tesis volverá a mostrarse en las consultas y muestra una ventana de confirmación con los botones «Cancelar» y «Confirmar».
- 5.- El actor hace clic en el botón «Confirmar» de la ventana de confirmación.
- 6.- El sistema deja la tesis activa, conservando su información histórica. El cambio de estado se guarda en la tabla tesis. La acción queda registrada en la tabla bitacora.
- 7.- El sistema vuelve a mostrar la tesis en las consultas públicas.

**Curso alternativo de eventos:**

- ¿El actor hace clic en el botón «Confirmar» de la ventana y no en «Cancelar»? En caso negativo, el sistema cancela la operación y conserva la tesis desactivada.

**Requerimientos (RF10.7):**

- RF10.7.1: Este caso de uso permite cambiar el estado de una tesis desactivada para que vuelva a encontrarse activa dentro del repositorio operativo del sistema.
- RF10.7.2: El sistema debe garantizar que la tesis queda activa y vuelve a mostrarse en las consultas públicas, conservando su información histórica.
- [Interfaz] RF10.7.3: La interfaz debe mostrar, junto a la tesis seleccionada que se encuentra desactivada, un control para cambiar su estado a activa.
- [Interfaz] RF10.7.4: La interfaz debe solicitar confirmación antes de aplicar la activación.
- [Interfaz] RF10.7.5: El control para activar la tesis es el botón «Activar tesis» de la interfaz P10.4, que reemplaza al botón «Desactivar tesis» mientras la tesis está desactivada; la confirmación se solicita en una ventana titulada «¿Activar esta tesis?» con los botones «Cancelar» y «Confirmar».
