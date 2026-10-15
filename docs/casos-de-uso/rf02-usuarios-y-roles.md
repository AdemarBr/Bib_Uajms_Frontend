# RF2 — Administrar usuarios y roles

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/usuarios`.

## RF2 Administrar Usuarios y Roles (caso de uso padre)

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF2.1; RF2.2; RF2.3; RF2.4; RF2.5; RF2.6; RF2.7; RF2.8; RF2.9

**Propósito:** Administrar de forma integral la funcionalidad "Administrar Usuarios y Roles" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite registrar usuario interno; consultar usuarios del sistema; actualizar datos de usuario; asignar rol de usuario; asignar biblioteca responsable; activar usuario; desactivar usuario; restablecer contraseña de usuario interno; consultar permisos por rol.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con alguno de los siguientes roles habilitados: Administrador general del sistema.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Administrar Usuarios y Roles" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde el menú lateral del sistema, la opción «Usuarios y roles», que lo lleva a la interfaz P2.1, P2.2, P2.4 o P2.5 según el caso de uso hijo que corresponda; la interfaz P2.3 se abre desde el listado de la interfaz P2.2.
- 2.- El sistema despliega la interfaz correspondiente (P2.1, P2.2, P2.4 o P2.5) con las opciones específicas de «Usuarios y roles».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en las tablas usuario, rol y permiso.

## RF2.1 Registrar usuario interno

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF2.1.1; RF2.1.2; RF2.1.3; RF2.1.4; RF2.1.5; RF2.1.6

**Propósito:** Permitir registrar un nuevo usuario interno dentro del sistema bibliotecario, asignándole la información necesaria para su identificación y posterior uso del sistema.

**Resumen:** Este caso de uso permite registrar un nuevo usuario interno dentro del sistema bibliotecario, asignándole la información necesaria para su identificación y posterior uso del sistema. El sistema debe garantizar que el usuario interno queda registrado en el sistema bibliotecario y queda disponible para la asignación de rol, biblioteca responsable y activación correspondiente.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe garantizar que el usuario interno queda registrado en el sistema bibliotecario y queda disponible para la asignación de rol, biblioteca responsable y activación correspondiente.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P2.1 de registro de usuario interno.
- 2.- El sistema presenta el formulario de registro del empleado.
- 3.- El actor registra el nombre completo del empleado.
- 4.- El sistema toma el nombre como dato obligatorio del registro.
- 5.- El actor añade el correo institucional cuando corresponde.
- 6.- El sistema acepta el correo institucional como dato opcional.
- 7.- El actor selecciona el rol inicial del empleado.
- 8.- El sistema presenta los roles disponibles en un campo desplegable.
- 9.- El actor selecciona la biblioteca responsable cuando el rol lo requiere.
- 10.- El sistema presenta las bibliotecas físicas registradas en un campo desplegable.
- 11.- El actor hace clic en el botón «Guardar» para confirmar el registro del usuario interno.
- 12.- El sistema genera automáticamente el nombre de usuario y una contraseña segura, sin que sean campos del formulario, los guarda de forma segura y los muestra una sola vez al Administrador general en una ventana con los botones «Imprimir» y «Cerrar». El usuario interno se crea en la tabla usuario, vinculado a las tablas rol y biblioteca. La acción queda registrada en la tabla bitacora.
- 13.- El actor hace clic en el botón «Imprimir» para entregar el usuario y la contraseña en persona al empleado.
- 14.- El sistema genera el comprobante con el usuario y la contraseña para su impresión y no los envía por ningún otro medio.

**Curso alternativo de eventos:**

- ¿Los datos obligatorios del empleado son válidos? En caso negativo, el sistema señala los campos obligatorios incompletos o inválidos y no crea la cuenta del empleado.

**Requerimientos (RF2.1):**

- RF2.1.1: Este caso de uso permite registrar un nuevo usuario interno dentro del sistema bibliotecario, asignándole la información necesaria para su identificación y posterior uso del sistema.
- RF2.1.2: El sistema debe garantizar que el usuario interno queda registrado en el sistema bibliotecario y queda disponible para la asignación de rol, biblioteca responsable y activación correspondiente.
- [Interfaz] RF2.1.3: La interfaz debe presentar un formulario con los campos necesarios para registrar al empleado (nombre, correo institucional, rol inicial y biblioteca responsable si corresponde).
- [Interfaz] RF2.1.4: La interfaz debe indicar mediante un mensaje que se generó una contraseña para la nueva cuenta, que el Administrador general entrega en persona al empleado sin enviarla por correo ni por ningún otro medio.
- [Interfaz] RF2.1.5: La interfaz debe incluir un botón «Guardar» que registra al usuario interno con los datos ingresados en el formulario.
- [Interfaz] RF2.1.6: La interfaz debe mostrar, una vez guardado el registro, una ventana con el usuario y la contraseña generados (visibles una sola vez y solo para el Administrador general), un botón «Imprimir» que genera el comprobante con las credenciales para su entrega en persona y un botón «Cerrar».

## RF2.2 Consultar usuarios del sistema

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF2.2.1; RF2.2.2; RF2.2.3; RF2.2.4; RF2.2.5

**Propósito:** Permitir consultar los usuarios registrados en el sistema bibliotecario, visualizando información general como datos básicos, rol asignado, estado y biblioteca relacionada si corresponde.

**Resumen:** Este caso de uso permite consultar los usuarios registrados en el sistema bibliotecario, visualizando información general como datos básicos, rol asignado, estado y biblioteca relacionada si corresponde. El sistema muestra la información de los usuarios registrados.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema muestra la información de los usuarios registrados.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P2.2 de consulta de usuarios.
- 2.- El sistema carga la tabla con los usuarios registrados en el sistema. Los datos se obtienen de las tablas usuario, rol, tipo_usuario y biblioteca.
- 3.- El actor revisa la información de cada usuario en la tabla.
- 4.- El sistema muestra las columnas de nombre, tipo de usuario, rol, estado y biblioteca asignada.
- 5.- El actor recorre las páginas hasta ubicar al usuario buscado.
- 6.- El sistema pagina los resultados conservando el orden del listado.

**Curso alternativo de eventos:**

- ¿Existen usuarios registrados para mostrar? En caso negativo, el sistema presenta la tabla vacía e invita a registrar el primer usuario interno.

**Requerimientos (RF2.2):**

- RF2.2.1: Este caso de uso permite consultar los usuarios registrados en el sistema bibliotecario, visualizando información general como datos básicos, rol asignado, estado y biblioteca relacionada si corresponde.
- RF2.2.2: El sistema muestra la información de los usuarios registrados.
- RF2.2.3: El sistema debe garantizar que no se modifica información, salvo que posteriormente el actor seleccione otra acción como actualizar, asignar rol, activar o desactivar usuario.
- [Interfaz] RF2.2.4: La interfaz debe mostrar los usuarios en una tabla con columnas de nombre, tipo de usuario, rol, estado y biblioteca asignada.
- [Interfaz] RF2.2.5: La interfaz debe permitir seleccionar un usuario de la tabla para acceder a las acciones disponibles (actualizar, asignar rol, activar, desactivar).

## RF2.2.1 Buscar usuario del sistema

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF2.2.1.1; RF2.2.1.2; RF2.2.1.3; RF2.2.1.4; RF2.2.1.5

**Propósito:** Permitir localizar de manera rápida un usuario registrado dentro del sistema bibliotecario utilizando criterios de búsqueda como nombre, identificador, tipo de usuario, rol, estado o biblioteca asignada.

**Resumen:** Este caso de uso permite localizar de manera rápida un usuario registrado dentro del sistema bibliotecario utilizando criterios de búsqueda como nombre, identificador, tipo de usuario, rol, estado o biblioteca asignada. El sistema muestra los resultados de búsqueda correspondientes.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema muestra los resultados de búsqueda correspondientes.

**Curso normal de eventos:**

- 1.- El actor ingresa el criterio de búsqueda en el campo habilitado de la interfaz P2.2.
- 2.- El sistema toma el criterio ingresado, que puede ser nombre, identificador, rol o biblioteca.
- 3.- El actor lanza la búsqueda sobre los usuarios registrados.
- 4.- El sistema recorre los usuarios registrados comparándolos con el criterio ingresado. La búsqueda se realiza sobre las tablas usuario, rol y biblioteca.

**Curso alternativo de eventos:**

- ¿Existen usuarios que coincidan con el criterio ingresado? En caso negativo, el sistema informa que no se encontraron coincidencias y permite modificar el criterio de búsqueda.

**Requerimientos (RF2.2.1):**

- RF2.2.1.1: Este caso de uso permite localizar de manera rápida un usuario registrado dentro del sistema bibliotecario utilizando criterios de búsqueda como nombre, identificador, tipo de usuario, rol, estado o biblioteca asignada.
- RF2.2.1.2: El sistema muestra los resultados de búsqueda correspondientes.
- RF2.2.1.3: El sistema debe garantizar que el administrador puede seleccionar un usuario para consultar, actualizar datos, asignar rol, asignar biblioteca responsable, activar o desactivar el registro.
- [Interfaz] RF2.2.1.4: La interfaz debe incluir un campo de texto para ingresar el criterio de búsqueda (nombre, identificador, rol o biblioteca).
- [Interfaz] RF2.2.1.5: La interfaz debe indicar mediante un mensaje cuando la búsqueda no encuentra resultados coincidentes.

## RF2.2.1.1 Aplicar filtros de usuarios

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF2.2.1.1.1; RF2.2.1.1.2; RF2.2.1.1.3; RF2.2.1.1.4

**Propósito:** Permitir reducir o clasificar los resultados de usuarios mediante filtros como rol, estado, tipo de usuario, biblioteca asignada u otros criterios administrativos definidos por el sistema.

**Resumen:** Este caso de uso permite reducir o clasificar los resultados de usuarios mediante filtros como rol, estado, tipo de usuario, biblioteca asignada u otros criterios administrativos definidos por el sistema. El sistema muestra la lista de usuarios filtrada según los criterios seleccionados por el administrador.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema muestra la lista de usuarios filtrada según los criterios seleccionados por el administrador.

**Curso normal de eventos:**

- 1.- El actor despliega los controles de filtro disponibles en la interfaz P2.2.
- 2.- El sistema muestra los filtros de rol, estado, tipo de usuario y biblioteca con sus valores disponibles.
- 3.- El actor selecciona uno o varios criterios de filtrado.
- 4.- El sistema combina los criterios seleccionados para delimitar el listado.
- 5.- El actor aplica los criterios elegidos sobre la tabla de usuarios.
- 6.- El sistema recalcula la lista de usuarios según la combinación de criterios. Los datos se obtienen de las tablas usuario, rol, tipo_usuario y biblioteca.

**Curso alternativo de eventos:**

- ¿La combinación de filtros seleccionada devuelve resultados? En caso negativo, el sistema informa que ningún usuario cumple los criterios seleccionados y permite limpiar los filtros aplicados.

**Requerimientos (RF2.2.1.1):**

- RF2.2.1.1.1: Este caso de uso permite reducir o clasificar los resultados de usuarios mediante filtros como rol, estado, tipo de usuario, biblioteca asignada u otros criterios administrativos definidos por el sistema.
- RF2.2.1.1.2: El sistema muestra la lista de usuarios filtrada según los criterios seleccionados por el administrador.
- [Interfaz] RF2.2.1.1.3: La interfaz debe presentar los filtros disponibles (rol, estado, tipo de usuario, biblioteca) como controles desplegables o casillas de selección.
- [Interfaz] RF2.2.1.1.4: La interfaz debe mostrar la cantidad de resultados obtenidos tras aplicar los filtros seleccionados, mediante el contador «N usuarios encontrados».

## RF2.3 Actualizar datos de usuario

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF2.3.1; RF2.3.2; RF2.3.3; RF2.3.4; RF2.3.5

**Propósito:** Permitir modificar información permitida de un usuario registrado en el sistema bibliotecario.

**Resumen:** Este caso de uso permite modificar información permitida de un usuario registrado en el sistema bibliotecario. El sistema debe garantizar que los datos del usuario quedan actualizados en el sistema bibliotecario.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe garantizar que los datos del usuario quedan actualizados en el sistema bibliotecario.

**Curso normal de eventos:**

- 1.- El actor selecciona el usuario a modificar desde el listado de la interfaz P2.2.
- 2.- El sistema abre la interfaz P2.3 con el formulario prellenado con los datos actuales del usuario.
- 3.- El actor modifica los datos editables del usuario: nombre, correo institucional, rol o biblioteca responsable.
- 4.- El sistema habilita únicamente los campos editables entre Nombre, Correo institucional, Rol y Biblioteca responsable, según las reglas definidas.
- 5.- El actor hace clic en el botón «Guardar cambios» del formulario de usuario.
- 6.- El sistema valida los datos modificados antes de guardarlos.
- 7.- El sistema guarda los cambios y deja los datos del usuario actualizados en el sistema bibliotecario. Los cambios se guardan en la tabla usuario. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿Los datos modificados son válidos? En caso negativo, el sistema señala los campos con error y conserva los valores anteriores sin aplicar la modificación.

**Requerimientos (RF2.3):**

- RF2.3.1: Este caso de uso permite modificar información permitida de un usuario registrado en el sistema bibliotecario.
- RF2.3.2: El sistema debe garantizar que los datos del usuario quedan actualizados en el sistema bibliotecario.
- [Interfaz] RF2.3.3: La interfaz debe presentar un formulario prellenado con los datos actuales del usuario (nombre, correo institucional, biblioteca responsable, rol), habilitando solo los campos editables según las reglas del sistema.
- [Interfaz] RF2.3.4: La interfaz debe señalar mediante un mensaje los campos que no pueden modificarse (por ejemplo, el identificador institucional).
- [Interfaz] RF2.3.5: La interfaz debe incluir un botón «Guardar cambios» que aplica las modificaciones realizadas a los datos del usuario, incluidos el rol y la biblioteca responsable.

## RF2.4 Asignar rol de usuario

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF2.4.1; RF2.4.2; RF2.4.3; RF2.4.4; RF2.4.5

**Propósito:** Permitir asignar o modificar el rol de un usuario interno dentro del sistema bibliotecario, determinando las funcionalidades a las que podrá acceder.

**Resumen:** Este caso de uso permite asignar o modificar el rol de un usuario interno dentro del sistema bibliotecario, determinando las funcionalidades a las que podrá acceder. El sistema debe garantizar que el usuario queda asociado al rol seleccionado y el sistema ajusta sus permisos de acceso según dicho rol.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe garantizar que el usuario queda asociado al rol seleccionado y el sistema ajusta sus permisos de acceso según dicho rol.

**Curso normal de eventos:**

- 1.- El actor despliega el campo de rol dentro del formulario de la interfaz P2.3.
- 2.- El sistema muestra los roles disponibles: Bibliotecario, Catalogador, Administrador de biblioteca, Responsable de tesis y solvencias y Administrador general del sistema.
- 3.- El actor selecciona el rol que desea asignar.
- 4.- El sistema muestra la descripción de los permisos asociados a ese rol antes de confirmar.
- 5.- El actor hace clic en el botón «Guardar cambios» para confirmar el rol con los permisos mostrados.
- 6.- El sistema asocia el usuario al rol seleccionado y ajusta sus permisos de acceso según dicho rol. El rol asignado se guarda en la tabla usuario, y sus permisos se obtienen de las tablas rol_permiso y permiso. La acción queda registrada en la tabla bitacora.
- 7.- El sistema recalcula los permisos de acceso del usuario según el nuevo rol.

**Curso alternativo de eventos:**

- ¿El actor hace clic en el botón «Guardar cambios» para confirmar el rol con los permisos mostrados? En caso negativo, el sistema conserva el rol anterior del usuario y no aplica ningún cambio de permisos.

**Requerimientos (RF2.4):**

- RF2.4.1: Este caso de uso permite asignar o modificar el rol de un usuario interno dentro del sistema bibliotecario, determinando las funcionalidades a las que podrá acceder.
- RF2.4.2: El sistema debe garantizar que el usuario queda asociado al rol seleccionado y el sistema ajusta sus permisos de acceso según dicho rol.
- [Interfaz] RF2.4.3: La interfaz debe presentar un campo de selección (desplegable) con los roles disponibles (Bibliotecario, Catalogador, Administrador de biblioteca, Responsable de tesis y solvencias, Administrador general del sistema).
- [Interfaz] RF2.4.4: La interfaz debe mostrar una breve descripción de los permisos asociados al rol antes de confirmar la asignación.
- [Interfaz] RF2.4.5: La asignación del rol se confirma con el botón «Guardar cambios» del formulario de la interfaz P2.3.

## RF2.5 Asignar biblioteca responsable

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF2.5.1; RF2.5.2; RF2.5.3; RF2.5.4

**Propósito:** Permitir asignar a un usuario interno la biblioteca sobre la cual tendrá responsabilidad operativa o administrativa dentro del sistema.

**Resumen:** Este caso de uso permite asignar a un usuario interno la biblioteca sobre la cual tendrá responsabilidad operativa o administrativa dentro del sistema. El sistema debe garantizar que el usuario interno queda vinculado a una biblioteca responsable, limitando o definiendo su ámbito de operación según las reglas del sistema.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe garantizar que el usuario interno queda vinculado a una biblioteca responsable, limitando o definiendo su ámbito de operación según las reglas del sistema.

**Curso normal de eventos:**

- 1.- El actor despliega el campo de biblioteca responsable dentro del formulario de la interfaz P2.3.
- 2.- El sistema lista las bibliotecas físicas registradas, permitiendo elegir una sola opción por usuario interno.
- 3.- El actor selecciona la biblioteca responsable.
- 4.- El sistema toma la biblioteca seleccionada para el usuario interno.
- 5.- El actor confirma la asignación con el botón «Guardar cambios» de la interfaz P2.3.
- 6.- El sistema vincula al usuario interno con la biblioteca seleccionada. La biblioteca asignada se guarda en la tabla usuario. La acción queda registrada en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿El rol asignado al usuario requiere una biblioteca responsable? En caso negativo, el sistema deja el campo sin asignar por no corresponder al rol del usuario.

**Requerimientos (RF2.5):**

- RF2.5.1: Este caso de uso permite asignar a un usuario interno la biblioteca sobre la cual tendrá responsabilidad operativa o administrativa dentro del sistema.
- RF2.5.2: El sistema debe garantizar que el usuario interno queda vinculado a una biblioteca responsable, limitando o definiendo su ámbito de operación según las reglas del sistema.
- [Interfaz] RF2.5.3: La interfaz debe presentar un campo de selección (desplegable) con las bibliotecas físicas registradas, permitiendo elegir una sola opción por usuario interno.
- [Interfaz] RF2.5.4: La asignación de la biblioteca responsable se confirma con el botón «Guardar cambios» del formulario de la interfaz P2.3.

## RF2.6 Activar usuario

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF2.6.1; RF2.6.2; RF2.6.3; RF2.6.4

**Propósito:** Permitir habilitar un usuario registrado para que pueda acceder al sistema bibliotecario según su rol y permisos asignados.

**Resumen:** Este caso de uso permite habilitar un usuario registrado para que pueda acceder al sistema bibliotecario según su rol y permisos asignados. El sistema debe garantizar que el usuario queda activo en el sistema y puede acceder a las funcionalidades permitidas según su rol.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe garantizar que el usuario queda activo en el sistema y puede acceder a las funcionalidades permitidas según su rol.

**Curso normal de eventos:**

- 1.- El actor ubica al usuario desactivado en la tabla de la interfaz P2.2.
- 2.- El sistema muestra el control de estado en la fila correspondiente al usuario.
- 3.- El actor acciona el interruptor de estado para activar al usuario.
- 4.- El sistema muestra una ventana de confirmación con los botones «Cancelar» y «Confirmar» antes de aplicar el cambio de estado.
- 5.- El actor hace clic en el botón «Confirmar» de la ventana de confirmación.
- 6.- El sistema deja al usuario activo, permitiéndole acceder a las funcionalidades habilitadas según su rol. El cambio de estado se guarda en la tabla usuario. La acción queda registrada en la tabla bitacora.
- 7.- El sistema habilita el ingreso del usuario con los permisos de su rol.

**Curso alternativo de eventos:**

- ¿El actor hace clic en el botón «Confirmar» de la ventana y no en «Cancelar»? En caso negativo, el sistema cancela la operación y conserva al usuario en estado inactivo.

**Requerimientos (RF2.6):**

- RF2.6.1: Este caso de uso permite habilitar un usuario registrado para que pueda acceder al sistema bibliotecario según su rol y permisos asignados.
- RF2.6.2: El sistema debe garantizar que el usuario queda activo en el sistema y puede acceder a las funcionalidades permitidas según su rol.
- [Interfaz] RF2.6.3: La interfaz debe mostrar, junto al nombre del usuario, un interruptor de estado para cambiarlo entre activo e inactivo.
- [Interfaz] RF2.6.4: La interfaz debe solicitar una confirmación mediante una ventana con los botones «Cancelar» y «Confirmar» antes de aplicar el cambio de estado.

## RF2.7 Desactivar usuario

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF2.7.1; RF2.7.2; RF2.7.3; RF2.7.4

**Propósito:** Permitir deshabilitar temporal o administrativamente el acceso de un usuario al sistema bibliotecario.

**Resumen:** Este caso de uso permite deshabilitar temporal o administrativamente el acceso de un usuario al sistema bibliotecario. El sistema debe garantizar que el usuario queda desactivado y no puede acceder a las funcionalidades protegidas del sistema mientras conserve dicho estado.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe garantizar que el usuario queda desactivado y no puede acceder a las funcionalidades protegidas del sistema mientras conserve dicho estado.

**Curso normal de eventos:**

- 1.- El actor ubica al usuario activo en la tabla de la interfaz P2.2.
- 2.- El sistema muestra el control de estado en la fila correspondiente al usuario.
- 3.- El actor acciona el interruptor de estado para desactivar al usuario.
- 4.- El sistema advierte que el usuario perderá el acceso al sistema y muestra una ventana de confirmación con los botones «Cancelar» y «Confirmar».
- 5.- El actor hace clic en el botón «Confirmar» de la ventana de confirmación.
- 6.- El sistema deja al usuario desactivado e impide su acceso a las funcionalidades protegidas mientras conserve dicho estado. El cambio de estado se guarda en la tabla usuario. La acción queda registrada en la tabla bitacora.
- 7.- El sistema corta el acceso del usuario a las funcionalidades protegidas.

**Curso alternativo de eventos:**

- ¿El actor hace clic en el botón «Confirmar» de la ventana y no en «Cancelar»? En caso negativo, el sistema cancela la operación y conserva al usuario en estado activo.

**Requerimientos (RF2.7):**

- RF2.7.1: Este caso de uso permite deshabilitar temporal o administrativamente el acceso de un usuario al sistema bibliotecario.
- RF2.7.2: El sistema debe garantizar que el usuario queda desactivado y no puede acceder a las funcionalidades protegidas del sistema mientras conserve dicho estado.
- [Interfaz] RF2.7.3: La interfaz debe mostrar, junto al usuario seleccionado, un interruptor de estado para cambiarlo a desactivado.
- [Interfaz] RF2.7.4: La interfaz debe solicitar confirmación mediante una ventana con los botones «Cancelar» y «Confirmar» antes de aplicar la desactivación, advirtiendo que el usuario perderá acceso al sistema.

## RF2.8 Restablecer contraseña de usuario interno

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF2.8.1; RF2.8.2; RF2.8.3; RF2.8.4; RF2.8.5; RF2.8.6

**Propósito:** Permitir al Administrador general del sistema restablecer la contraseña de una cuenta de personal interno cuando esta ha sido olvidada o se requiere una nueva credencial.

**Resumen:** Este caso de uso permite al Administrador general del sistema restablecer la contraseña de una cuenta de personal interno cuando esta ha sido olvidada o se requiere una nueva credencial. El empleado debe acudir en persona ante el Administrador general; el sistema genera una nueva contraseña segura, la muestra solo al Administrador general y este la entrega en persona al empleado mediante un comprobante impreso, sin enviarla por correo ni por ningún otro medio.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema debe generar una nueva contraseña segura para la cuenta del empleado y mostrarla solo al Administrador general, quien la entrega en persona; el sistema no la envía por correo ni por ningún otro medio.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P2.4, previa solicitud del usuario interno afectado realizada fuera del sistema.
- 2.- El sistema presenta el buscador de cuentas de usuarios internos.
- 3.- El actor busca la cuenta con el botón «Buscar» y selecciona la cuenta del empleado afectado.
- 4.- El sistema muestra los datos de la cuenta seleccionada para su verificación.
- 5.- El actor hace clic en el botón «Restablecer contraseña» para confirmar el restablecimiento.
- 6.- El sistema genera una nueva contraseña, la muestra al Administrador general junto con la confirmación de que fue restablecida y la guarda encriptada. La nueva contraseña cifrada se guarda en la tabla usuario. La acción queda registrada en la tabla bitacora.
- 7.- El actor hace clic en el botón «Imprimir» para entregar la nueva contraseña en persona al empleado.
- 8.- El sistema genera el comprobante con la nueva contraseña para su impresión y no la envía por ningún otro medio.

**Curso alternativo de eventos:**

- ¿La cuenta seleccionada corresponde a un usuario interno? En caso negativo, el sistema informa que la cuenta no admite restablecimiento de contraseña por esta vía.  ¿El actor confirma la generación de una nueva contraseña? En caso negativo, el sistema cancela la operación y conserva la contraseña vigente del empleado.

**Requerimientos (RF2.8):**

- RF2.8.1: Este caso de uso permite al Administrador general del sistema restablecer la contraseña de una cuenta de personal interno cuando esta ha sido olvidada o se requiere una nueva credencial.
- RF2.8.2: El sistema debe generar una nueva contraseña segura al restablecer una cuenta.
- RF2.8.3: El sistema debe mostrar la nueva contraseña generada solo al Administrador general, quien la entrega en persona al empleado afectado; el sistema no debe enviarla por correo electrónico ni por ningún otro medio.
- [Interfaz] RF2.8.4: La interfaz debe permitir al Administrador general buscar y seleccionar la cuenta del empleado antes de restablecer su contraseña.
- [Interfaz] RF2.8.5: La interfaz debe confirmar visualmente que la contraseña fue restablecida y mostrar la nueva contraseña generada al Administrador general.
- [Interfaz] RF2.8.6: La interfaz debe incluir un botón «Buscar» junto al campo de búsqueda de la cuenta, un botón «Restablecer contraseña» que ejecuta el restablecimiento de la cuenta seleccionada y un botón «Imprimir» que genera el comprobante con la nueva contraseña para su entrega en persona.

## RF2.9 Consultar permisos por rol

**Actores:** Administrador general del sistema

**Tipo:** Primario

**Referencias:** RF2.9.1; RF2.9.2; RF2.9.3; RF2.9.4

**Propósito:** Permitir revisar los permisos asociados a cada rol definido dentro del sistema bibliotecario.

**Resumen:** Este caso de uso permite revisar los permisos asociados a cada rol definido dentro del sistema bibliotecario. El sistema muestra los permisos asociados a los roles.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Administrador general del sistema.

**Postcondiciones:** El sistema muestra los permisos asociados a los roles.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P2.5 de consulta de permisos por rol.
- 2.- El sistema lista los roles definidos en el sistema bibliotecario.
- 3.- El actor selecciona un rol de la lista.
- 4.- El sistema muestra junto al rol las funcionalidades del sistema que tiene habilitadas. Los datos se obtienen de las tablas rol, permiso y rol_permiso.

**Curso alternativo de eventos:**

- ¿El rol seleccionado tiene funcionalidades habilitadas? En caso negativo, el sistema señala que el rol consultado todavía no tiene funcionalidades habilitadas.

**Requerimientos (RF2.9):**

- RF2.9.1: Este caso de uso permite revisar los permisos asociados a cada rol definido dentro del sistema bibliotecario.
- RF2.9.2: El sistema muestra los permisos asociados a los roles.
- RF2.9.3: El sistema debe garantizar que no se modifica información del sistema.
- [Interfaz] RF2.9.4: La interfaz debe presentar los roles en una lista, mostrando junto a cada uno las funcionalidades del sistema que tiene habilitadas.
