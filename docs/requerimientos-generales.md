# Requerimientos generales del sistema

Fuente: documento del proyecto. Incluye los requerimientos funcionales y no funcionales generales y los requerimientos comunes a todo el sistema.

## Listado de requerimientos funcionales y no funcionales
- Para la definición de los requisitos funcionales y no funcionales se consideraron los procesos del negocio identificados en la Iteración 1, el alcance del sistema, los casos de uso del sistema definidos en la Iteración 2 y las necesidades identificadas en las entrevistas realizadas en la Biblioteca Central UAJMS.
- Los requisitos se expresan en lenguaje natural, procurando que sean claros, verificables, factibles, consistentes y relacionados con los objetivos del sistema web de administración y gestión de libros y tesis.

### Requisitos funcionales

### Ambiente físico

- RF01. El sistema debe funcionar bajo una arquitectura web cliente-servidor.
- RF02. El sistema debe poder ser utilizado desde equipos cliente conectados a la red institucional o a internet, según la configuración definida para su despliegue.
- RF03. El sistema debe ejecutarse desde navegadores web modernos sin requerir instalación de software adicional en el equipo del usuario final.
- RF04. El sistema debe estar preparado para operar en un servidor institucional o en una infraestructura definida por la universidad.

### Interfaces

- RF01. El sistema debe integrarse con un servicio de validación institucional para verificar a estudiantes y docentes; el personal interno se valida con las credenciales locales del propio sistema.
- RF02. El sistema no debe acceder directamente a la base de datos interna del sistema académico institucional.
- RF03. El sistema debe intercambiar únicamente los datos mínimos necesarios para validar la vigencia del usuario institucional.
- RF04. El sistema debe permitir importar libros o información bibliográfica mediante archivos estructurados, de acuerdo con el formato definido para el sistema.
- RF05. El sistema debe permitir exportar reportes en formatos definidos por el proyecto, como PDF, Excel u otro formato compatible.

### Usuarios y factores humanos

- RF01. El sistema debe presentar una interfaz clara, ordenada y amigable para estudiantes, docentes y personal bibliotecario.
- RF02. El sistema debe organizar sus opciones de acuerdo con el rol del usuario autenticado.
- RF03. El sistema debe mostrar únicamente las funcionalidades permitidas para cada tipo de usuario.
- RF04. El sistema debe utilizar términos comprensibles para usuarios no especializados en informática.
- RF05. El sistema debe permitir que los usuarios consulten libros y tesis de forma sencilla mediante búsquedas y filtros.
- RF06. El sistema debe reducir la complejidad de búsqueda del catálogo bibliográfico actual, ofreciendo una navegación más intuitiva.
- RF07. El sistema debe ser fácil de usar para estudiantes, docentes, bibliotecarios y administradores.
- RF08. El sistema debe presentar formularios claros para el registro y actualización de información.
- RF09. El sistema debe proporcionar mensajes de confirmación, error o advertencia cuando corresponda.
- RF10. El sistema debe facilitar la búsqueda de libros y tesis mediante criterios y filtros comprensibles.
- RF11. El sistema debe mostrar de manera clara la disponibilidad y ubicación física de los libros.

### Funcionalidad

- Comprende las funciones que el sistema debe realizar, organizadas por módulo del negocio para facilitar su trazabilidad con los casos de uso definidos en la Iteración 2.

### Autenticación y acceso al sistema

- RF01. El sistema debe permitir iniciar sesión utilizando credenciales institucionales.
- RF02. El sistema debe validar al usuario institucional mediante un servicio de validación proporcionado por la universidad.
- RF03. El sistema debe registrar los datos mínimos del usuario validado cuando este no exista previamente en el sistema bibliotecario.
- RF04. El sistema debe permitir consultar el perfil del usuario autenticado.
- RF05. El sistema debe permitir cerrar sesión de forma segura.
- RF06. El sistema debe impedir el acceso a funcionalidades restringidas a usuarios que no se encuentren autenticados.

### Administración de usuarios y roles

- RF07. El sistema debe permitir registrar usuarios internos del sistema bibliotecario.
- RF08. El sistema debe permitir consultar los usuarios registrados en el sistema.
- RF09. El sistema debe permitir buscar usuarios registrados mediante criterios de búsqueda.
- RF10. El sistema debe permitir aplicar filtros de usuarios por rol, estado, tipo de usuario o biblioteca asignada.
- RF11. El sistema debe permitir actualizar los datos permitidos de un usuario registrado.
- RF12. El sistema debe permitir asignar roles a los usuarios internos.
- RF13. El sistema debe permitir asignar una biblioteca responsable a los usuarios internos cuando corresponda.
- RF14. El sistema debe permitir activar usuarios registrados.
- RF15. El sistema debe permitir desactivar usuarios registrados.
- RF16. El sistema debe permitir consultar los permisos asociados a cada rol del sistema.
- RF17. El sistema debe restringir las funcionalidades disponibles según el rol asignado al usuario.

### Administración de bibliotecas, facultades y carreras

- RF18. El sistema debe permitir registrar bibliotecas físicas.
- RF19. El sistema debe permitir actualizar los datos de bibliotecas físicas registradas.
- RF20. El sistema debe permitir registrar facultades.
- RF21. El sistema debe permitir actualizar los datos de facultades registradas.
- RF22. El sistema debe permitir registrar carreras.
- RF23. El sistema debe permitir actualizar los datos de carreras registradas.
- RF24. El sistema debe permitir consultar bibliotecas, facultades y carreras registradas.
- RF25. El sistema debe permitir utilizar bibliotecas, facultades y carreras como datos de referencia en libros, ejemplares, tesis, usuarios, reservas y reportes.

### Administración del catálogo de libros

- RF26. El sistema debe permitir registrar libros en el catálogo bibliográfico.
- RF27. El sistema debe permitir consultar libros registrados.
- RF28. El sistema debe permitir buscar libros registrados mediante criterios bibliográficos.
- RF29. El sistema debe permitir aplicar filtros de libros registrados por biblioteca, facultad, autor, materia, estado, clasificación u otros criterios definidos.
- RF30. El sistema debe permitir actualizar los datos de un libro registrado.
- RF31. El sistema debe permitir desactivar libros registrados.
- RF32. El sistema debe permitir activar nuevamente un libro desactivado.
- RF33. El sistema debe permitir consultar el historial de cambios de un libro registrado.
- RF34. El sistema debe permitir registrar como parte del libro datos bibliográficos como título, autor, editorial, materia, clasificación Dewey, ISBN, portada y demás datos necesarios para su identificación.

### Administración de ejemplares y ubicación física

- RF35. El sistema debe permitir registrar ejemplares físicos de libros.
- RF36. El sistema debe permitir consultar ejemplares registrados.
- RF37. El sistema debe permitir buscar ejemplares de libros mediante criterios de búsqueda.
- RF38. El sistema debe permitir aplicar filtros de ejemplares por biblioteca física, facultad, estado, disponibilidad o ubicación.
- RF39. El sistema debe permitir actualizar los datos de un ejemplar registrado.
- RF40. El sistema debe permitir asignar un código de ejemplar.
- RF41. El sistema debe permitir actualizar el estado del ejemplar.
- RF42. El sistema debe permitir consultar la disponibilidad del ejemplar.
- RF43. El sistema debe permitir consultar la ubicación física del ejemplar.
- RF44. El sistema debe permitir identificar la ubicación del material considerando la biblioteca física y la clasificación Dewey registrada.

### Consulta del catálogo bibliográfico

- RF45. El sistema debe permitir consultar el catálogo bibliográfico.
- RF46. El sistema debe permitir buscar material bibliográfico por criterios como título, autor, materia, biblioteca, facultad o clasificación Dewey.
- RF47. El sistema debe permitir aplicar filtros de búsqueda bibliográfica.
- RF48. El sistema debe permitir visualizar el detalle del libro seleccionado.
- RF49. El sistema debe permitir visualizar la portada del libro cuando se encuentre registrada.
- RF50. El sistema debe permitir consultar la disponibilidad del libro o sus ejemplares.
- RF51. El sistema debe permitir consultar la ubicación física del libro.
- RF52. El sistema debe permitir visualizar novedades bibliográficas publicadas.
- RF53. El sistema debe permitir la consulta pública del catálogo bibliográfico sin autenticación obligatoria.
- RF54. El sistema debe permitir consultar el listado de bibliotecas físicas disponibles desde el catálogo bibliográfico.

### Reservas de libros

- RF55. El sistema debe permitir que un usuario académico autenticado seleccione un libro para reserva.
- RF56. El sistema debe verificar la disponibilidad del libro antes de registrar una reserva.
- RF57. El sistema debe permitir registrar la reserva de un libro.
- RF58. El sistema debe permitir consultar el estado de una reserva.
- RF59. El sistema debe permitir cancelar una reserva realizada por el usuario académico cuando el estado de la reserva lo permita.
- RF60. El sistema debe asociar cada reserva al usuario académico autenticado que la realizó.
- RF61. El sistema debe impedir que un usuario visitante realice reservas.

### Administración de reservas

- RF62. El sistema debe permitir consultar reservas registradas.
- RF63. El sistema debe permitir consultar reservas por biblioteca.
- RF64. El sistema debe permitir confirmar una reserva.
- RF65. El sistema debe permitir rechazar una reserva.
- RF66. El sistema debe permitir cancelar una reserva de forma administrativa.
- RF67. El sistema debe permitir actualizar el estado de una reserva.
- RF68. El sistema debe permitir consultar el historial de reservas.
- RF69. El sistema debe permitir que el bibliotecario o administrador de biblioteca gestione reservas según su ámbito de responsabilidad.
- RF70. El sistema debe permitir atender una reserva confirmada cuando el usuario se presenta en la biblioteca, derivando al registro del préstamo en sala o a domicilio con los datos de la reserva.

### Préstamo en sala

- RF71. El sistema debe permitir registrar préstamos en sala.
- RF72. El sistema debe permitir verificar los datos institucionales del usuario antes de registrar un préstamo en sala.
- RF73. El sistema debe permitir consultar la disponibilidad del ejemplar antes de registrar el préstamo en sala.
- RF74. El sistema debe permitir seleccionar el ejemplar que será utilizado en sala.
- RF75. El sistema debe actualizar la disponibilidad del ejemplar después de registrar el préstamo en sala.
- RF76. El sistema debe permitir consultar préstamos en sala vigentes.
- RF77. El sistema debe registrar que el préstamo en sala corresponde únicamente al uso del material dentro de los ambientes de la biblioteca.
- RF78. El sistema debe permitir cancelar el registro de un préstamo en sala antes de confirmarlo, sin registrar el préstamo ni modificar la disponibilidad del ejemplar.

### Préstamo a domicilio

- RF79. El sistema debe permitir registrar préstamos a domicilio.
- RF80. El sistema debe permitir verificar los datos institucionales del usuario antes de registrar un préstamo a domicilio.
- RF81. El sistema debe permitir consultar la disponibilidad del ejemplar antes de registrar el préstamo a domicilio.
- RF82. El sistema debe validar si el ejemplar puede salir a domicilio.
- RF83. El sistema debe permitir seleccionar el ejemplar que será prestado a domicilio.
- RF84. El sistema debe permitir asignar la fecha de devolución del préstamo a domicilio.
- RF85. El sistema debe actualizar la disponibilidad del ejemplar después de registrar el préstamo a domicilio.
- RF86. El sistema debe permitir consultar préstamos a domicilio vigentes.
- RF87. El sistema debe permitir ampliar el plazo de un préstamo a domicilio, registrando la nueva fecha límite de devolución junto con la fecha anterior.
- RF88. El sistema debe impedir el préstamo a domicilio de ejemplares configurados únicamente para consulta en sala.
- RF89. El sistema debe permitir cancelar el registro de un préstamo a domicilio antes de confirmarlo, sin registrar el préstamo ni modificar la disponibilidad del ejemplar.

### Devolución de libros

- RF90. El sistema debe permitir registrar la devolución de un libro.
- RF91. El sistema debe permitir buscar el préstamo vigente asociado al ejemplar devuelto.
- RF92. El sistema debe permitir registrar el estado del ejemplar devuelto, evaluado manualmente por el Bibliotecario.
- RF93. El sistema debe actualizar la disponibilidad del ejemplar después de registrar la devolución.
- RF94. El sistema debe permitir controlar retrasos en la devolución.
- RF95. El sistema debe permitir consultar el historial de devoluciones.
- RF96. El sistema no debe gestionar cobros, pagos o multas económicas, aunque pueda registrar o mostrar información de retraso para control bibliotecario.

### Administración de tesis digitales

- RF97. El sistema debe permitir registrar tesis académicas.
- RF98. El sistema debe permitir consultar tesis registradas.
- RF99. El sistema debe permitir buscar tesis registradas.
- RF100. El sistema debe permitir aplicar filtros de tesis registradas.
- RF101. El sistema debe permitir actualizar datos de tesis.
- RF102. El sistema debe permitir desactivar tesis registradas.
- RF103. El sistema debe permitir activar nuevamente una tesis desactivada.
- RF104. El sistema debe permitir cargar el archivo digital de la tesis.
- RF105. El sistema debe permitir actualizar el archivo digital de la tesis.
- RF106. El sistema debe permitir registrar como parte de la tesis datos como facultad, carrera, título, autor, tutor, gestión, número de inventario, palabras clave y archivo digital.

### Consulta de tesis digitales

- RF107. El sistema debe permitir consultar tesis digitales.
- RF108. El sistema debe permitir buscar tesis digitales mediante criterios como título, autor, carrera, facultad, año o tema.
- RF109. El sistema debe permitir aplicar filtros de búsqueda de tesis.
- RF110. El sistema debe permitir visualizar el detalle de una tesis.
- RF111. El sistema debe permitir visualizar el archivo digital de una tesis cuando este se encuentre registrado.
- RF112. El sistema no debe modelar la descarga de tesis como funcionalidad independiente, debido a que la visualización del archivo puede permitir su descarga desde el visor o navegador.

### Comunicación usuario-bibliotecario

- RF113. El sistema debe permitir que el usuario académico envíe consultas al bibliotecario.
- RF114. El sistema debe permitir consultar mensajes enviados.
- RF115. El sistema debe permitir consultar mensajes recibidos.
- RF116. El sistema debe permitir que el bibliotecario responda consultas de usuarios académicos.
- RF117. El sistema debe registrar la comunicación usuario-bibliotecario dentro del sistema.
- RF118. El sistema no debe depender de un servicio externo de notificaciones, ya que la comunicación se gestionará internamente.

### Reportes y dashboards

- RF119. El sistema debe permitir visualizar un dashboard general.
- RF120. El sistema debe permitir visualizar un dashboard de uso del catálogo.
- RF121. El sistema debe permitir visualizar un dashboard de reservas.
- RF122. El sistema debe permitir visualizar un dashboard de préstamos.
- RF123. El sistema debe permitir visualizar un dashboard de tesis.
- RF124. El sistema debe permitir filtrar información estadística.
- RF125. El sistema debe permitir generar reportes de libros más consultados.
- RF126. El sistema debe permitir generar reportes de tesis más consultadas.
- RF127. El sistema debe permitir generar reportes de reservas.
- RF128. El sistema debe permitir generar reportes de préstamos.
- RF129. El sistema debe permitir generar reportes por facultad.
- RF130. El sistema debe permitir generar reportes por carrera.
- RF131. El sistema debe registrar información de uso necesaria para la generación de estadísticas y dashboards.

### Novedades bibliográficas

- RF132. El sistema debe registrar automáticamente la fecha de incorporación de cada libro al catálogo.
- RF133. El sistema debe mostrar en el catálogo bibliográfico los últimos N libros incorporados (novedades bibliográficas), ordenados por fecha de registro, de forma automática.

### Datos

- RF01. El sistema debe mantener coherencia entre los módulos de libros, ejemplares, reservas, préstamos, tesis, usuarios y reportes.
- RF02. El sistema debe validar los datos ingresados antes de guardar registros.
- RF03. El sistema debe informar al usuario cuando existan datos incompletos, incorrectos o no válidos.
- RF04. El sistema debe mantener actualizada la disponibilidad de ejemplares cuando se registren reservas, préstamos o devoluciones.
- RF05. El sistema debe permitir la trazabilidad básica de cambios relevantes, como actualizaciones de libros, usuarios, tesis o ejemplares.
- RF06. El sistema debe almacenar la información de libros, ejemplares, tesis, usuarios, reservas, préstamos, devoluciones, reportes y novedades de forma estructurada.
- RF07. El sistema debe evitar duplicidad innecesaria de registros bibliográficos, tesis, usuarios y ejemplares.
- RF08. El sistema debe conservar datos históricos necesarios para consultas, reportes y auditoría básica.
- RF09. El sistema debe mantener la integridad de los datos relacionados entre libros, ejemplares, bibliotecas, facultades, carreras, tesis y usuarios.
- RF10. El sistema debe permitir diferenciar los libros y ejemplares según biblioteca física, facultad y ubicación registrada.
- RF11. El sistema debe registrar la clasificación Dewey como dato bibliográfico necesario para apoyar la ubicación del material físico.

### Seguridad

- RF01. El sistema debe validar la autenticidad de los usuarios antes de permitir el acceso a funcionalidades restringidas.
- RF02. El sistema debe controlar el acceso a la información mediante roles y permisos.
- RF03. El sistema debe proteger la privacidad y confidencialidad de los datos de los usuarios.
- RF04. El sistema no debe almacenar contraseñas institucionales de estudiantes o docentes.
- RF05. El sistema debe utilizar mecanismos seguros para la transmisión de credenciales y datos sensibles.
- RF06. El sistema debe registrar en una bitácora de aplicación las acciones relevantes de los usuarios internos (inicio de sesión exitoso, creación, actualización y eliminación o desactivación de registros), indicando el usuario responsable, la acción realizada, la entidad y el registro afectados, una descripción breve y la fecha y hora, con fines de auditoría.
- RF07. El sistema debe impedir que usuarios sin permisos administren libros, tesis, ejemplares, reservas, préstamos, usuarios o reportes.
- RF08. El Administrador general del sistema debe tener acceso completo a todas las funcionalidades del sistema, independientemente del actor documentado en cada caso de uso, mediante la asignación de la totalidad de los permisos disponibles a su rol en la base de datos, sin requerir excepciones o validaciones especiales en el código.
- RF09. El sistema debe permitir la realización de copias de seguridad de la información registrada.
- RF10. El sistema debe permitir recuperar información a partir de respaldos en caso de fallos o pérdida de datos.
- RF11. Las copias de seguridad deben almacenarse en un lugar seguro definido por la administración técnica correspondiente.
- RF12. El sistema debe conectarse a la base de datos mediante una cuenta técnica propia, distinta de las cuentas de los usuarios del sistema y del administrador de la base de datos, con los permisos mínimos necesarios y con permiso únicamente de inserción sobre la bitácora, de modo que los registros de auditoría no puedan modificarse ni eliminarse desde la aplicación. La consulta de la bitácora con fines de auditoría la realiza directamente el administrador de la base de datos y queda fuera del sistema.

### Requisitos no funcionales

- Se presentan las categorías adicionales de la norma IEEE 830 que complementan la especificación no funcional del sistema, ya que las categorías Ambiente físico, Interfaces, Usuarios y factores humanos, Datos y Seguridad se desarrollan como requisitos funcionales en la sección 3.1, conforme a los lineamientos de la Iteración 2.

### Rendimiento

- RNF01. El sistema debe responder de forma eficiente a consultas de catálogo, búsqueda de tesis, reservas y reportes.
- RNF02. El sistema debe permitir consultas simultáneas de varios usuarios sin afectar significativamente el tiempo de respuesta.
- RNF03. El sistema debe procesar búsquedas y filtros de libros y tesis en tiempos adecuados para el uso académico.
- RNF04. El sistema debe permitir registrar, consultar y actualizar información sin afectar la continuidad del servicio.

### Disponibilidad

- RNF01. El sistema debe estar disponible durante los horarios establecidos para el servicio bibliotecario o según la configuración institucional.

### Mantenibilidad y escalabilidad

- RNF01. El sistema debe estar organizado de forma modular para facilitar su mantenimiento.
- RNF02. El sistema debe permitir incorporar nuevas funcionalidades en futuras iteraciones sin afectar los módulos existentes.
- RNF03. El sistema debe permitir ampliar la cantidad de bibliotecas, carreras, libros, ejemplares, tesis y usuarios registrados.
- RNF04. El sistema debe permitir adaptar reportes y dashboards según nuevas necesidades de información de la Biblioteca Central.

## Requerimientos comunes para todo el sistema

### Ambiente físico

- No se identificaron requerimientos dentro de las descripciones de los casos de uso que correspondan directamente a esta categoría.

### Usuarios y factores humanos

- RF01: Si la validación falla, el sistema deniega el ingreso y muestra el mensaje correspondiente.
- RF02: La interfaz debe incluir una opción visible de cierre de sesión, accesible desde cualquier pantalla del sistema una vez autenticado el usuario.
- RF03: La interfaz debe presentar los datos del perfil organizados en secciones (datos personales, rol asignado y «Biblioteca / facultad relacionada», según corresponda).
- RF04: La interfaz no debe incluir opciones de edición sobre los datos mostrados, salvo los campos explícitamente habilitados para actualización.
- RF05: La interfaz no requiere que el usuario complete ningún formulario adicional; el registro de sus datos mínimos ocurre de forma automática e inmediata tras la validación institucional.
- RF06: La interfaz debe reflejar el acceso habilitado a las funcionalidades correspondientes sin mostrar ningún paso intermedio perceptible para el usuario.
- RF07: La interfaz debe mostrar, junto al nombre del usuario, un interruptor de estado para cambiarlo entre activo e inactivo.
- RF08: La interfaz debe solicitar una confirmación mediante una ventana con los botones «Cancelar» y «Confirmar» antes de aplicar el cambio de estado.
- RF09: La interfaz debe señalar mediante un mensaje los campos que no pueden modificarse (por ejemplo, el identificador institucional).
- RF10: La interfaz debe indicar mediante un mensaje cuando la búsqueda no encuentra resultados coincidentes.
- RF11: La interfaz debe mostrar la cantidad de resultados obtenidos tras aplicar los filtros seleccionados, mediante el contador «N usuarios encontrados».
- RF12: La interfaz debe solicitar confirmación mediante una ventana con los botones «Cancelar» y «Confirmar» antes de aplicar la desactivación, advirtiendo que el usuario perderá acceso al sistema.
- RF13: La interfaz debe indicar mediante un mensaje cuando la búsqueda no encuentra coincidencias.
- RF14: La interfaz debe solicitar confirmación antes de aplicar la desactivación.
- RF15: La interfaz debe incluir un control para seleccionar el archivo desde el equipo del actor y un botón para iniciar la importación.
- RF16: La interfaz debe indicar mediante un mensaje que el libro fue registrado correctamente, sin requerir que el actor ingrese la fecha de registro.
- RF17: La interfaz debe mostrar el estado de disponibilidad mediante un indicador visual (por ejemplo, una etiqueta de color) junto al ejemplar consultado.
- RF18: La interfaz debe mostrar la cantidad de ejemplares resultantes tras aplicar los filtros, mediante el contador «N ejemplares encontrados».
- RF19: La interfaz debe presentar la información del libro organizada en secciones: datos bibliográficos, disponibilidad y ubicación física.
- RF20: La interfaz debe mostrar la disponibilidad mediante un indicador visual (por ejemplo, una etiqueta de color) dentro de la interfaz P6.2 de detalle del libro.
- RF21: La interfaz debe mostrar la portada del libro en un tamaño legible dentro de la vista de detalle.
- RF22: La interfaz debe presentar una imagen genérica de reemplazo cuando el libro no tenga portada registrada.
- RF23: La interfaz debe incluir una sección visible en el catálogo bibliográfico dedicada a mostrar las novedades.
- RF24: La interfaz debe presentar un botón de confirmación para registrar la reserva, habilitado únicamente cuando la disponibilidad fue verificada.
- RF25: La interfaz debe mostrar un mensaje de confirmación con los datos de la reserva registrada (libro, fecha y estado).
- RF26: La interfaz debe incluir un botón «Reservar» visible en los resultados del catálogo y en la vista de detalle del libro.
- RF27: La interfaz debe deshabilitar el botón de reserva cuando el libro no tenga ejemplares disponibles.
- RF28: La interfaz debe mostrar un mensaje indicando si el ejemplar está disponible para reserva antes de habilitar el botón de confirmación.
- RF29: La interfaz debe mostrar, junto a cada reserva del usuario, la acción «Cancelar» para cancelarla cuando su estado lo permita.
- RF30: La interfaz debe solicitar confirmación antes de cancelar la reserva, mediante una ventana con los botones «Volver» y «Cancelar reserva».
- RF31: La interfaz debe mostrar el estado de la reserva mediante un indicador visual (por ejemplo, una etiqueta de color).
- RF32: La interfaz debe solicitar confirmación antes de aplicar la cancelación.
- RF33: La interfaz debe mostrar, junto a cada reserva pendiente, un botón para confirmarla.
- RF34: La interfaz debe solicitar confirmación antes de aplicar el rechazo.
- RF35: La interfaz debe mostrar un indicador visual (por ejemplo, una etiqueta de color) cuando la devolución se realiza fuera del plazo establecido.
- RF36: La interfaz debe mostrar un mensaje indicando si el ejemplar está habilitado para préstamo a domicilio antes de continuar con el registro.
- RF37: La interfaz debe mostrar el estado de disponibilidad del ejemplar mediante un indicador visual antes de continuar con el registro del préstamo.
- RF38: La interfaz debe mostrar la fecha de devolución calculada automáticamente, con la opción de ajustarla dentro de los límites permitidos.
- RF39: La interfaz debe incluir un botón «Confirmar fecha» para confirmar la fecha asignada.
- RF40: La interfaz debe incluir un control para seleccionar el archivo digital desde el equipo del actor y un botón («Subir archivo» o «Reemplazar documento») para confirmar la carga.
- RF41: La interfaz debe presentar la información de la tesis organizada en secciones: datos generales, autor y tutor, y archivo digital asociado.
- RF42: La interfaz debe representar cada documento digital como un ícono de PDF con el nombre de su sección, que al hacer clic abre el documento en una nueva pestaña del navegador, sin requerir que el usuario lo descargue por separado para revisarlo.
- RF43: La interfaz debe incluir un área de texto para redactar la consulta y un botón «Enviar consulta» para enviarla; esta interfaz se abre desde el botón «Nueva consulta» de la Bandeja de Mensajes (P12.1).
- RF44: La interfaz debe incluir un área de texto para redactar la respuesta, junto al contenido de la consulta original, y un botón «Enviar respuesta» para enviarla.
- RF45: La interfaz debe incluir, junto a cada reporte, los botones «Exportar PDF» y «Exportar Excel», uno por cada formato disponible.
- RF46: La interfaz debe solicitar confirmación mediante una ventana con los botones «Volver» y «Cancelar préstamo» antes de cancelar un préstamo en sala o a domicilio.
- RF47: La interfaz debe abrir la ventana «Confirmar préstamo», con los botones «Cancelar» y «Confirmar», al accionar «Prestar» sobre una reserva confirmada.
- RF48: La interfaz debe solicitar confirmación, con el campo «Motivo (opcional)», antes de rechazar una reserva pendiente o cancelar una reserva confirmada desde la administración.
- RF49: La interfaz debe abrir una ventana con la fecha límite vigente, la cantidad de ampliaciones y los botones «Cancelar» y «Confirmar ampliación» al accionar «Ampliar plazo» sobre un préstamo a domicilio.

### Datos

- RF01: La interfaz debe presentar un formulario prellenado con los datos actuales del usuario (nombre, correo institucional, biblioteca responsable, rol), habilitando solo los campos editables según las reglas del sistema.
- RF02: La interfaz debe presentar un campo de selección (desplegable) con las bibliotecas físicas registradas, permitiendo elegir una sola opción por usuario interno.
- RF03: La interfaz debe presentar un campo de selección (desplegable) con los roles disponibles (Bibliotecario, Catalogador, Administrador de biblioteca, Responsable de tesis y solvencias, Administrador general del sistema).
- RF04: La interfaz debe presentar los roles en una lista, mostrando junto a cada uno las funcionalidades del sistema que tiene habilitadas.
- RF05: La interfaz debe mostrar los usuarios en una tabla con columnas de nombre, tipo de usuario, rol, estado y biblioteca asignada.
- RF06: La interfaz debe incluir un campo de texto para ingresar el criterio de búsqueda (nombre, identificador, rol o biblioteca).
- RF07: La interfaz debe presentar los filtros disponibles (rol, estado, tipo de usuario, biblioteca) como controles desplegables o casillas de selección.
- RF08: La interfaz debe presentar un formulario con los campos necesarios para registrar al empleado (nombre, correo institucional, rol inicial y biblioteca responsable si corresponde).
- RF09: La interfaz debe presentar un formulario prellenado con los datos actuales de la biblioteca (nombre, ubicación, descripción, estado, facultad relacionada si corresponde), habilitando los campos editables; el estado se cambia mediante un interruptor entre activo e inactivo.
- RF10: La interfaz debe presentar un formulario prellenado con los datos actuales de la carrera (nombre, estado, facultad a la que pertenece), habilitando los campos editables; el estado se cambia mediante un interruptor entre activo e inactivo.
- RF11: La interfaz debe presentar un formulario prellenado con los datos actuales de la facultad (nombre, estado, carreras relacionadas), habilitando los campos editables; el estado se cambia mediante un interruptor entre activo e inactivo.
- RF12: La interfaz debe mostrar cada listado en formato de tabla, con las columnas relevantes a cada tipo de registro.
- RF13: La interfaz debe presentar un formulario con los campos: nombre de la biblioteca, ubicación y descripción.
- RF14: La interfaz debe presentar un formulario con los campos: nombre de la carrera y facultad a la que pertenece (mediante selección desplegable).
- RF15: La interfaz debe presentar un formulario con el campo: nombre de la facultad.
- RF16: La interfaz debe presentar un formulario prellenado con los datos bibliográficos actuales del libro (título, autor, editorial, materia, clasificación Dewey, ISBN, portada), habilitando los campos editables.
- RF17: La interfaz debe mostrar el historial en una lista cronológica, indicando la fecha, el campo modificado, el valor anterior y el valor nuevo.
- RF18: La interfaz debe mostrar los libros en una tabla con columnas de título, autor, materia, clasificación Dewey y estado.
- RF19: La interfaz debe incluir un campo de texto para ingresar el criterio de búsqueda (título, autor o ISBN).
- RF20: La interfaz debe presentar los filtros disponibles (biblioteca, facultad, materia, autor, estado, clasificación) como controles desplegables o casillas de selección.
- RF21: La interfaz debe presentar un formulario con los campos: título, autor, editorial, materia, clasificación Dewey, ISBN (opcional) y portada.
- RF22: La interfaz debe presentar un formulario prellenado con los datos actuales del ejemplar (código, biblioteca, ubicación), habilitando los campos editables.
- RF23: La interfaz debe presentar un campo de selección (desplegable) con los estados posibles: disponible, reservado, prestado, no disponible, en mantenimiento o desactivado.
- RF24: La interfaz debe presentar un campo de texto para ingresar el código del ejemplar, validando que no se repita con uno ya existente.
- RF25: La interfaz debe mostrar los ejemplares en una tabla con columnas de código, libro relacionado, biblioteca, ubicación, estado y disponibilidad.
- RF26: La interfaz debe incluir un campo de texto para ingresar el criterio de búsqueda (código de ejemplar o título del libro).
- RF27: La interfaz debe presentar los filtros disponibles (biblioteca, facultad, estado, disponibilidad, ubicación) como controles desplegables o casillas de selección.
- RF28: La interfaz debe mostrar la biblioteca física y la clasificación Dewey asociadas al ejemplar consultado.
- RF29: La interfaz debe presentar un formulario con los campos: libro asociado (mediante selección o búsqueda), código de ejemplar y ubicación física.
- RF30: La interfaz debe incluir un campo de búsqueda único donde el usuario puede ingresar título, autor, materia o clasificación Dewey.
- RF31: La interfaz debe mostrar los resultados en una lista con la portada, título, autor y disponibilidad de cada libro.
- RF32: La interfaz debe presentar los filtros disponibles (biblioteca, facultad, materia, autor, disponibilidad, clasificación Dewey) como controles desplegables o casillas de selección, visibles junto a los resultados de búsqueda.
- RF33: La interfaz debe mostrar la biblioteca física y la clasificación Dewey del libro dentro de la vista de detalle.
- RF34: La interfaz debe mostrar los libros como una lista o carrusel con portada, título y fecha de incorporación al catálogo.
- RF35: La interfaz debe presentar un campo de selección (desplegable) con los estados permitidos para la reserva.
- RF36: La interfaz debe incluir un campo de texto opcional para registrar el motivo de la cancelación administrativa.
- RF37: La interfaz debe mostrar el historial en una tabla con columnas de usuario, libro, fecha, estado y biblioteca.
- RF38: La interfaz debe presentar un campo de selección (desplegable) con las bibliotecas disponibles, mostrando las reservas correspondientes en una tabla.
- RF39: La interfaz debe mostrar las reservas en una tabla con columnas de usuario, libro, fecha, biblioteca, estado y acciones.
- RF40: La interfaz debe incluir un campo de texto opcional para registrar el motivo del rechazo.
- RF41: La interfaz debe incluir un campo de búsqueda por código de ejemplar, usuario o número de préstamo.
- RF42: La interfaz debe mostrar los préstamos coincidentes en una lista con los datos del usuario y el material prestado.
- RF43: La interfaz debe mostrar el historial en una tabla con columnas de usuario, ejemplar, fecha de préstamo, fecha de devolución, estado del ejemplar y observaciones.
- RF44: La interfaz debe mostrar los préstamos activos en una tabla con columnas de usuario, ejemplar, fecha de préstamo y fecha límite de devolución.
- RF45: La interfaz debe mostrar los préstamos activos en una tabla con columnas de usuario, ejemplar, fecha de inicio y estado (activo o inactivo).
- RF46: La interfaz debe presentar un formulario prellenado con los datos actuales de la tesis (título, autor, tutor, carrera, facultad, año o gestión, palabras clave y estado de la tesis), habilitando los campos editables.
- RF47: La interfaz debe mostrar las tesis en una tabla con columnas de título, autor, carrera, facultad, gestión y estado.
- RF48: La interfaz debe incluir un campo de texto para ingresar el criterio de búsqueda (título, autor o número de inventario).
- RF49: La interfaz debe presentar los filtros disponibles (carrera y gestión) como controles desplegables.
- RF50: La interfaz debe presentar un formulario con los campos: título, autor, tutor, carrera, facultad, año o gestión, número de inventario y palabras clave.
- RF51: La interfaz debe incluir un campo de búsqueda único donde el usuario puede ingresar título, autor, carrera o palabras clave del tema.
- RF52: La interfaz debe mostrar los resultados en una lista con título, autor, carrera y año de cada tesis.
- RF53: La interfaz debe presentar los filtros disponibles (carrera y gestión) como controles desplegables.
- RF54: La interfaz debe mostrar los mensajes enviados en una lista ordenada por fecha, indicando el destinatario y el estado (respondido o pendiente).
- RF55: La interfaz debe mostrar los mensajes recibidos en una lista ordenada por fecha, indicando el remitente y el estado (Pendiente o Respondido).
- RF56: La interfaz debe presentar los filtros disponibles (periodo, facultad, carrera, biblioteca, tipo de recurso, estado) como controles desplegables, visibles junto al reporte o dashboard.
- RF57: La interfaz debe mostrar el reporte como una tabla o gráfico de barras con el título del libro y la cantidad de consultas.
- RF58: La interfaz debe mostrar el reporte como una tabla o gráfico, diferenciando préstamos en sala y préstamos a domicilio.
- RF59: La interfaz debe mostrar el reporte como una tabla o gráfico con la cantidad de reservas por estado.
- RF60: La interfaz debe mostrar el reporte como una tabla o gráfico de barras con el título de la tesis y la cantidad de consultas.
- RF61: La interfaz debe presentar un campo de selección (desplegable) con las carreras registradas, mostrando el reporte correspondiente en una tabla o gráfico.
- RF62: La interfaz debe presentar un campo de selección (desplegable) con las facultades registradas, mostrando el reporte correspondiente en una tabla o gráfico.
- RF63: La interfaz debe mostrar los indicadores de préstamos como tarjetas o gráficos resumidos (préstamos del mes, préstamos vigentes, devoluciones a tiempo, préstamos con retraso).
- RF64: La interfaz debe mostrar los indicadores de reservas como tarjetas o gráficos resumidos (reservas del mes, reservas pendientes, reservas atendidas, tasa de cumplimiento).
- RF65: La interfaz debe mostrar los indicadores de tesis como tarjetas o gráficos resumidos (total de tesis registradas, tesis más consultadas por carrera).
- RF66: La interfaz debe mostrar los indicadores de uso del catálogo como tarjetas o gráficos resumidos (libros en catálogo, consultas del mes, ítems más consultados, cobertura por facultad).
- RF67: La interfaz debe organizar los indicadores principales en un panel único con tarjetas o gráficos resumidos (ejemplares, préstamos, reservas y tesis).
- RF68: La interfaz debe presentar las bibliotecas como tarjetas (cards) con nombre y descripción, en la pantalla de inicio del sistema.
- RF69: El sistema debe registrar la fecha de cada visualización del detalle de un libro o una tesis y de cada apertura de un documento digital, para contarlas en los dashboards y reportes.
- RF70: El filtro «Periodo» debe ofrecer las opciones «Último mes», «Último trimestre», «Semestre actual», «Gestión actual» y «Rango personalizado» (desde–hasta).
- RF71: El sistema debe registrar el estado del ejemplar devuelto («Buen estado», «Con observaciones» o «Dañado») que el Bibliotecario indica tras revisarlo físicamente.

### Seguridad

- RF01: Este caso de uso permite verificar si las credenciales ingresadas corresponden a un usuario institucional vigente.
- RF02: La interfaz debe mostrar un mensaje de error específico cuando el servicio institucional rechaza las credenciales, indicando que el usuario o la contraseña no son válidos o que la cuenta no se encuentra vigente.
- RF03: La interfaz no debe mostrar mensajes que revelen si el error corresponde al usuario o a la contraseña, para evitar dar pistas sobre cuentas existentes.
- RF04: Este caso de uso permite que el usuario ingrese sus credenciales institucionales para iniciar el proceso de autenticación dentro del sistema bibliotecario.
- RF05: El sistema debe garantizar que las credenciales ingresadas quedan disponibles para ser validadas mediante el caso de uso Validar usuario institucional.
- RF06: La interfaz debe presentar campos para ingresar el nombre de usuario y la contraseña, junto con el botón «Iniciar sesión».
- RF07: La interfaz debe ocultar los caracteres de la contraseña ingresada, con la opción de mostrarla temporalmente.
- RF08: Este caso de uso permite finalizar de forma segura la sesión activa del usuario dentro del sistema bibliotecario.
- RF09: El sistema debe garantizar que la sesión del usuario queda finalizada y el sistema impide el acceso a funcionalidades protegidas hasta que el usuario vuelva a autenticarse.
- RF10: La interfaz debe redirigir automáticamente a la pantalla de inicio (P.1 Home sin sesión) al finalizar la sesión.
- RF11: El sistema debe garantizar que el usuario queda asociado al rol seleccionado y el sistema ajusta sus permisos de acceso según dicho rol.
- RF12: La interfaz debe mostrar una breve descripción de los permisos asociados al rol antes de confirmar la asignación.
- RF13: Este caso de uso permite revisar los permisos asociados a cada rol definido dentro del sistema bibliotecario.
- RF14: El sistema muestra los permisos asociados a los roles.
- RF15: Este caso de uso permite al Administrador general del sistema restablecer la contraseña de una cuenta de personal interno cuando esta ha sido olvidada o se requiere una nueva credencial.
- RF16: El sistema debe generar una nueva contraseña segura al restablecer una cuenta.
- RF17: El sistema debe mostrar la nueva contraseña generada solo al Administrador general, quien la entrega en persona al empleado afectado; el sistema no debe enviarla por correo electrónico ni por ningún otro medio.
- RF18: La interfaz debe permitir al Administrador general buscar y seleccionar la cuenta del empleado antes de restablecer su contraseña.
- RF19: La interfaz debe confirmar visualmente que la contraseña fue restablecida y mostrar la nueva contraseña generada al Administrador general.
- RF20: La interfaz debe indicar mediante un mensaje que se generó una contraseña para la nueva cuenta, que el Administrador general entrega en persona al empleado sin enviarla por correo ni por ningún otro medio.
- RF21: Este caso de uso permite verificar la identidad del usuario que solicita el préstamo a domicilio, utilizando el RU presentado.
- RF22: La interfaz debe incluir un campo para ingresar el RU del usuario.
- RF23: La interfaz debe mostrar los datos institucionales verificados del usuario antes de continuar con el registro.
- RF24: Este caso de uso permite verificar la identidad del usuario que solicita el préstamo en sala, utilizando el RU presentado.
- RF25: El sistema debe registrar pistas de auditoría de las acciones relevantes de los usuarios internos.
