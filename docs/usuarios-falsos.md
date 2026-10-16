# Usuarios de prueba del prototipo (Iteración 4)

Datos falsos que viven en el frontend (`core/auth/usuarios.mock.ts`). Sirven para iniciar sesión con cada rol y ver su menú y pantallas. Los académicos inician sesión con su RU.

«Ademar Mendez» (barra superior), «Estudiante Pérez» (P9.1), «Docente Gómez» y «Estudiante Rojas» (P12.1) aparecen en las pantallas de Figma; el resto de los datos son ficticios. Las contraseñas solo existen en el prototipo: nunca van a la base de datos ni al backend. La función `loginSimulado` (`core/auth/login-simulado.ts`) valida contra esta tabla y, ante cualquier fallo, responde el mismo error 401 genérico (ver `CLAUDE.md`).

| Rol | Usuario | Contraseña | Datos |
|---|---|---|---|
| Estudiante | `2019001234` (RU) | `demo123` | Estudiante Pérez, Ingeniería de Sistemas |
| Docente | `1998005678` (RU) | `demo123` | Docente Gómez, Ingeniería de Sistemas |
| Usuario académico | `2020009999` (RU) | `demo123` | Académico Vargas; usuario sin tipo informado por el servicio, sin carrera |
| Estudiante | `2022003456` (RU) | `demo123` | Estudiante Rojas, Ingeniería de Sistemas (aparece en P8.1, P8.2 y P12.1 de Figma) |
| Bibliotecario | `bibliotecario.central` | `demo123` | Carla Ríos (ejemplo de `UsuarioResponse` del contrato), Biblioteca Central |
| Catalogador | `catalogador.central` | `demo123` | Marco Salazar, Biblioteca Central |
| Administrador de biblioteca | `admin.biblioteca` | `demo123` | Julia Altamirano (Administradora de biblioteca en P2.2), Biblioteca Central |
| Responsable de tesis y solvencias | `responsable.tesis` | `demo123` | Rosa Benítez, sin biblioteca |
| Administrador general del sistema | `admin.general` | `demo123` | Ademar Mendez, sin biblioteca («—» en P2.2, como en Figma; su rol no lleva biblioteca responsable, RF2.5); todos los permisos |
| Bibliotecario (inactivo) | `bibliotecario.inactivo` | `demo123` | Hugo Torrez; usuario desactivado: su login debe fallar con el mismo 401 genérico |

## Perfil (P1.2)

Los datos de `GET /auth/perfil` están en `features/autenticacion/data-access/perfil.mock.ts`:

- Internos: correo `<usuario>@uajms.edu.bo` (como `admin.general@uajms.edu.bo` en Figma) y sin RU.
- Académicos: sin correo (la fila no se muestra) y con su RU. Estudiante Pérez, Docente Gómez y Estudiante Rojas: Facultad de Ciencias y Tecnología / Ingeniería de Sistemas; Académico Vargas: sin facultad ni carrera («—»).
- Sección «Biblioteca / facultad relacionada»: Administrador general → «Facultad / Carrera: No aplica — acceso a todas» (Figma); académicos → «Facultad / Carrera: <facultad> / <carrera>»; internos con biblioteca → «Biblioteca: <nombre>»; internos sin biblioteca (Responsable de tesis) → «Biblioteca: No aplica».

## Usuarios de P2.2 (RF2)

La lista de «Consultar usuarios del sistema» (`features/usuarios/data-access/usuarios.mock.ts`) tiene 15 usuarios (uno más que el contador de Figma, por Estudiante Rojas, agregado en RF8): los diez de la tabla anterior, «Bibliotecario FCyT» (`bibliotecario.fcyt`, inactivo, Biblioteca FCyT; fila de Figma) y cuatro internos ficticios: Lucía Fernández (`catalogador.fcyt`, Catalogador, Biblioteca FCyT), Pedro Cruz (`bibliotecario.derecho`, Bibliotecario, Biblioteca Facultad de Derecho), Ana Quiroga (`admin.derecho`, Administrador de biblioteca, Biblioteca Facultad de Derecho) y Mario Vaca (`catalogador.derecho`, Catalogador, Biblioteca Facultad de Derecho).

- Esta lista es independiente de `core/auth/usuarios.mock.ts`: los cinco usuarios añadidos y los que se registran en P2.1 no pueden iniciar sesión, y activar, desactivar o editar un usuario en P2.2/P2.3 no cambia su login en el prototipo (en la Iteración 5 ambos leen la misma tabla `usuario`).
- Bibliotecas: las de «Bibliotecas, facultades y carreras» (sección siguiente). La validación de P2.1 y P2.3 usa los datos iniciales de `bibliotecas.mock.ts`: renombrar o crear una biblioteca en P3.4/P3.5 no cambia los nombres que se ven en P2.2 ni las opciones de P2.1 y P2.3 durante la sesión (decisión del estudiante; en la Iteración 5 todo sale de la misma tabla `biblioteca`).
- Roles (`features/usuarios/data-access/roles.mock.ts`): ids 1 a 8 en el orden de `docs/permisos.md` (Estudiante, Docente, Usuario académico, Bibliotecario = 4 como en el contrato, Catalogador, Administrador de biblioteca, Responsable de tesis y solvencias, Administrador general del sistema).
- P2.1 genera el nombre de usuario con la inicial del nombre y el último apellido, sin tildes («Juan Pérez» → `jperez`, con un número si ya existe), y una contraseña aleatoria de 10 caracteres.

## Bibliotecas, facultades y carreras (RF3)

Datos de `features/estructura/data-access/` (`facultades.mock.ts`, `carreras.mock.ts`, `bibliotecas.mock.ts`), compartidos por los servicios `Facultades`, `Carreras` y `Bibliotecas` a través de `DatosEstructura`. Se toma todo lo que aparece en las pestañas de P3.1 en Figma y lo mínimo para que cuadre (decisión del estudiante):

- Facultades: 1 Facultad de Ciencias y Tecnología, 2 Facultad de Ciencias Económicas, 3 Facultad de Ciencias de la Salud (inactiva, como en Figma) y 4 Facultad de Derecho (agregada porque existe «Biblioteca Facultad de Derecho»).
- Carreras: Ingeniería de Sistemas, Ingeniería Civil y Contaduría Pública (inactiva) salen de Figma; el resto son ficticias, con nombres verosímiles, para que los conteos coincidan con Figma (8, 4 y 3): FCyT — Ingeniería Informática, Química, de Alimentos, del Petróleo y Gas Natural, Industrial y Topografía y Geodesia; Ciencias Económicas — Economía, Administración de Empresas e Ingeniería Comercial; Ciencias de la Salud — Medicina, Enfermería y Odontología (inactivas); Derecho — Derecho.
- Bibliotecas: 1 Biblioteca Central (`esBibliotecaCentral`), 2 Biblioteca FCyT, 3 Biblioteca Facultad de Derecho, 4 Biblioteca de Economía, 5 Biblioteca de Salud (todas de toda la facultad) y 6 Biblioteca de Postgrado (sin facultad ni carrera, como la Central). Ubicaciones de la Central, FCyT y Derecho de Figma; las de Economía, Salud y Postgrado son ficticias. Descripciones de las tarjetas «Bibliotecas disponibles» de la Home (Figma 9:7): Central «Biblioteca principal de la universidad», FCyT «Colección de ciencias y tecnología», Derecho «Colección de ciencias jurídicas», Economía «Colección de ciencias económicas y financieras», Salud «Colección de ciencias de la salud» y Postgrado «Colección de programas de postgrado».

## Servicio de validación institucional simulado

En el prototipo, la validación por RU (préstamos P9.1 y P9.3) consulta una lista de RU vigentes dentro del frontend (`core/auth/servicio-institucional.mock.ts`):

- RU de los tres académicos anteriores: vigentes y ya registrados.
- `2021004321`: Estudiante Mamani, Ingeniería de Sistemas; vigente pero **no registrado** en el sistema, para mostrar el alta automática de datos mínimos antes del préstamo (la primera validación responde `registradoAhora: true`).
- `2010000000` (o cualquier otro RU): no vigente; responde 404 con `titulo: "Usuario no vigente"` y `detalle: "El usuario no está vigente o es inexistente."` (texto de RF1.2).
