# RF6 — Consultar catálogo bibliográfico

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/catalogo`.

## RF6 Consultar Catálogo Bibliográfico (caso de uso padre)

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF6.1; RF6.2; RF6.3

**Propósito:** Administrar de forma integral la funcionalidad "Consultar Catálogo Bibliográfico" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite buscar material bibliográfico; visualizar novedades bibliográficas; consultar bibliotecas disponibles.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Consultar Catálogo Bibliográfico" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde la barra superior del sistema, la opción «Catálogo», que lo lleva a la interfaz P6.1, P6.2 según el caso de uso hijo que corresponda.
- 2.- El sistema despliega la interfaz correspondiente (P6.1, P6.2) con las opciones específicas de «Catálogo».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en las tablas libro, ejemplar y biblioteca.

## RF6.1 Buscar material bibliográfico

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF6.1.1; RF6.1.2; RF6.1.3; RF6.1.4; RF6.1.5

**Propósito:** Permitir buscar libros o material bibliográfico registrado en el catálogo del sistema utilizando criterios como título, autor, materia, biblioteca, facultad o clasificación Dewey.

**Resumen:** Este caso de uso permite buscar libros o material bibliográfico registrado en el catálogo del sistema utilizando criterios como título, autor, materia, biblioteca, facultad o clasificación Dewey. El sistema muestra los materiales bibliográficos que coinciden con los criterios ingresados por el usuario.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** El sistema muestra los materiales bibliográficos que coinciden con los criterios ingresados por el usuario.

**Curso normal de eventos:**

- 1.- El usuario accede a la interfaz P6.1 desde el buscador del Home o desde el menú Catálogo.
- 2.- El sistema presenta el campo de búsqueda único del catálogo bibliográfico.
- 3.- El usuario ingresa el título, autor, materia o clasificación Dewey que desea buscar.
- 4.- El sistema toma el criterio ingresado para la búsqueda.
- 5.- El usuario hace clic en el botón «Buscar» para lanzar la consulta sobre el catálogo bibliográfico.
- 6.- El sistema recorre el catálogo bibliográfico comparando el material con el criterio ingresado. La búsqueda se realiza sobre las tablas libro y ejemplar.
- 7.- El usuario recorre los materiales encontrados.
- 8.- El sistema muestra la portada, el título, el autor y la disponibilidad de cada resultado en la misma pantalla.

**Curso alternativo de eventos:**

- ¿Se encontró material bibliográfico que coincida con el criterio? En caso negativo, el sistema informa que no se encontró material con ese criterio y sugiere modificar la búsqueda.

**Requerimientos (RF6.1):**

- RF6.1.1: Este caso de uso permite buscar libros o material bibliográfico registrado en el catálogo del sistema utilizando criterios como título, autor, materia, biblioteca, facultad o clasificación Dewey.
- RF6.1.2: El sistema muestra los materiales bibliográficos que coinciden con los criterios ingresados por el usuario.
- [Interfaz] RF6.1.3: La interfaz debe incluir un campo de búsqueda único donde el usuario puede ingresar título, autor, materia o clasificación Dewey.
- [Interfaz] RF6.1.4: La interfaz debe mostrar los resultados en una lista con la portada, título, autor y disponibilidad de cada libro.
- [Interfaz] RF6.1.5: La interfaz debe incluir un botón «Buscar» junto al campo de búsqueda, que lanza la consulta; el mismo buscador, con su botón «Buscar», se muestra en la pantalla de inicio (P.1).

## RF6.1.1 Aplicar filtros de búsqueda bibliográfica

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF6.1.1.1; RF6.1.1.2; RF6.1.1.3

**Propósito:** Permitir aplicar filtros a los resultados de búsqueda bibliográfica para precisar la información mostrada por el sistema.

**Resumen:** Este caso de uso permite aplicar filtros a los resultados de búsqueda bibliográfica para precisar la información mostrada por el sistema. El sistema muestra los resultados filtrados de acuerdo con los criterios seleccionados por el usuario.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** El sistema muestra los resultados filtrados de acuerdo con los criterios seleccionados por el usuario.

**Curso normal de eventos:**

- 1.- El usuario despliega los filtros disponibles junto a los resultados de la interfaz P6.1.
- 2.- El sistema muestra los filtros de biblioteca, facultad, materia, autor, disponibilidad y clasificación Dewey.
- 3.- El usuario elige biblioteca, materia, autor o disponibilidad.
- 4.- El sistema combina los criterios seleccionados para delimitar los resultados.
- 5.- El usuario aplica los criterios elegidos sobre los resultados.
- 6.- El sistema recalcula los resultados de búsqueda según la combinación de criterios. Los datos se obtienen de las tablas libro, ejemplar, biblioteca, carrera y facultad.

**Curso alternativo de eventos:**

- ¿Quedan resultados después de aplicar los filtros seleccionados? En caso negativo, el sistema informa que ningún material cumple los criterios seleccionados y permite limpiar los filtros aplicados.

**Requerimientos (RF6.1.1):**

- RF6.1.1.1: Este caso de uso permite aplicar filtros a los resultados de búsqueda bibliográfica para precisar la información mostrada por el sistema.
- RF6.1.1.2: El sistema muestra los resultados filtrados de acuerdo con los criterios seleccionados por el usuario.
- [Interfaz] RF6.1.1.3: La interfaz debe presentar los filtros disponibles (biblioteca, facultad, materia, autor, disponibilidad, clasificación Dewey) como controles desplegables o casillas de selección, visibles junto a los resultados de búsqueda.

## RF6.1.2 Visualizar detalle del libro

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF6.1.2.1; RF6.1.2.2; RF6.1.2.3; RF6.1.2.4; RF6.1.2.5

**Propósito:** Permitir visualizar la información detallada de un libro seleccionado desde los resultados del catálogo bibliográfico.

**Resumen:** Este caso de uso permite visualizar la información detallada de un libro seleccionado desde los resultados del catálogo bibliográfico. El sistema muestra el detalle del libro seleccionado, incluyendo la información bibliográfica registrada y los datos relevantes para su identificación.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** El sistema muestra el detalle del libro seleccionado, incluyendo la información bibliográfica registrada y los datos relevantes para su identificación.

**Curso normal de eventos:**

- 1.- El usuario selecciona un libro desde los resultados del catálogo.
- 2.- El sistema abre la interfaz P6.2 con el detalle del libro seleccionado y registra la fecha de la visualización para los reportes de consultas. Los datos se obtienen de la tabla libro, y la visualización se registra en la tabla registro_uso.
- 3.- El usuario revisa la sección de datos bibliográficos.
- 4.- El sistema muestra el título, autor, editorial, materia y clasificación Dewey del libro.
- 5.- El usuario revisa las secciones de disponibilidad y ubicación física.
- 6.- El sistema organiza la información del libro en secciones diferenciadas y muestra el botón «Reservar» para iniciar una reserva.

**Curso alternativo de eventos:**

- ¿El libro cuenta con ejemplares registrados? En caso negativo, el sistema muestra únicamente los datos bibliográficos e indica que el libro no cuenta con ejemplares registrados.

**Requerimientos (RF6.1.2):**

- RF6.1.2.1: Este caso de uso permite visualizar la información detallada de un libro seleccionado desde los resultados del catálogo bibliográfico.
- RF6.1.2.2: El sistema muestra el detalle del libro seleccionado, incluyendo la información bibliográfica registrada y los datos relevantes para su identificación.
- [Interfaz] RF6.1.2.3: La interfaz debe presentar la información del libro organizada en secciones: datos bibliográficos, disponibilidad y ubicación física.
- [Interfaz] RF6.1.2.4: La interfaz debe incluir un botón «Reservar» que deriva al caso de uso «Realizar reserva de libro» (ver RF7.1).
- [Interfaz] RF6.1.2.5: El sistema debe registrar la fecha de cada visualización del detalle de un libro, para que pueda contarse como consulta en los dashboards y reportes.

## RF6.1.2.1 Consultar disponibilidad del libro

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF6.1.2.1.1; RF6.1.2.1.2; RF6.1.2.1.3

**Propósito:** Permitir conocer si un libro o sus ejemplares se encuentran disponibles, reservados, prestados o no disponibles dentro del sistema.

**Resumen:** Este caso de uso permite conocer si un libro o sus ejemplares se encuentran disponibles, reservados, prestados o no disponibles dentro del sistema. El sistema muestra el estado de disponibilidad del libro o de sus ejemplares registrados.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** El sistema muestra el estado de disponibilidad del libro o de sus ejemplares registrados.

**Curso normal de eventos:**

- 1.- El usuario ubica el indicador de disponibilidad dentro de la vista de detalle del libro.
- 2.- El sistema muestra una etiqueta de color con el estado de disponibilidad del libro.
- 3.- El usuario revisa el estado de disponibilidad informado.
- 4.- El sistema refleja el estado consolidado de los ejemplares registrados del libro. El estado se obtiene de la tabla ejemplar.

**Curso alternativo de eventos:**

- ¿Existe al menos un ejemplar disponible del libro? En caso negativo, el sistema muestra el indicador de no disponible y mantiene deshabilitado el botón de reserva.

**Requerimientos (RF6.1.2.1):**

- RF6.1.2.1.1: Este caso de uso permite conocer si un libro o sus ejemplares se encuentran disponibles, reservados, prestados o no disponibles dentro del sistema.
- RF6.1.2.1.2: El sistema muestra el estado de disponibilidad del libro o de sus ejemplares registrados.
- [Interfaz] RF6.1.2.1.3: La interfaz debe mostrar la disponibilidad mediante un indicador visual (por ejemplo, una etiqueta de color) dentro de la vista de detalle del libro.

## RF6.1.2.2 Consultar ubicación física del libro

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF6.1.2.2.1; RF6.1.2.2.2; RF6.1.2.2.3

**Propósito:** Permitir consultar la ubicación física del libro, considerando la biblioteca donde se encuentra registrado y la clasificación utilizada para localizarlo en los estantes.

**Resumen:** Este caso de uso permite consultar la ubicación física del libro, considerando la biblioteca donde se encuentra registrado y la clasificación utilizada para localizarlo en los estantes. El sistema muestra la ubicación física del libro, permitiendo al usuario identificar dónde se encuentra el material bibliográfico.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** El sistema muestra la ubicación física del libro, permitiendo al usuario identificar dónde se encuentra el material bibliográfico.

**Curso normal de eventos:**

- 1.- El usuario ubica la sección de ubicación física dentro de la vista de detalle del libro.
- 2.- El sistema muestra la sección destinada a la localización del material.
- 3.- El usuario revisa la biblioteca física y la clasificación Dewey del libro.
- 4.- El sistema muestra ambos datos para que el usuario pueda ubicar el material en estantería. Los datos se obtienen de las tablas ejemplar y biblioteca.

**Curso alternativo de eventos:**

- ¿El libro cuenta con ejemplares con ubicación asignada? En caso negativo, el sistema indica que aún no se ha asignado una ubicación física al material consultado.

**Requerimientos (RF6.1.2.2):**

- RF6.1.2.2.1: Este caso de uso permite consultar la ubicación física del libro, considerando la biblioteca donde se encuentra registrado y la clasificación utilizada para localizarlo en los estantes.
- RF6.1.2.2.2: El sistema muestra la ubicación física del libro, permitiendo al usuario identificar dónde se encuentra el material bibliográfico.
- [Interfaz] RF6.1.2.2.3: La interfaz debe mostrar la biblioteca física y la clasificación Dewey del libro dentro de la vista de detalle.

## RF6.1.2.3 Visualizar portada del libro

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF6.1.2.3.1; RF6.1.2.3.2; RF6.1.2.3.3; RF6.1.2.3.4; RF6.1.2.3.5

**Propósito:** Permitir visualizar la portada asociada a un libro, cuando esta se encuentre registrada en el sistema.

**Resumen:** Este caso de uso permite visualizar la portada asociada a un libro, cuando esta se encuentre registrada en el sistema. El sistema muestra la portada del libro seleccionado.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** El sistema muestra la portada del libro seleccionado.

**Curso normal de eventos:**

- 1.- El usuario ubica la sección de portada dentro de la vista de detalle del libro.
- 2.- El sistema muestra la sección destinada a la imagen de portada.
- 3.- El usuario visualiza la portada del libro.
- 4.- El sistema muestra la imagen en un tamaño legible dentro de la vista de detalle. La portada se obtiene de la tabla libro.

**Curso alternativo de eventos:**

- ¿El libro tiene una portada cargada en el sistema? En caso negativo, el sistema muestra una imagen genérica en lugar de la portada, indicando que no fue cargada.

**Requerimientos (RF6.1.2.3):**

- RF6.1.2.3.1: Este caso de uso permite visualizar la portada asociada a un libro, cuando esta se encuentre registrada en el sistema.
- RF6.1.2.3.2: El sistema muestra la portada del libro seleccionado.
- RF6.1.2.3.3: Si no existe portada registrada, el sistema muestra el detalle del libro sin imagen asociada.
- [Interfaz] RF6.1.2.3.4: La interfaz debe mostrar la portada del libro en un tamaño legible dentro de la vista de detalle.
- [Interfaz] RF6.1.2.3.5: La interfaz debe presentar una imagen genérica de reemplazo cuando el libro no tenga portada registrada.

## RF6.2 Visualizar novedades bibliográficas

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF6.2.1; RF6.2.2; RF6.2.3; RF6.2.4; RF6.2.5

**Propósito:** Permitir ejecutar la operación "Visualizar novedades bibliográficas".

**Resumen:** Permite visualizar los libros incorporados más recientemente al catálogo, como novedades bibliográficas.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** Permite visualizar los libros incorporados más recientemente al catálogo, como novedades bibliográficas.

**Curso normal de eventos:**

- 1.- El usuario ingresa a la pantalla P.1 Home y se dirige a la sección de novedades bibliográficas.
- 2.- El sistema carga la sección «Novedades bibliográficas» de la página de inicio. Los datos se obtienen de la tabla libro.
- 3.- El usuario recorre la lista o carrusel de novedades.
- 4.- El sistema muestra la portada, el título y la fecha de incorporación de los libros más recientes.
- 5.- El usuario selecciona una novedad de su interés.
- 6.- El sistema abre la vista de detalle del libro seleccionado en la interfaz P6.2.

**Curso alternativo de eventos:**

- ¿Existen libros incorporados recientemente al catálogo? En caso negativo, el sistema oculta la sección o informa que no existen incorporaciones recientes al catálogo.

**Requerimientos (RF6.2):**

- RF6.2.1: Permite visualizar los libros incorporados más recientemente al catálogo, como novedades bibliográficas.
- RF6.2.2: El sistema muestra las novedades bibliográficas disponibles.
- RF6.2.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF6.2.4: La interfaz debe incluir una sección visible en el catálogo bibliográfico dedicada a mostrar las novedades.
- [Interfaz] RF6.2.5: La interfaz debe mostrar los libros como una lista o carrusel con portada, título y fecha de incorporación al catálogo.

## RF6.3 Consultar bibliotecas disponibles

**Actores:** Usuario del sistema

**Tipo:** Primario

**Referencias:** RF6.3.1; RF6.3.2; RF6.3.3; RF6.3.4; RF6.3.5

**Propósito:** Permitir visualizar el listado de bibliotecas físicas activas de la universidad, sin necesidad de autenticarse.

**Resumen:** Este caso de uso permite visualizar el listado de bibliotecas físicas activas de la universidad, sin necesidad de autenticarse. El sistema muestra el listado de bibliotecas físicas disponibles, permitiendo acceder al catálogo filtrado por biblioteca.

**Precondiciones:** Ninguna: esta funcionalidad es de acceso público y no requiere haber iniciado sesión.

**Postcondiciones:** El sistema muestra el listado de bibliotecas físicas disponibles, permitiendo acceder al catálogo filtrado por biblioteca.

**Curso normal de eventos:**

- 1.- El usuario ingresa a la pantalla P.1 Home y se dirige a la sección de bibliotecas disponibles.
- 2.- El sistema carga la sección «Bibliotecas disponibles» de la página de inicio. Los datos se obtienen de la tabla biblioteca.
- 3.- El usuario revisa las tarjetas de las bibliotecas listadas.
- 4.- El sistema muestra el nombre y la descripción de cada biblioteca física registrada.
- 5.- El usuario selecciona una biblioteca de su interés.
- 6.- El sistema filtra el catálogo reutilizando el filtro de biblioteca de la interfaz P6.1.

**Curso alternativo de eventos:**

- ¿Existen bibliotecas físicas registradas para mostrar? En caso negativo, el sistema informa que aún no existen bibliotecas físicas registradas en el sistema.

**Requerimientos (RF6.3):**

- RF6.3.1: Este caso de uso permite visualizar el listado de bibliotecas físicas activas de la universidad, sin necesidad de autenticarse.
- RF6.3.2: El sistema muestra el listado de bibliotecas físicas disponibles, permitiendo acceder al catálogo filtrado por biblioteca.
- RF6.3.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF6.3.4: La interfaz debe presentar las bibliotecas como tarjetas (cards) con nombre y descripción, en la pantalla de inicio del sistema.
- [Interfaz] RF6.3.5: La interfaz debe permitir seleccionar una biblioteca para acceder al catálogo bibliográfico filtrado por esa biblioteca.
