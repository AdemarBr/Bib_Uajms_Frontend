# RF13 — Generar reportes y dashboards

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/reportes`.

## RF13 Generar Reportes y Dashboards (caso de uso padre)

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.1; RF13.2; RF13.3; RF13.4; RF13.5; RF13.6; RF13.7; RF13.8; RF13.9; RF13.10; RF13.11; RF13.12; RF13.13

**Propósito:** Administrar de forma integral la funcionalidad "Generar Reportes y Dashboards" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite visualizar dashboard general; visualizar dashboard de uso del catálogo; visualizar dashboard de préstamos; visualizar dashboard de reservas; visualizar dashboard de tesis; filtrar información estadística; generar reporte de libros más consultados; generar reporte de préstamos; generar reporte de reservas; generar reporte de tesis más consultadas; generar reporte por facultad; generar reporte por carrera; exportar reportes.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con alguno de los siguientes roles habilitados: Administrador general del sistema, Administrador de biblioteca, Bibliotecario.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Generar Reportes y Dashboards" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde el menú lateral del sistema, la opción «Reportes y dashboards», que lo lleva a la interfaz P13.1 a P13.11 según el caso de uso hijo que corresponda.
- 2.- El sistema despliega la interfaz correspondiente (P13.1 a P13.11) con las opciones específicas de «Reportes y dashboards».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en las tablas prestamo, reserva, libro, tesis y registro_uso.

## RF13.1 Visualizar dashboard general

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.1.1; RF13.1.2; RF13.1.3; RF13.1.4; RF13.1.5

**Propósito:** Permitir visualizar un panel general con indicadores principales sobre el uso del sistema bibliotecario.

**Resumen:** Este caso de uso permite visualizar un panel general con indicadores principales sobre el uso del sistema bibliotecario. El sistema muestra el dashboard general con los indicadores disponibles.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra el dashboard general con los indicadores disponibles.

**Curso normal de eventos:**

- 1.- El actor accede a la sección «Reportes y dashboards» y selecciona «Dashboard general» en el grupo «Dashboards» del submenú lateral.
- 2.- El sistema abre la interfaz P13.1 correspondiente al dashboard general.
- 3.- El actor compara los totales de ejemplares, préstamos activos, reservas pendientes y tesis registradas.
- 4.- El sistema muestra los indicadores como tarjetas y gráfico resumido: ejemplares totales, préstamos activos, reservas pendientes, tesis registradas y préstamos por mes de los últimos 6 meses. Los datos se obtienen de las tablas ejemplar, prestamo, reserva y tesis.
- 5.- El actor acota el periodo con el filtro «Periodo» para observar la evolución del conjunto.
- 6.- El sistema recalcula los indicadores según los criterios seleccionados, sin ofrecer opción de exportación en los dashboards.

**Curso alternativo de eventos:**

- ¿Existen datos registrados en los módulos del sistema para el periodo consultado? En caso negativo, el sistema presenta el panel sin movimientos para el periodo elegido.

**Requerimientos (RF13.1):**

- RF13.1.1: Este caso de uso permite visualizar un panel general con indicadores principales sobre el uso del sistema bibliotecario.
- RF13.1.2: El sistema muestra el dashboard general con los indicadores disponibles.
- RF13.1.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF13.1.4: La interfaz debe organizar los indicadores principales en un panel único con tarjetas o gráficos resumidos (ejemplares, préstamos, reservas y tesis).
- [Interfaz] RF13.1.5: La interfaz debe mostrar las tarjetas «Ejemplares totales», «Préstamos activos», «Reservas pendientes» y «Tesis registradas», el gráfico «Préstamos por mes (últimos 6 meses)» y el filtro desplegable «Periodo».

## RF13.2 Visualizar dashboard de uso del catálogo

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.2.1; RF13.2.2; RF13.2.3; RF13.2.4

**Propósito:** Permitir visualizar indicadores relacionados con el uso del catálogo bibliográfico, como consultas realizadas y libros más consultados.

**Resumen:** Este caso de uso permite visualizar indicadores relacionados con el uso del catálogo bibliográfico, como consultas realizadas y libros más consultados. El sistema muestra los indicadores relacionados con el uso del catálogo bibliográfico.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra los indicadores relacionados con el uso del catálogo bibliográfico.

**Curso normal de eventos:**

- 1.- El actor accede a la sección «Reportes y dashboards» y selecciona «Uso del catálogo» en el grupo «Dashboards» del submenú lateral.
- 2.- El sistema abre la interfaz P13.2 correspondiente al dashboard de uso del catálogo.
- 3.- El actor observa qué títulos concentran las búsquedas.
- 4.- El sistema muestra los indicadores como tarjetas y gráfico resumido: libros en catálogo, consultas del mes, ítems más consultados, cobertura por facultad y consultas al catálogo por semana. Los datos se obtienen de las tablas libro, ejemplar, biblioteca, facultad y registro_uso.
- 5.- El actor acota el periodo con el filtro «Periodo» para afinar la lectura.
- 6.- El sistema recalcula los indicadores según los criterios seleccionados, sin ofrecer opción de exportación en los dashboards.

**Curso alternativo de eventos:**

- ¿Se registraron búsquedas en el catálogo durante el periodo consultado? En caso negativo, el sistema señala que no se registraron búsquedas en ese periodo.

**Requerimientos (RF13.2):**

- RF13.2.1: Este caso de uso permite visualizar indicadores relacionados con el uso del catálogo bibliográfico, como consultas realizadas y libros más consultados.
- RF13.2.2: El sistema muestra los indicadores relacionados con el uso del catálogo bibliográfico.
- [Interfaz] RF13.2.3: La interfaz debe mostrar los indicadores de uso del catálogo como tarjetas o gráficos resumidos (libros en catálogo, consultas del mes, ítems más consultados, cobertura por facultad).
- [Interfaz] RF13.2.4: La interfaz debe mostrar las tarjetas «Libros en catálogo», «Consultas del mes», «Ítems más consultados» y «Cobertura por facultad», el gráfico «Consultas al catálogo por semana» y el filtro desplegable «Periodo».

## RF13.3 Visualizar dashboard de préstamos

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.3.1; RF13.3.2; RF13.3.3; RF13.3.4

**Propósito:** Permitir visualizar indicadores relacionados con los préstamos en sala y préstamos a domicilio registrados en el sistema.

**Resumen:** Este caso de uso permite visualizar indicadores relacionados con los préstamos en sala y préstamos a domicilio registrados en el sistema. El sistema muestra los indicadores relacionados con préstamos bibliotecarios.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra los indicadores relacionados con préstamos bibliotecarios.

**Curso normal de eventos:**

- 1.- El actor accede a la sección «Reportes y dashboards» y selecciona «Préstamos» en el grupo «Dashboards» del submenú lateral.
- 2.- El sistema abre la interfaz P13.3 correspondiente al dashboard de préstamos.
- 3.- El actor contrasta los préstamos vigentes con los préstamos con retraso.
- 4.- El sistema muestra los indicadores como tarjetas y gráfico resumido: préstamos del mes, préstamos vigentes, devoluciones a tiempo, préstamos con retraso y préstamos por tipo de usuario. Los datos se obtienen de las tablas prestamo, devolucion, usuario, rol y tipo_usuario.
- 5.- El actor acota el periodo con el filtro «Periodo» para ubicar la carga de trabajo.
- 6.- El sistema recalcula los indicadores según los criterios seleccionados, sin ofrecer opción de exportación en los dashboards.

**Curso alternativo de eventos:**

- ¿Existen préstamos registrados en el periodo consultado? En caso negativo, el sistema señala que no hubo movimientos de préstamo en ese periodo.

**Requerimientos (RF13.3):**

- RF13.3.1: Este caso de uso permite visualizar indicadores relacionados con los préstamos en sala y préstamos a domicilio registrados en el sistema.
- RF13.3.2: El sistema muestra los indicadores relacionados con préstamos bibliotecarios.
- [Interfaz] RF13.3.3: La interfaz debe mostrar los indicadores de préstamos como tarjetas o gráficos resumidos (préstamos del mes, préstamos vigentes, devoluciones a tiempo, préstamos con retraso).
- [Interfaz] RF13.3.4: La interfaz debe mostrar las tarjetas «Préstamos del mes», «Préstamos vigentes», «Devoluciones a tiempo» y «Préstamos con retraso», el gráfico «Préstamos por tipo de usuario» y el filtro desplegable «Periodo».

## RF13.4 Visualizar dashboard de reservas

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.4.1; RF13.4.2; RF13.4.3; RF13.4.4

**Propósito:** Permitir visualizar indicadores relacionados con las reservas de libros registradas en el sistema.

**Resumen:** Este caso de uso permite visualizar indicadores relacionados con las reservas de libros registradas en el sistema. El sistema muestra los indicadores estadísticos de reservas.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra los indicadores estadísticos de reservas.

**Curso normal de eventos:**

- 1.- El actor accede a la sección «Reportes y dashboards» y selecciona «Reservas» en el grupo «Dashboards» del submenú lateral.
- 2.- El sistema abre la interfaz P13.4 correspondiente al dashboard de reservas.
- 3.- El actor revisa cuántas reservas siguen pendientes de atención.
- 4.- El sistema muestra los indicadores como tarjetas y gráfico resumido: reservas del mes, reservas pendientes, reservas atendidas, tasa de cumplimiento y reservas por biblioteca. Los datos se obtienen de las tablas reserva, ejemplar y biblioteca.
- 5.- El actor acota el periodo con el filtro «Periodo» para ver la demanda de reservas.
- 6.- El sistema recalcula los indicadores según los criterios seleccionados, sin ofrecer opción de exportación en los dashboards.

**Curso alternativo de eventos:**

- ¿Existen reservas registradas en el periodo consultado? En caso negativo, el sistema señala que no se registraron reservas en ese periodo.

**Requerimientos (RF13.4):**

- RF13.4.1: Este caso de uso permite visualizar indicadores relacionados con las reservas de libros registradas en el sistema.
- RF13.4.2: El sistema muestra los indicadores estadísticos de reservas.
- [Interfaz] RF13.4.3: La interfaz debe mostrar los indicadores de reservas como tarjetas o gráficos resumidos (reservas del mes, reservas pendientes, reservas atendidas, tasa de cumplimiento).
- [Interfaz] RF13.4.4: La interfaz debe mostrar las tarjetas «Reservas del mes», «Reservas pendientes», «Reservas atendidas» y «Tasa de cumplimiento», el gráfico «Reservas por biblioteca» y el filtro desplegable «Periodo».

## RF13.5 Visualizar dashboard de tesis

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.5.1; RF13.5.2; RF13.5.3; RF13.5.4

**Propósito:** Permitir visualizar indicadores relacionados con las tesis digitales registradas y consultadas dentro del sistema.

**Resumen:** Este caso de uso permite visualizar indicadores relacionados con las tesis digitales registradas y consultadas dentro del sistema. El sistema muestra los indicadores estadísticos relacionados con tesis digitales.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra los indicadores estadísticos relacionados con tesis digitales.

**Curso normal de eventos:**

- 1.- El actor accede a la sección «Reportes y dashboards» y selecciona «Tesis» en el grupo «Dashboards» del submenú lateral.
- 2.- El sistema abre la interfaz P13.5 correspondiente al dashboard de tesis.
- 3.- El actor identifica qué carreras concentran las consultas de tesis.
- 4.- El sistema muestra los indicadores como tarjetas y gráfico resumido: tesis registradas, tesis digitalizadas, consultas del mes, documentos abiertos del mes y tesis más consultadas por carrera. Los datos se obtienen de las tablas tesis, documento_tesis, carrera y registro_uso.
- 5.- El actor acota con los filtros «Periodo» y «Facultad» para comparar cohortes.
- 6.- El sistema recalcula los indicadores según los criterios seleccionados, sin ofrecer opción de exportación en los dashboards.

**Curso alternativo de eventos:**

- ¿Existen tesis registradas o consultadas en el periodo consultado? En caso negativo, el sistema señala que no hubo consultas de tesis en ese periodo.

**Requerimientos (RF13.5):**

- RF13.5.1: Este caso de uso permite visualizar indicadores relacionados con las tesis digitales registradas y consultadas dentro del sistema.
- RF13.5.2: El sistema muestra los indicadores estadísticos relacionados con tesis digitales.
- [Interfaz] RF13.5.3: La interfaz debe mostrar los indicadores de tesis como tarjetas o gráficos resumidos (total de tesis registradas, tesis más consultadas por carrera).
- [Interfaz] RF13.5.4: La interfaz debe mostrar las tarjetas «Tesis registradas», «Tesis digitalizadas», «Consultas del mes» y «Documentos abiertos del mes», el gráfico «Tesis más consultadas por carrera» y los filtros desplegables «Periodo» y «Facultad».

## RF13.6 Filtrar información estadística

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.6.1; RF13.6.2; RF13.6.3; RF13.6.4

**Propósito:** Permitir aplicar filtros a la información estadística mostrada en reportes o dashboards, según criterios como periodo, facultad, carrera, biblioteca, tipo de recurso o estado.

**Resumen:** Este caso de uso permite aplicar filtros a la información estadística mostrada en reportes o dashboards, según criterios como periodo, facultad, carrera, biblioteca, tipo de recurso o estado. El sistema muestra la información estadística filtrada de acuerdo con los criterios seleccionados por el actor.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra la información estadística filtrada de acuerdo con los criterios seleccionados por el actor.

**Curso normal de eventos:**

- 1.- El actor ubica los filtros junto al dashboard o reporte que se encuentra consultando.
- 2.- El sistema muestra únicamente los filtros definidos para la pantalla activa (periodo, facultad, carrera, biblioteca o estado, según el dashboard o reporte).
- 3.- El actor selecciona los criterios estadísticos que desea aplicar.
- 4.- El sistema combina los criterios seleccionados para delimitar la información.
- 5.- El actor aplica los criterios elegidos sobre el panel activo.
- 6.- El sistema recalcula la información estadística mostrada en la pantalla activa. Los filtros utilizan las tablas facultad, carrera y biblioteca, según la pantalla activa.

**Curso alternativo de eventos:**

- ¿La combinación de filtros seleccionada devuelve información estadística? En caso negativo, el sistema informa que no existe información para los criterios seleccionados y permite limpiar los filtros aplicados.

**Requerimientos (RF13.6):**

- RF13.6.1: Este caso de uso permite aplicar filtros a la información estadística mostrada en reportes o dashboards, según criterios como periodo, facultad, carrera, biblioteca, tipo de recurso o estado.
- RF13.6.2: El sistema muestra la información estadística filtrada de acuerdo con los criterios seleccionados por el actor.
- [Interfaz] RF13.6.3: La interfaz debe presentar los filtros disponibles (periodo, facultad, carrera, biblioteca, tipo de recurso, estado) como controles desplegables, visibles junto al reporte o dashboard.
- [Interfaz] RF13.6.4: El filtro «Periodo» debe ofrecer las opciones «Último mes», «Último trimestre», «Semestre actual», «Gestión actual» y «Rango personalizado» (desde–hasta); el periodo limita el cálculo a los registros cuya fecha de consulta, préstamo o reserva cae dentro del rango elegido.

## RF13.7 Generar reporte de libros más consultados

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.7.1; RF13.7.2; RF13.7.3; RF13.7.4; RF13.7.5

**Propósito:** Permitir generar un reporte con los libros que han recibido mayor cantidad de consultas dentro del sistema.

**Resumen:** Este caso de uso permite generar un reporte con los libros que han recibido mayor cantidad de consultas dentro del sistema. El sistema muestra el reporte de libros más consultados.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra el reporte de libros más consultados.

**Curso normal de eventos:**

- 1.- El actor selecciona «Libros más consultados» en el grupo «Reportes» del submenú lateral de «Reportes y dashboards».
- 2.- El sistema abre la interfaz P13.6 con el tipo de reporte ya definido por la pantalla.
- 3.- El actor delimita el periodo y la carrera del ranking.
- 4.- El sistema toma los criterios seleccionados para el cálculo del reporte.
- 5.- El actor hace clic en el botón «Generar reporte» para solicitar el cálculo del ranking de libros.
- 6.- El sistema procesa la información registrada según los criterios aplicados. Los datos se obtienen de las tablas libro y registro_uso.
- 7.- El actor revisa el ranking de libros obtenido.
- 8.- El sistema muestra el reporte como una tabla o gráfico de barras con el título del libro y la cantidad de consultas.

**Curso alternativo de eventos:**

- ¿Existen consultas registradas en el periodo seleccionado? En caso negativo, el sistema indica que no hubo consultas de libros en el periodo elegido.

**Requerimientos (RF13.7):**

- RF13.7.1: Este caso de uso permite generar un reporte con los libros que han recibido mayor cantidad de consultas dentro del sistema.
- RF13.7.2: El sistema muestra el reporte de libros más consultados.
- [Interfaz] RF13.7.3: La interfaz debe mostrar el reporte como una tabla o gráfico de barras con el título del libro y la cantidad de consultas.
- [Interfaz] RF13.7.4: La interfaz debe incluir un botón «Generar reporte» que ejecuta el cálculo con los criterios seleccionados.
- [Interfaz] RF13.7.5: La interfaz debe incluir los filtros desplegables «Periodo» (con las opciones Último mes, Último trimestre, Semestre actual, Gestión actual y Rango personalizado) y «Carrera», y una tabla con las columnas «Título», «Autor», «Consultas» y «Carrera principal».

## RF13.8 Generar reporte de préstamos

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.8.1; RF13.8.2; RF13.8.3; RF13.8.4; RF13.8.5

**Propósito:** Permitir generar un reporte relacionado con los préstamos en sala y préstamos a domicilio registrados en el sistema.

**Resumen:** Este caso de uso permite generar un reporte relacionado con los préstamos en sala y préstamos a domicilio registrados en el sistema. El sistema muestra el reporte de préstamos.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra el reporte de préstamos.

**Curso normal de eventos:**

- 1.- El actor selecciona «Préstamos» en el grupo «Reportes» del submenú lateral de «Reportes y dashboards».
- 2.- El sistema abre la interfaz P13.7 con el tipo de reporte ya definido por la pantalla.
- 3.- El actor delimita el periodo y la biblioteca del reporte.
- 4.- El sistema toma los criterios seleccionados para el cálculo del reporte.
- 5.- El actor hace clic en el botón «Generar reporte» para solicitar el cálculo del reporte de préstamos.
- 6.- El sistema procesa la información registrada según los criterios aplicados. Los datos se obtienen de las tablas prestamo, usuario y ejemplar.
- 7.- El actor revisa el desglose de préstamos obtenido.
- 8.- El sistema muestra el reporte como una tabla o gráfico, diferenciando los préstamos en sala de los préstamos a domicilio.

**Curso alternativo de eventos:**

- ¿Existen préstamos registrados en el periodo seleccionado? En caso negativo, el sistema informa que la biblioteca elegida no movió material en ese periodo.

**Requerimientos (RF13.8):**

- RF13.8.1: Este caso de uso permite generar un reporte relacionado con los préstamos en sala y préstamos a domicilio registrados en el sistema.
- RF13.8.2: El sistema muestra el reporte de préstamos.
- [Interfaz] RF13.8.3: La interfaz debe mostrar el reporte como una tabla o gráfico, diferenciando préstamos en sala y préstamos a domicilio.
- [Interfaz] RF13.8.4: La interfaz debe incluir un botón «Generar reporte» que ejecuta el cálculo con los criterios seleccionados.
- [Interfaz] RF13.8.5: La interfaz debe incluir los filtros desplegables «Periodo» y «Biblioteca», y una tabla con las columnas «Usuario», «Ejemplar», «Tipo» (sala o domicilio), «Fecha de préstamo» y «Estado».

## RF13.9 Generar reporte de reservas

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.9.1; RF13.9.2; RF13.9.3; RF13.9.4; RF13.9.5

**Propósito:** Permitir generar un reporte relacionado con las reservas de libros registradas en el sistema.

**Resumen:** Este caso de uso permite generar un reporte relacionado con las reservas de libros registradas en el sistema. El sistema muestra el reporte de reservas.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra el reporte de reservas.

**Curso normal de eventos:**

- 1.- El actor selecciona «Reservas» en el grupo «Reportes» del submenú lateral de «Reportes y dashboards».
- 2.- El sistema abre la interfaz P13.8 con el tipo de reporte ya definido por la pantalla.
- 3.- El actor delimita el periodo y el estado de las reservas.
- 4.- El sistema toma los criterios seleccionados para el cálculo del reporte.
- 5.- El actor hace clic en el botón «Generar reporte» para solicitar el conteo de reservas por estado.
- 6.- El sistema procesa la información registrada según los criterios aplicados. Los datos se obtienen de la tabla reserva.
- 7.- El actor revisa el conteo de reservas por estado.
- 8.- El sistema muestra el reporte como una tabla o gráfico con la cantidad de reservas agrupadas por estado.

**Curso alternativo de eventos:**

- ¿Existen reservas registradas en el periodo seleccionado? En caso negativo, el sistema informa que no se solicitaron reservas bajo esos criterios.

**Requerimientos (RF13.9):**

- RF13.9.1: Este caso de uso permite generar un reporte relacionado con las reservas de libros registradas en el sistema.
- RF13.9.2: El sistema muestra el reporte de reservas.
- [Interfaz] RF13.9.3: La interfaz debe mostrar el reporte como una tabla o gráfico con la cantidad de reservas por estado.
- [Interfaz] RF13.9.4: La interfaz debe incluir un botón «Generar reporte» que ejecuta el cálculo con los criterios seleccionados.
- [Interfaz] RF13.9.5: La interfaz debe incluir los filtros desplegables «Periodo» y «Estado», y una tabla con las columnas «Estado» y «Cantidad».

## RF13.10 Generar reporte de tesis más consultadas

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.10.1; RF13.10.2; RF13.10.3; RF13.10.4; RF13.10.5

**Propósito:** Permitir generar un reporte con las tesis digitales más consultadas dentro del sistema.

**Resumen:** Este caso de uso permite generar un reporte con las tesis digitales más consultadas dentro del sistema. El sistema muestra el reporte de tesis más consultadas.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra el reporte de tesis más consultadas.

**Curso normal de eventos:**

- 1.- El actor selecciona «Tesis más consultadas» en el grupo «Reportes» del submenú lateral de «Reportes y dashboards».
- 2.- El sistema abre la interfaz P13.9 con el tipo de reporte ya definido por la pantalla.
- 3.- El actor delimita el periodo y la carrera del ranking.
- 4.- El sistema toma los criterios seleccionados para el cálculo del reporte.
- 5.- El actor hace clic en el botón «Generar reporte» para solicitar el cálculo del ranking de tesis.
- 6.- El sistema procesa la información registrada según los criterios aplicados. Los datos se obtienen de las tablas tesis y registro_uso.
- 7.- El actor revisa el ranking de tesis obtenido.
- 8.- El sistema muestra el reporte como una tabla o gráfico de barras con el título de la tesis y la cantidad de consultas.

**Curso alternativo de eventos:**

- ¿Existen consultas de tesis registradas en el periodo seleccionado? En caso negativo, el sistema indica que no hubo consultas de tesis en el periodo elegido.

**Requerimientos (RF13.10):**

- RF13.10.1: Este caso de uso permite generar un reporte con las tesis digitales más consultadas dentro del sistema.
- RF13.10.2: El sistema muestra el reporte de tesis más consultadas.
- [Interfaz] RF13.10.3: La interfaz debe mostrar el reporte como una tabla o gráfico de barras con el título de la tesis y la cantidad de consultas.
- [Interfaz] RF13.10.4: La interfaz debe incluir un botón «Generar reporte» que ejecuta el cálculo con los criterios seleccionados.
- [Interfaz] RF13.10.5: La interfaz debe incluir los filtros desplegables «Periodo» y «Carrera», y una tabla con las columnas «Título», «Autor», «Consultas» y «Documentos abiertos».

## RF13.11 Generar reporte por facultad

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.11.1; RF13.11.2; RF13.11.3; RF13.11.4; RF13.11.5

**Propósito:** Permitir generar reportes agrupados o filtrados por facultad, relacionados con libros, tesis, consultas, reservas o préstamos.

**Resumen:** Este caso de uso permite generar reportes agrupados o filtrados por facultad, relacionados con libros, tesis, consultas, reservas o préstamos. El sistema muestra el reporte agrupado o filtrado por facultad.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra el reporte agrupado o filtrado por facultad.

**Curso normal de eventos:**

- 1.- El actor selecciona «Por facultad» en el grupo «Reportes» del submenú lateral de «Reportes y dashboards».
- 2.- El sistema abre la interfaz P13.10 con el tipo de reporte ya definido por la pantalla.
- 3.- El actor selecciona la facultad sobre la que desea el reporte o deja la opción «Todas» para ver todas las facultades agrupadas.
- 4.- El sistema presenta las facultades registradas en un campo desplegable. Los datos se obtienen de la tabla facultad.
- 5.- El actor hace clic en el botón «Generar reporte» para solicitar el cálculo agrupado por facultad.
- 6.- El sistema procesa la información correspondiente a la facultad seleccionada. Los datos se obtienen de las tablas facultad, carrera, prestamo, reserva y tesis.
- 7.- El actor revisa el resultado agrupado por facultad.
- 8.- El sistema muestra el reporte agrupado o filtrado por facultad en una tabla o gráfico.

**Curso alternativo de eventos:**

- ¿La facultad seleccionada registra información en el periodo consultado? En caso negativo, el sistema indica que la facultad elegida no registra información en ese periodo.

**Requerimientos (RF13.11):**

- RF13.11.1: Este caso de uso permite generar reportes agrupados o filtrados por facultad, relacionados con libros, tesis, consultas, reservas o préstamos.
- RF13.11.2: El sistema muestra el reporte agrupado o filtrado por facultad.
- [Interfaz] RF13.11.3: La interfaz debe presentar un campo de selección (desplegable) con las facultades registradas, mostrando el reporte correspondiente en una tabla o gráfico.
- [Interfaz] RF13.11.4: La interfaz debe incluir un botón «Generar reporte» que ejecuta el cálculo con los criterios seleccionados.
- [Interfaz] RF13.11.5: La interfaz debe incluir los filtros desplegables «Periodo» y «Facultad» (con la opción «Todas»), y una tabla con las columnas «Facultad», «Préstamos», «Reservas» y «Tesis registradas».

## RF13.12 Generar reporte por carrera

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.12.1; RF13.12.2; RF13.12.3; RF13.12.4; RF13.12.5

**Propósito:** Permitir generar reportes agrupados o filtrados por carrera, relacionados con tesis, consultas, reservas, préstamos o uso de material bibliográfico.

**Resumen:** Este caso de uso permite generar reportes agrupados o filtrados por carrera, relacionados con tesis, consultas, reservas, préstamos o uso de material bibliográfico. El sistema muestra el reporte agrupado o filtrado por carrera.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema muestra el reporte agrupado o filtrado por carrera.

**Curso normal de eventos:**

- 1.- El actor selecciona «Por carrera» en el grupo «Reportes» del submenú lateral de «Reportes y dashboards».
- 2.- El sistema abre la interfaz P13.11 con el tipo de reporte ya definido por la pantalla.
- 3.- El actor selecciona la carrera sobre la que desea el reporte o deja la opción «Todas» para ver todas las carreras agrupadas.
- 4.- El sistema presenta las carreras registradas en un campo desplegable. Los datos se obtienen de la tabla carrera.
- 5.- El actor hace clic en el botón «Generar reporte» para solicitar el cálculo agrupado por carrera.
- 6.- El sistema procesa la información correspondiente a la carrera seleccionada. Los datos se obtienen de las tablas carrera, prestamo, reserva y tesis.
- 7.- El actor revisa el resultado agrupado por carrera.
- 8.- El sistema muestra el reporte agrupado o filtrado por carrera en una tabla o gráfico.

**Curso alternativo de eventos:**

- ¿La carrera seleccionada registra información en el periodo consultado? En caso negativo, el sistema indica que la carrera elegida no registra información en ese periodo.

**Requerimientos (RF13.12):**

- RF13.12.1: Este caso de uso permite generar reportes agrupados o filtrados por carrera, relacionados con tesis, consultas, reservas, préstamos o uso de material bibliográfico.
- RF13.12.2: El sistema muestra el reporte agrupado o filtrado por carrera.
- [Interfaz] RF13.12.3: La interfaz debe presentar un campo de selección (desplegable) con las carreras registradas, mostrando el reporte correspondiente en una tabla o gráfico.
- [Interfaz] RF13.12.4: La interfaz debe incluir un botón «Generar reporte» que ejecuta el cálculo con los criterios seleccionados.
- [Interfaz] RF13.12.5: La interfaz debe incluir los filtros desplegables «Periodo», «Facultad» y «Carrera» (con la opción «Todas»), y una tabla con las columnas «Carrera», «Préstamos», «Reservas» y «Tesis registradas».

## RF13.13 Exportar reportes

**Actores:** Administrador general del sistema, Administrador de biblioteca, Bibliotecario

**Tipo:** Primario

**Referencias:** RF13.13.1; RF13.13.2; RF13.13.3

**Propósito:** Permitir exportar un reporte generado por el sistema en un formato definido, para su almacenamiento, revisión o presentación posterior.

**Resumen:** Este caso de uso permite exportar un reporte generado por el sistema en un formato definido, para su almacenamiento, revisión o presentación posterior. El sistema genera el archivo del reporte exportado en el formato disponible.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema, Administrador de biblioteca o Bibliotecario.

**Postcondiciones:** El sistema genera el archivo del reporte exportado en el formato disponible.

**Curso normal de eventos:**

- 1.- El actor genera previamente el reporte en la pantalla correspondiente del módulo.
- 2.- El sistema muestra los botones de exportación junto al resultado del reporte generado.
- 3.- El actor hace clic en «Exportar PDF» o en «Exportar Excel» según el formato de salida que necesite.
- 4.- El sistema identifica el formato asociado al botón accionado: PDF o Excel.
- 5.- El actor descarga el archivo generado.
- 6.- El sistema genera el archivo con el contenido del reporte y los filtros aplicados.

**Curso alternativo de eventos:**

- ¿El reporte generado contiene información para exportar? En caso negativo, el sistema impide la exportación e informa que el reporte no contiene datos para ser exportados.
- Interfaces

**Requerimientos (RF13.13):**

- RF13.13.1: Este caso de uso permite exportar un reporte generado por el sistema en un formato definido, para su almacenamiento, revisión o presentación posterior.
- RF13.13.2: El sistema genera el archivo del reporte exportado en el formato disponible.
- [Interfaz] RF13.13.3: La interfaz debe incluir, junto a cada reporte, los botones «Exportar PDF» y «Exportar Excel», uno por cada formato disponible.
