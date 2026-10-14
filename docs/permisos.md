# Permisos y matriz por rol

Los permisos se guardan en las tablas `permiso` y `rol_permiso` (datos iniciales de la migración V2). El backend los envía en el login y los vuelve a verificar en cada petición; el frontend los usa para el menú, los guards y la directiva `*appTienePermiso`.

- Funcionalidades públicas sin permiso: consultar catálogo y tesis digitales (incluye visitantes).
- Iniciar sesión, ver perfil y cerrar sesión solo requieren sesión.
- El Administrador general del sistema tiene **todos** los permisos (RF08 de seguridad).
- El ámbito por biblioteca del Administrador de biblioteca no es un permiso: se filtra con `usuario.id_biblioteca`.

Roles: EST = Estudiante, DOC = Docente, UAC = Usuario académico, BIB = Bibliotecario, CAT = Catalogador, ADB = Administrador de biblioteca, RTS = Responsable de tesis y solvencias, ADG = Administrador general del sistema.

| Módulo | Código | Permiso | EST | DOC | UAC | BIB | CAT | ADB | RTS | ADG |
|---|---|---|---|---|---|---|---|---|---|---|
| Usuarios y roles | `USUARIO_REGISTRAR` | Registrar usuario interno |  |  |  |  |  |  |  | ✔ |
| Usuarios y roles | `USUARIO_CONSULTAR` | Consultar, buscar y filtrar usuarios |  |  |  |  |  |  |  | ✔ |
| Usuarios y roles | `USUARIO_ACTUALIZAR` | Actualizar datos de usuario |  |  |  |  |  |  |  | ✔ |
| Usuarios y roles | `USUARIO_ASIGNAR_ROL` | Asignar rol de usuario |  |  |  |  |  |  |  | ✔ |
| Usuarios y roles | `USUARIO_ASIGNAR_BIBLIOTECA` | Asignar biblioteca responsable |  |  |  |  |  |  |  | ✔ |
| Usuarios y roles | `USUARIO_CAMBIAR_ESTADO` | Activar y desactivar usuario |  |  |  |  |  |  |  | ✔ |
| Usuarios y roles | `USUARIO_RESTABLECER_PASSWORD` | Restablecer contraseña de usuario interno |  |  |  |  |  |  |  | ✔ |
| Usuarios y roles | `PERMISO_CONSULTAR` | Consultar permisos por rol |  |  |  |  |  |  |  | ✔ |
| Bibliotecas, facultades y carreras | `BIBLIOTECA_REGISTRAR` | Registrar biblioteca física |  |  |  |  |  |  |  | ✔ |
| Bibliotecas, facultades y carreras | `BIBLIOTECA_ACTUALIZAR` | Actualizar datos de biblioteca |  |  |  |  |  |  |  | ✔ |
| Bibliotecas, facultades y carreras | `FACULTAD_REGISTRAR` | Registrar facultad |  |  |  |  |  |  |  | ✔ |
| Bibliotecas, facultades y carreras | `FACULTAD_ACTUALIZAR` | Actualizar datos de facultad |  |  |  |  |  |  |  | ✔ |
| Bibliotecas, facultades y carreras | `CARRERA_REGISTRAR` | Registrar carrera |  |  |  |  |  |  |  | ✔ |
| Bibliotecas, facultades y carreras | `CARRERA_ACTUALIZAR` | Actualizar datos de carrera |  |  |  |  |  |  |  | ✔ |
| Bibliotecas, facultades y carreras | `ESTRUCTURA_CONSULTAR` | Consultar bibliotecas, facultades y carreras |  |  |  |  |  |  |  | ✔ |
| Catálogo de libros | `LIBRO_REGISTRAR` | Registrar libro |  |  |  |  | ✔ | ✔ |  | ✔ |
| Catálogo de libros | `LIBRO_CONSULTAR` | Consultar, buscar y filtrar libros registrados |  |  |  |  | ✔ | ✔ |  | ✔ |
| Catálogo de libros | `LIBRO_ACTUALIZAR` | Actualizar datos del libro |  |  |  |  | ✔ | ✔ |  | ✔ |
| Catálogo de libros | `LIBRO_DESACTIVAR` | Desactivar libro |  |  |  |  | ✔ | ✔ |  | ✔ |
| Catálogo de libros | `LIBRO_IMPORTAR` | Importar libros mediante archivo |  |  |  |  | ✔ | ✔ |  | ✔ |
| Catálogo de libros | `LIBRO_HISTORIAL_CONSULTAR` | Consultar historial de cambios del libro |  |  |  |  | ✔ | ✔ |  | ✔ |
| Ejemplares | `EJEMPLAR_REGISTRAR` | Registrar ejemplar y asignar su código |  |  |  |  | ✔ | ✔ |  | ✔ |
| Ejemplares | `EJEMPLAR_CONSULTAR` | Consultar ejemplares, su disponibilidad y ubicación |  |  |  |  | ✔ | ✔ |  | ✔ |
| Ejemplares | `EJEMPLAR_ACTUALIZAR` | Actualizar datos del ejemplar |  |  |  |  | ✔ | ✔ |  | ✔ |
| Ejemplares | `EJEMPLAR_CAMBIAR_ESTADO` | Actualizar estado del ejemplar |  |  |  |  | ✔ | ✔ |  | ✔ |
| Reservas propias | `RESERVA_REALIZAR` | Realizar reserva de libro | ✔ | ✔ | ✔ |  |  |  |  | ✔ |
| Reservas propias | `RESERVA_PROPIA_CONSULTAR` | Consultar estado de sus reservas | ✔ | ✔ | ✔ |  |  |  |  | ✔ |
| Reservas propias | `RESERVA_PROPIA_CANCELAR` | Cancelar su reserva | ✔ | ✔ | ✔ |  |  |  |  | ✔ |
| Administración de reservas | `RESERVA_CONSULTAR` | Consultar reservas registradas y por biblioteca |  |  |  | ✔ |  | ✔ |  | ✔ |
| Administración de reservas | `RESERVA_CONFIRMAR` | Confirmar reserva |  |  |  | ✔ |  | ✔ |  | ✔ |
| Administración de reservas | `RESERVA_RECHAZAR` | Rechazar reserva |  |  |  | ✔ |  | ✔ |  | ✔ |
| Administración de reservas | `RESERVA_CANCELAR` | Cancelar reserva administrativa |  |  |  | ✔ |  | ✔ |  | ✔ |
| Administración de reservas | `RESERVA_HISTORIAL_CONSULTAR` | Consultar historial de reservas |  |  |  | ✔ |  | ✔ |  | ✔ |
| Préstamos y devoluciones | `PRESTAMO_SALA_REGISTRAR` | Registrar préstamo en sala |  |  |  | ✔ |  |  |  | ✔ |
| Préstamos y devoluciones | `PRESTAMO_DOMICILIO_REGISTRAR` | Registrar préstamo a domicilio |  |  |  | ✔ |  |  |  | ✔ |
| Préstamos y devoluciones | `PRESTAMO_CONSULTAR` | Consultar préstamos vigentes |  |  |  | ✔ |  |  |  | ✔ |
| Préstamos y devoluciones | `PRESTAMO_AMPLIAR` | Ampliar plazo de préstamo a domicilio |  |  |  | ✔ |  |  |  | ✔ |
| Préstamos y devoluciones | `DEVOLUCION_REGISTRAR` | Registrar devolución de libro |  |  |  | ✔ |  |  |  | ✔ |
| Préstamos y devoluciones | `DEVOLUCION_HISTORIAL_CONSULTAR` | Consultar historial de devoluciones |  |  |  | ✔ |  |  |  | ✔ |
| Tesis | `TESIS_REGISTRAR` | Registrar tesis |  |  |  |  |  |  | ✔ | ✔ |
| Tesis | `TESIS_CONSULTAR` | Consultar, buscar y filtrar tesis registradas |  |  |  |  |  |  | ✔ | ✔ |
| Tesis | `TESIS_ACTUALIZAR` | Actualizar datos de tesis |  |  |  |  |  |  | ✔ | ✔ |
| Tesis | `TESIS_DESACTIVAR` | Desactivar tesis |  |  |  |  |  |  | ✔ | ✔ |
| Tesis | `TESIS_DOCUMENTO_CARGAR` | Cargar documentos digitales de tesis |  |  |  |  |  |  | ✔ | ✔ |
| Tesis | `TESIS_DOCUMENTO_ACTUALIZAR` | Actualizar documento digital de tesis |  |  |  |  |  |  | ✔ | ✔ |
| Comunicación: enviar consulta | `MENSAJE_ENVIAR_CONSULTA` | Enviar consulta al bibliotecario | ✔ | ✔ | ✔ |  |  |  |  | ✔ |
| Comunicación: consultar mensajes | `MENSAJE_CONSULTAR` | Consultar mensajes enviados y recibidos | ✔ | ✔ | ✔ | ✔ |  |  |  | ✔ |
| Comunicación: responder | `MENSAJE_RESPONDER` | Responder consulta del usuario |  |  |  | ✔ |  |  |  | ✔ |
| Reportes y dashboards | `DASHBOARD_VER` | Visualizar dashboards y filtrar estadísticas |  |  |  | ✔ |  | ✔ |  | ✔ |
| Reportes y dashboards | `REPORTE_GENERAR` | Generar reportes |  |  |  | ✔ |  | ✔ |  | ✔ |
| Reportes y dashboards | `REPORTE_EXPORTAR` | Exportar reportes |  |  |  | ✔ |  | ✔ |  | ✔ |
