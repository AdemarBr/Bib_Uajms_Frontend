# Usuarios de prueba del prototipo (Iteración 4)

Datos falsos que viven en el frontend (`core/auth/usuarios.mock.ts`). Sirven para iniciar sesión con cada rol y ver su menú y pantallas. Los académicos inician sesión con su RU.

«Ademar Mendez» (barra superior), «Estudiante Pérez» (P9.1), «Docente Gómez» y «Estudiante Rojas» (P12.1) aparecen en las pantallas de Figma; el resto de los datos son ficticios. Las contraseñas solo existen en el prototipo: nunca van a la base de datos ni al backend. La función `loginSimulado` (`core/auth/login-simulado.ts`) valida contra esta tabla y, ante cualquier fallo, responde el mismo error 401 genérico (ver `CLAUDE.md`).

| Rol | Usuario | Contraseña | Datos |
|---|---|---|---|
| Estudiante | `2019001234` (RU) | `demo123` | Estudiante Pérez, Ingeniería de Sistemas |
| Docente | `1998005678` (RU) | `demo123` | Docente Gómez, Ingeniería de Sistemas |
| Usuario académico | `2020009999` (RU) | `demo123` | Académico Vargas; usuario sin tipo informado por el servicio, sin carrera |
| Bibliotecario | `bibliotecario.central` | `demo123` | Carla Ríos (ejemplo de `UsuarioResponse` del contrato), Biblioteca Central |
| Catalogador | `catalogador.central` | `demo123` | Marco Salazar, Biblioteca Central |
| Administrador de biblioteca | `admin.biblioteca` | `demo123` | Julia Altamirano (Administradora de biblioteca en P2.2), Biblioteca Central |
| Responsable de tesis y solvencias | `responsable.tesis` | `demo123` | Rosa Benítez, sin biblioteca |
| Administrador general del sistema | `admin.general` | `demo123` | Ademar Mendez, sin biblioteca («—» en P2.2, como en Figma; su rol no lleva biblioteca responsable, RF2.5); todos los permisos |
| Bibliotecario (inactivo) | `bibliotecario.inactivo` | `demo123` | Hugo Torrez; usuario desactivado: su login debe fallar con el mismo 401 genérico |

## Perfil (P1.2)

Los datos de `GET /auth/perfil` están en `features/autenticacion/data-access/perfil.mock.ts`:

- Internos: correo `<usuario>@uajms.edu.bo` (como `admin.general@uajms.edu.bo` en Figma) y sin RU.
- Académicos: sin correo (la fila no se muestra) y con su RU. Estudiante Pérez y Docente Gómez: Facultad de Ciencias y Tecnología / Ingeniería de Sistemas; Académico Vargas: sin facultad ni carrera («—»).
- Sección «Biblioteca / facultad relacionada»: Administrador general → «Facultad / Carrera: No aplica — acceso a todas» (Figma); académicos → «Facultad / Carrera: <facultad> / <carrera>»; internos con biblioteca → «Biblioteca: <nombre>»; internos sin biblioteca (Responsable de tesis) → «Biblioteca: No aplica».

## Usuarios de P2.2 (RF2)

La lista de «Consultar usuarios del sistema» (`features/usuarios/data-access/usuarios.mock.ts`) tiene 14 usuarios, como el contador de Figma: los nueve de la tabla anterior, «Bibliotecario FCyT» (`bibliotecario.fcyt`, inactivo, Biblioteca FCyT; fila de Figma) y cuatro internos ficticios: Lucía Fernández (`catalogador.fcyt`, Catalogador, Biblioteca FCyT), Pedro Cruz (`bibliotecario.derecho`, Bibliotecario, Biblioteca Facultad de Derecho), Ana Quiroga (`admin.derecho`, Administrador de biblioteca, Biblioteca Facultad de Derecho) y Mario Vaca (`catalogador.derecho`, Catalogador, Biblioteca Facultad de Derecho).

- Esta lista es independiente de `core/auth/usuarios.mock.ts`: los cinco usuarios añadidos y los que se registran en P2.1 no pueden iniciar sesión, y activar, desactivar o editar un usuario en P2.2/P2.3 no cambia su login en el prototipo (en la Iteración 5 ambos leen la misma tabla `usuario`).
- Bibliotecas (`features/estructura/data-access/bibliotecas.mock.ts`, pestaña Bibliotecas de P3.1 en Figma): 1 Biblioteca Central, 2 Biblioteca FCyT, 3 Biblioteca Facultad de Derecho.
- Roles (`features/usuarios/data-access/roles.mock.ts`): ids 1 a 8 en el orden de `docs/permisos.md` (Estudiante, Docente, Usuario académico, Bibliotecario = 4 como en el contrato, Catalogador, Administrador de biblioteca, Responsable de tesis y solvencias, Administrador general del sistema).
- P2.1 genera el nombre de usuario con la inicial del nombre y el último apellido, sin tildes («Juan Pérez» → `jperez`, con un número si ya existe), y una contraseña aleatoria de 10 caracteres.

## Servicio de validación institucional simulado

En el prototipo, la validación por RU (préstamos P9.1 y P9.3) consulta una lista de RU vigentes dentro del frontend (`core/auth/servicio-institucional.mock.ts`):

- RU de los tres académicos anteriores: vigentes y ya registrados.
- `2021004321`: Estudiante Mamani, Ingeniería de Sistemas; vigente pero **no registrado** en el sistema, para mostrar el alta automática de datos mínimos antes del préstamo (la primera validación responde `registradoAhora: true`).
- `2010000000` (o cualquier otro RU): no vigente; responde 404 con `titulo: "Usuario no vigente"` y `detalle: "El usuario no está vigente o es inexistente."` (texto de RF1.2).
