# RF11 — Consultar tesis digitales

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/tesis`.

## RF11 Consultar Tesis Digitales (caso de uso padre)

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF11.1

**Propósito:** Administrar de forma integral la funcionalidad "Consultar Tesis Digitales" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite buscar tesis digitales.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Consultar Tesis Digitales" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde la barra superior del sistema, la opción «Tesis», que lo lleva a la interfaz P11.1, P11.2 según el caso de uso hijo que corresponda.
- 2.- El sistema despliega la interfaz correspondiente (P11.1, P11.2) con las opciones específicas de «Tesis».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en las tablas tesis y documento_tesis.

## RF11.1 Buscar tesis digitales

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF11.1.1; RF11.1.2; RF11.1.3; RF11.1.4

**Propósito:** Permitir buscar tesis digitales registradas en el sistema mediante criterios académicos como título, autor, carrera, facultad, año o palabras clave relacionadas con el tema de investigación.

**Resumen:** Este caso de uso permite buscar tesis digitales registradas en el sistema mediante criterios académicos como título, autor, carrera, facultad, año o palabras clave relacionadas con el tema de investigación. El sistema muestra las tesis digitales que coinciden con los criterios de búsqueda ingresados por el usuario.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** El sistema muestra las tesis digitales que coinciden con los criterios de búsqueda ingresados por el usuario.

**Curso normal de eventos:**

- 1.- El usuario accede a la interfaz P11.1 desde el menú Tesis.
- 2.- El sistema presenta el campo de búsqueda único del repositorio de tesis digitales.
- 3.- El usuario ingresa el título, autor, carrera o palabras clave del tema.
- 4.- El sistema toma el criterio ingresado para la búsqueda.
- 5.- El usuario lanza la consulta sobre el repositorio de tesis.
- 6.- El sistema recorre el repositorio de tesis comparándolas con el criterio ingresado. La búsqueda se realiza sobre las tablas tesis y carrera.
- 7.- El usuario recorre las tesis encontradas.
- 8.- El sistema muestra el título, autor, carrera y año de cada tesis encontrada.

**Curso alternativo de eventos:**

- ¿Se encontraron tesis digitales que coincidan con el criterio? En caso negativo, el sistema informa que no se encontraron tesis con ese criterio y sugiere modificar la búsqueda.

**Requerimientos (RF11.1):**

- RF11.1.1: Este caso de uso permite buscar tesis digitales registradas en el sistema mediante criterios académicos como título, autor, carrera, facultad, año o palabras clave relacionadas con el tema de investigación.
- RF11.1.2: El sistema muestra las tesis digitales que coinciden con los criterios de búsqueda ingresados por el usuario.
- [Interfaz] RF11.1.3: La interfaz debe incluir un campo de búsqueda único donde el usuario puede ingresar título, autor, carrera o palabras clave del tema.
- [Interfaz] RF11.1.4: La interfaz debe mostrar los resultados en una lista con título, autor, carrera y año de cada tesis.

## RF11.1.1 Aplicar filtros de búsqueda de tesis

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF11.1.1.1; RF11.1.1.2; RF11.1.1.3

**Propósito:** Permitir aplicar filtros sobre los resultados de búsqueda de tesis para reducir o clasificar la información mostrada por el sistema.

**Resumen:** Este caso de uso permite aplicar filtros sobre los resultados de búsqueda de tesis para reducir o clasificar la información mostrada por el sistema. El sistema muestra las tesis digitales filtradas de acuerdo con los criterios seleccionados por el usuario.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** El sistema muestra las tesis digitales filtradas de acuerdo con los criterios seleccionados por el usuario.

**Curso normal de eventos:**

- 1.- El usuario despliega los filtros disponibles junto a los resultados de la interfaz P11.1.
- 2.- El sistema muestra los filtros de carrera y gestión.
- 3.- El usuario elige la carrera o la gestión.
- 4.- El sistema combina los criterios seleccionados para delimitar los resultados.
- 5.- El usuario aplica los criterios elegidos sobre las tesis halladas.
- 6.- El sistema recalcula los resultados de búsqueda según la combinación de criterios. Los datos se obtienen de las tablas tesis y carrera.

**Curso alternativo de eventos:**

- ¿Quedan tesis en los resultados después de aplicar los filtros? En caso negativo, el sistema informa que ninguna tesis cumple los criterios seleccionados y permite limpiar los filtros aplicados.

**Requerimientos (RF11.1.1):**

- RF11.1.1.1: Este caso de uso permite aplicar filtros sobre los resultados de búsqueda de tesis para reducir o clasificar la información mostrada por el sistema.
- RF11.1.1.2: El sistema muestra las tesis digitales filtradas de acuerdo con los criterios seleccionados por el usuario.
- [Interfaz] RF11.1.1.3: La interfaz debe presentar los filtros disponibles (carrera y gestión) como controles desplegables.

## RF11.1.2 Visualizar detalle de tesis

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF11.1.2.1; RF11.1.2.2; RF11.1.2.3; RF11.1.2.4

**Propósito:** Permitir visualizar la información detallada de una tesis seleccionada desde los resultados de búsqueda.

**Resumen:** Este caso de uso permite visualizar la información detallada de una tesis seleccionada desde los resultados de búsqueda. El sistema muestra el detalle de la tesis seleccionada, incluyendo información como título, autor, tutor, carrera, facultad, año o gestión, número de inventario, palabras clave y otros datos registrados.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** El sistema muestra el detalle de la tesis seleccionada, incluyendo información como título, autor, tutor, carrera, facultad, año o gestión, número de inventario, palabras clave y otros datos registrados.

**Curso normal de eventos:**

- 1.- El usuario selecciona una tesis desde los resultados de búsqueda.
- 2.- El sistema abre la interfaz P11.2 con el detalle de la tesis seleccionada.
- 3.- El usuario revisa la sección de datos generales.
- 4.- El sistema muestra el título, la carrera, la facultad, el año o gestión y el número de inventario.
- 5.- El usuario consulta los datos del autor y del tutor.
- 6.- El sistema muestra los datos del autor y del tutor de la tesis.
- 7.- El usuario despliega la sección «Documentos electrónicos» con los archivos digitales asociados.
- 8.- El sistema muestra la sección de documentos digitales con los archivos disponibles para su consulta, registra la fecha de la visualización para los reportes de consultas y presenta el botón «Volver al listado» para regresar a los resultados. Los datos se obtienen de las tablas tesis, carrera, facultad y documento_tesis, y la visualización se registra en la tabla registro_uso.

**Curso alternativo de eventos:**

- ¿La tesis cuenta con documentos digitales cargados? En caso negativo, el sistema muestra únicamente los datos generales e informa que la tesis no cuenta con documentos digitales cargados.

**Requerimientos (RF11.1.2):**

- RF11.1.2.1: Este caso de uso permite visualizar la información detallada de una tesis seleccionada desde los resultados de búsqueda.
- RF11.1.2.2: El sistema muestra el detalle de la tesis seleccionada, incluyendo información como título, autor, tutor, carrera, facultad, año o gestión, número de inventario, palabras clave y otros datos registrados.
- [Interfaz] RF11.1.2.3: La interfaz debe presentar la información de la tesis organizada en secciones: datos generales, autor y tutor, y archivo digital asociado.
- [Interfaz] RF11.1.2.4: El sistema debe registrar la fecha de cada visualización del detalle de una tesis, para que pueda contarse como consulta en los dashboards y reportes.

## RF11.1.2.1 Visualizar documentos digitales de tesis

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF11.1.2.1.1; RF11.1.2.1.2; RF11.1.2.1.3; RF11.1.2.1.4; RF11.1.2.1.5; RF11.1.2.1.6; RF11.1.2.1.7

**Propósito:** Permitir visualizar los documentos digitales asociados a una tesis registrada, organizados por tipo de sección, cuando se encuentren disponibles en el sistema.

**Resumen:** Este caso de uso permite visualizar los documentos digitales asociados a una tesis registrada, organizados por tipo de sección, cuando se encuentren disponibles en el sistema. El sistema muestra los documentos digitales de la tesis disponibles.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** El sistema muestra los documentos digitales de la tesis disponibles.

**Curso normal de eventos:**

- 1.- El usuario ubica, dentro de la interfaz P11.2, los íconos de PDF de los documentos digitales disponibles, cada uno con el nombre de su sección.
- 2.- El sistema lista los documentos organizados por tipo de sección. Los datos se obtienen de la tabla documento_tesis.
- 3.- El usuario selecciona el documento que desea consultar.
- 4.- El sistema abre el documento digital en una nueva pestaña del navegador y registra la apertura. La apertura se registra en la tabla registro_uso.
- 5.- El usuario recorre el contenido del documento seleccionado.
- 6.- El sistema muestra el contenido del documento dentro del visor.

**Curso alternativo de eventos:**

- ¿El documento seleccionado se encuentra disponible? En caso negativo, el sistema informa que el documento no se encuentra disponible para su visualización en este momento.

**Requerimientos (RF11.1.2.1):**

- RF11.1.2.1.1: Este caso de uso permite visualizar los documentos digitales asociados a una tesis registrada, organizados por tipo de sección, cuando se encuentren disponibles en el sistema.
- RF11.1.2.1.2: El sistema muestra los documentos digitales de la tesis disponibles.
- RF11.1.2.1.3: El sistema no debe modelar la descarga como funcionalidad independiente, debido a que la visualización de cada documento puede permitir su descarga desde el propio visor o navegador.
- [Interfaz] RF11.1.2.1.4: La interfaz debe listar, en la sección «Documentos electrónicos», los documentos digitales disponibles organizados por tipo de sección, con un visor integrado (o enlace de apertura) para cada uno.
- [Interfaz] RF11.1.2.1.5: La interfaz debe incluir un botón «Volver al listado» que regresa a los resultados de búsqueda de tesis.
- [Interfaz] RF11.1.2.1.6: La interfaz debe representar cada documento digital como un ícono de PDF con el nombre del archivo debajo (por ejemplo, «Preliminares», «Marco Teórico»), que al hacer clic abre el documento en una nueva pestaña del navegador.
- [Interfaz] RF11.1.2.1.7: El sistema debe registrar la fecha de cada apertura de un documento digital, para que pueda contarse como «Documentos abiertos» en los dashboards y reportes.
