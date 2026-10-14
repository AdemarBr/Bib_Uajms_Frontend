# RF1 — Autenticar usuario institucional

Fuente: documento del proyecto, versión de la Iteración 4 (casos de uso detallados y requerimientos funcionales de la Iteración 3, con los nombres de tablas del punto 3). Carpeta del frontend: `features/autenticacion`.

## RF1 Autenticar Usuario Institucional (caso de uso padre)

**Actores:** Usuario académico, Usuario interno, Servicio de validación institucional

**Tipo:** Primario

**Referencias:** RF1.1; RF1.2; RF1.3; RF1.4; RF1.5

**Propósito:** Administrar de forma integral la funcionalidad "Autenticar Usuario Institucional" del sistema de la Biblioteca Central UAJMS.

**Resumen:** Permite iniciar sesión con credenciales institucionales; validar usuario institucional; registrar datos mínimos del usuario validado; consultar perfil de usuario; cerrar sesión.

**Precondiciones:**

- Para iniciar sesión (RF1.1 a RF1.3), el usuario aún no tiene una sesión activa; para consultar su perfil y cerrar sesión (RF1.4 y RF1.5), el usuario tiene una sesión activa en el sistema.
- El usuario cuenta con alguno de los siguientes roles habilitados: Usuario académico, Usuario interno. El Servicio de validación institucional interviene como actor externo, no como rol del usuario.

**Postcondiciones:** Se ejecuta alguna de las operaciones específicas de "Autenticar Usuario Institucional" (según el caso de uso hijo utilizado), y el sistema refleja el resultado correspondiente.

**Curso normal de eventos:**

- 1.- El actor selecciona, desde la barra superior del sistema, la opción «Iniciar sesión» (o «Cerrar sesión» al terminar su sesión), que lo lleva a la interfaz P1.1, P1.2 según el caso de uso hijo que corresponda.
- 2.- El sistema despliega la interfaz correspondiente (P1.1, P1.2) con las opciones específicas de «Iniciar sesión».

**Curso alternativo de eventos:**

- No despliega ningún elemento, o despliega un listado vacío, si no existen registros asociados en las tablas usuario y rol.

## RF1.1 Iniciar sesión con credenciales institucionales

**Actores:** Usuario académico, Usuario interno

**Tipo:** Primario

**Referencias:** RF1.1.1; RF1.1.2; RF1.1.3; RF1.1.4

**Propósito:** Permitir que el usuario ingrese sus credenciales institucionales para iniciar el proceso de autenticación dentro del sistema bibliotecario.

**Resumen:** Este caso de uso permite que el usuario ingrese sus credenciales institucionales para iniciar el proceso de autenticación dentro del sistema bibliotecario. El sistema debe garantizar que las credenciales ingresadas quedan disponibles para ser validadas mediante el caso de uso Validar usuario institucional.

**Precondiciones:** El usuario cuenta con credenciales vigentes (usuario y contraseña): universitarias si es Usuario académico, locales si es Usuario interno; y pertenece a alguno de los roles habilitados para iniciar sesión: Usuario académico o Usuario interno.

**Postcondiciones:** El sistema debe garantizar que las credenciales ingresadas quedan disponibles para ser validadas mediante el caso de uso Validar usuario institucional.

**Curso normal de eventos:**

- 1.- El actor accede a la interfaz P1.1 de inicio de sesión.
- 2.- El sistema presenta el formulario con los campos de usuario y contraseña, junto al botón «Iniciar sesión».
- 3.- El actor ingresa su nombre de usuario institucional.
- 4.- El sistema toma el nombre de usuario ingresado y lo mantiene visible en el campo.
- 5.- El actor escribe la contraseña asociada a esa cuenta.
- 6.- El sistema oculta los caracteres de la contraseña y ofrece la opción de mostrarla temporalmente.
- 7.- El actor hace clic en el botón «Iniciar sesión».
- 8.- El sistema verifica que ambos campos hayan sido completados antes de continuar.
- 9.- El sistema deja las credenciales disponibles para ser validadas mediante el caso de uso Validar usuario institucional.

**Curso alternativo de eventos:**

- ¿Las credenciales fueron ingresadas de forma completa? En caso negativo, el sistema señala los campos obligatorios vacíos, no envía la solicitud y mantiene al actor en la interfaz P1.1 para completarlos.

**Requerimientos (RF1.1):**

- RF1.1.1: Este caso de uso permite que el usuario ingrese sus credenciales institucionales para iniciar el proceso de autenticación dentro del sistema bibliotecario.
- RF1.1.2: El sistema debe garantizar que las credenciales ingresadas quedan disponibles para ser validadas mediante el caso de uso Validar usuario institucional.
- [Interfaz] RF1.1.3: La interfaz debe presentar campos para ingresar el nombre de usuario y la contraseña, junto con el botón «Iniciar sesión».
- [Interfaz] RF1.1.4: La interfaz debe ocultar los caracteres de la contraseña ingresada, con la opción de mostrarla temporalmente.

## RF1.2 Validar usuario institucional

**Actores:** Servicio de validación institucional

**Tipo:** Primario

**Referencias:** RF1.2.1; RF1.2.2; RF1.2.3; RF1.2.4; RF1.2.5; RF1.2.6; RF1.2.7; RF1.2.8; RF1.2.9; RF1.2.10

**Propósito:** Permitir verificar si las credenciales ingresadas corresponden a un usuario vigente: los usuarios académicos con el Servicio de validación institucional y el personal interno con el registro de credenciales propio del sistema.

**Resumen:** Este caso de uso permite verificar, a través del Servicio de validación institucional, que un usuario corresponde a la universidad. Se presenta en dos vertientes según el proceso que lo invoca: (1) Iniciar sesión: se envían el RU y la contraseña; si son válidos, el servicio responde con la vigencia de la cuenta y datos adicionales (nombre completo, carrera, facultad, RU y, cuando el servicio lo informa, si es estudiante o docente). (2) Registro de un préstamo (en sala o a domicilio): se envía únicamente el RU; si el usuario está vigente, el servicio responde con el nombre, el RU, la carrera y, cuando el servicio lo informa, si es estudiante o docente; si no está vigente o no existe, el servicio responde con un código HTTP distinto, indicando que el usuario no está vigente o es inexistente. En ambos casos, si la validación es correcta, el sistema permite continuar con el proceso correspondiente. Los usuarios internos (Bibliotecario, Catalogador, Administrador de biblioteca, Responsable de tesis y solvencias y Administrador general) son creados por el Administrador general y no se validan con el servicio de la universidad: el sistema comprueba su usuario y contraseña contra su propio registro de credenciales locales.

**Precondiciones:**

- Para iniciar sesión, el usuario y la contraseña fueron ingresados desde la interfaz P1.1; para verificar a un usuario en un préstamo, solo el RU fue ingresado en el formulario de registro del préstamo (P9.1 o P9.3), sin contraseña.
- La cuenta pertenece a un usuario académico (docente o estudiante), validado con el Servicio de validación institucional, o a un usuario interno del personal, validado con el registro de credenciales propio del sistema.

**Postcondiciones:** Si la validación es correcta, ya sea con el servicio institucional o con el registro local del personal interno, el sistema permite continuar con el acceso.

**Curso normal de eventos:**

- 1.- El actor envía el formulario de inicio de sesión desde la interfaz P1.1.
- 2.- El sistema toma las credenciales ingresadas e identifica si la cuenta pertenece a un usuario interno.
- 3.- Si la cuenta es de un usuario académico, el Servicio de validación institucional verifica la identidad y la vigencia de la cuenta.
- 4.- Si la cuenta es de un usuario interno, el sistema valida el usuario y la contraseña contra su propio registro de credenciales locales; si es de un usuario académico, recibe la respuesta del servicio institucional indicando si las credenciales corresponden a un usuario vigente.
- 5.- El sistema permite continuar con el acceso del usuario validado. Las credenciales del usuario interno se verifican contra la tabla usuario, y su inicio de sesión exitoso queda registrado en la tabla bitacora.

**Curso alternativo de eventos:**

- ¿Las credenciales son válidas? En caso negativo, el sistema muestra un mensaje de error que indica que el usuario o la contraseña no son válidos o que la cuenta no se encuentra vigente, sin revelar cuál de los dos datos falló.  ¿La cuenta pertenece a un usuario interno? En caso afirmativo, el sistema valida el usuario y la contraseña contra su propio registro de credenciales locales; en caso negativo, el Servicio de validación institucional verifica la identidad y la vigencia de la cuenta.  ¿Se invoca para iniciar sesión o para verificar un usuario en un préstamo? En caso de verificación en un préstamo (en sala o a domicilio), el sistema envía el RU al Servicio de validación institucional, sin solicitar contraseña.  ¿El usuario está vigente? En caso afirmativo, el sistema recibe el nombre y el RU, y permite continuar con el registro del préstamo; en caso negativo, el sistema recibe un código HTTP distinto e informa que el usuario no está vigente.  ¿La cuenta validada es de un usuario académico que aún no está registrado en el sistema bibliotecario? En caso afirmativo, el sistema deriva al registro de sus datos mínimos (RF1.3); en caso negativo, continúa con el acceso sin registrar datos adicionales.

**Requerimientos (RF1.2):**

- RF1.2.1: Este caso de uso permite verificar si las credenciales ingresadas corresponden a un usuario vigente: los usuarios académicos se validan con el Servicio de validación institucional y el personal interno con el registro de credenciales propio del sistema.
- RF1.2.2: Si la validación es correcta, el sistema permite continuar con el acceso.
- RF1.2.3: Si la validación falla, el sistema deniega el ingreso y muestra el mensaje correspondiente.
- [Interfaz] RF1.2.4: La interfaz debe mostrar un mensaje de error específico cuando las credenciales son rechazadas, ya sea por el servicio institucional o por el registro de credenciales local del sistema, indicando que el usuario o la contraseña no son válidos o que la cuenta no se encuentra vigente.
- [Interfaz] RF1.2.5: La interfaz no debe mostrar mensajes que revelen si el error corresponde al usuario o a la contraseña, para evitar dar pistas sobre cuentas existentes.
- [Interfaz] RF1.2.6: Cuando este caso de uso se invoca durante el registro de un préstamo (en sala o a domicilio), el sistema debe enviar únicamente el RU al Servicio de validación institucional, sin solicitar contraseña.
- [Interfaz] RF1.2.7: Si el usuario está vigente, el servicio responde con el nombre, el RU, la carrera y, cuando lo informa, si es estudiante o docente, y el sistema permite continuar con el registro del préstamo.
- [Interfaz] RF1.2.8: Si el usuario no está vigente o no existe, el servicio responde con un código HTTP distinto, y el sistema informa que el usuario no está vigente e impide continuar.
- [Interfaz] RF1.2.9: La interfaz de registro de préstamo (P9.1 en sala, P9.3 a domicilio) debe incluir un campo para ingresar el RU del usuario y mostrar los datos institucionales verificados antes de continuar con el registro.
- [Interfaz] RF1.2.10: Tras una validación correcta para iniciar sesión, la interfaz debe dirigir al usuario a la pantalla que había solicitado o, si no solicitó ninguna, a la pantalla de inicio (P.1 Home) y, mientras la sesión esté activa, mostrar en todas las pantallas el menú lateral con las opciones permitidas para su rol; sin sesión, las pantallas públicas (P.1 Home, P6.1, P6.2, P11.1 y P11.2) se muestran sin menú lateral.

## RF1.3 Registrar datos mínimos del usuario validado

**Actores:** Usuario académico

**Tipo:** Primario

**Referencias:** RF1.3.1; RF1.3.2; RF1.3.3; RF1.3.4

**Propósito:** Permitir registrar dentro del sistema bibliotecario los datos mínimos de un usuario institucional validado, cuando dicho usuario aún no existe en el sistema.

**Resumen:** Este caso de uso permite registrar dentro del sistema bibliotecario los datos mínimos de un usuario institucional validado, cuando dicho usuario aún no existe en el sistema. El sistema debe garantizar que el usuario queda registrado dentro del sistema bibliotecario con los datos mínimos necesarios para utilizar las funcionalidades permitidas según su tipo de usuario o rol.

**Precondiciones:**

- El usuario fue validado correctamente mediante el caso de uso Validar usuario institucional (RF1.2).
- El usuario cuenta con el rol de Usuario académico (docente o estudiante) y aún no existe en el sistema bibliotecario.

**Postcondiciones:** El sistema debe garantizar que el usuario queda registrado dentro del sistema bibliotecario con los datos mínimos necesarios para utilizar las funcionalidades permitidas según su tipo de usuario o rol.

**Curso normal de eventos:**

- 1.- El sistema recibe la confirmación de validación institucional del usuario académico.
- 2.- El sistema verifica si ese usuario ya existe dentro del sistema bibliotecario. La verificación se realiza en la tabla usuario.
- 3.- El sistema toma los datos mínimos entregados por el servicio institucional.
- 4.- El sistema registra el nombre, el RU, la carrera asociada y el rol de Estudiante o Docente cuando el servicio lo informa (en caso contrario, el rol de Usuario académico), sin requerir que el usuario complete ningún formulario adicional. El registro se crea en la tabla usuario, vinculado a las tablas rol y carrera.

**Curso alternativo de eventos:**

- ¿El usuario ya se encontraba registrado en el sistema bibliotecario? En caso negativo, el sistema toma los datos mínimos entregados por el servicio institucional.

**Requerimientos (RF1.3):**

- RF1.3.1: Este caso de uso permite registrar dentro del sistema bibliotecario los datos mínimos de un usuario institucional validado, cuando dicho usuario aún no existe en el sistema.
- RF1.3.2: El sistema debe garantizar que el usuario queda registrado dentro del sistema bibliotecario con los datos mínimos necesarios para utilizar las funcionalidades permitidas según su tipo de usuario o rol.
- [Interfaz] RF1.3.3: La interfaz no requiere que el usuario complete ningún formulario adicional; el registro de sus datos mínimos ocurre de forma automática e inmediata tras la validación institucional.
- [Interfaz] RF1.3.4: La interfaz debe reflejar el acceso habilitado a las funcionalidades correspondientes sin mostrar ningún paso intermedio perceptible para el usuario.

## RF1.4 Consultar perfil de usuario

**Actores:** Usuario académico, Usuario interno

**Tipo:** Primario

**Referencias:** RF1.4.1; RF1.4.2; RF1.4.3; RF1.4.4; RF1.4.5

**Propósito:** Permitir al usuario autenticado visualizar la información básica de su perfil dentro del sistema bibliotecario.

**Resumen:** Este caso de uso permite al usuario autenticado visualizar la información básica de su perfil dentro del sistema bibliotecario. El sistema muestra la información del perfil del usuario.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Usuario académico (docente o estudiante) o Usuario interno.

**Postcondiciones:** El sistema muestra la información del perfil del usuario.

**Curso normal de eventos:**

- 1.- El actor selecciona su nombre de usuario en el header global.
- 2.- El sistema abre la interfaz P1.2 con la información del perfil del usuario autenticado. Los datos se obtienen de las tablas usuario, rol, biblioteca, carrera y facultad.
- 3.- El actor revisa la sección de datos personales.
- 4.- El sistema muestra el nombre completo, el nombre de usuario y el correo institucional cuando corresponde.
- 5.- El actor consulta el rol asignado y su dependencia institucional.
- 6.- El sistema muestra el rol asignado y la biblioteca o facultad y carrera relacionada según el tipo de usuario.

**Curso alternativo de eventos:**

- ¿El perfil incluye campos habilitados para edición? En caso negativo, el sistema mantiene la pantalla en modo de solo lectura, sin ofrecer opciones de edición sobre los datos mostrados.

**Requerimientos (RF1.4):**

- RF1.4.1: Este caso de uso permite al usuario autenticado visualizar la información básica de su perfil dentro del sistema bibliotecario.
- RF1.4.2: El sistema muestra la información del perfil del usuario.
- RF1.4.3: El sistema debe garantizar que no se modifica información del sistema, salvo que en una especificación posterior se contemple una funcionalidad de actualización de datos permitidos.
- [Interfaz] RF1.4.4: La interfaz debe presentar los datos del perfil organizados en secciones (datos personales, rol asignado y «Biblioteca / facultad relacionada», según corresponda).
- [Interfaz] RF1.4.5: La interfaz no debe incluir opciones de edición sobre los datos mostrados, salvo los campos explícitamente habilitados para actualización.

## RF1.5 Cerrar sesión

**Actores:** Usuario académico, Usuario interno

**Tipo:** Primario

**Referencias:** RF1.5.1; RF1.5.2; RF1.5.3; RF1.5.4

**Propósito:** Permitir finalizar de forma segura la sesión activa del usuario dentro del sistema bibliotecario.

**Resumen:** Este caso de uso permite finalizar de forma segura la sesión activa del usuario dentro del sistema bibliotecario. El sistema debe garantizar que la sesión del usuario queda finalizada y el sistema impide el acceso a funcionalidades protegidas hasta que el usuario vuelva a autenticarse.

**Precondiciones:**

- El usuario ha iniciado sesión en el sistema.
- El usuario cuenta con el rol de Usuario académico (docente o estudiante) o Usuario interno.

**Postcondiciones:** El sistema debe garantizar que la sesión del usuario queda finalizada y el sistema impide el acceso a funcionalidades protegidas hasta que el usuario vuelva a autenticarse.

**Curso normal de eventos:**

- 1.- El actor selecciona la opción «Cerrar sesión» del header global, disponible desde cualquier pantalla autenticada.
- 2.- El sistema muestra el cuadro de diálogo «¿Cerrar sesión?» para confirmar el cierre de la sesión activa.
- 3.- El actor hace clic en el botón «Confirmar» del cuadro de diálogo de cierre de sesión.
- 4.- El sistema finaliza la sesión activa, descarta las credenciales en uso y redirige al actor a la pantalla P.1 Home, donde impide el acceso a las funcionalidades protegidas hasta una nueva autenticación.

**Curso alternativo de eventos:**

- ¿La sesión fue finalizada correctamente? En caso negativo, el sistema informa que no fue posible cerrar la sesión y la mantiene activa hasta que la operación se complete.

**Requerimientos (RF1.5):**

- RF1.5.1: Este caso de uso permite finalizar de forma segura la sesión activa del usuario dentro del sistema bibliotecario.
- RF1.5.2: El sistema debe garantizar que la sesión del usuario queda finalizada y el sistema impide el acceso a funcionalidades protegidas hasta que el usuario vuelva a autenticarse.
- [Interfaz] RF1.5.3: La interfaz debe incluir una opción visible de cierre de sesión, accesible desde cualquier pantalla del sistema una vez autenticado el usuario.
- [Interfaz] RF1.5.4: La interfaz debe redirigir automáticamente a la pantalla de inicio (P.1 Home) al finalizar la sesión.
