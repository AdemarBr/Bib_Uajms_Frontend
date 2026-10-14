# Usuarios de prueba del prototipo (Iteración 4)

Datos falsos que viven en el frontend (`core/auth/usuarios.mock.ts`). Sirven para iniciar sesión con cada rol y ver su menú y pantallas. Los académicos inician sesión con su RU.

«Ademar Mendez» (barra superior), «Estudiante Pérez» (P9.1), «Docente Gómez» y «Estudiante Rojas» (P12.1) aparecen en las pantallas de Figma; el resto de los datos son ficticios. Las contraseñas solo existen en el prototipo: nunca van a la base de datos ni al backend. La función `loginSimulado` (`core/auth/login-simulado.ts`) valida contra esta tabla y, ante cualquier fallo, responde el mismo error 401 genérico (ver `CLAUDE.md`).

| Rol | Usuario | Contraseña | Datos |
|---|---|---|---|
| Estudiante | `2019001234` (RU) | `demo123` | Estudiante Pérez, Ingeniería de Sistemas |
| Docente | `1998005678` (RU) | `demo123` | Docente Gómez, Ingeniería de Sistemas |
| Usuario académico | `2020009999` (RU) | `demo123` | Usuario sin tipo informado por el servicio |
| Bibliotecario | `bibliotecario.central` | `demo123` | Biblioteca Central |
| Catalogador | `catalogador.central` | `demo123` | Biblioteca Central |
| Administrador de biblioteca | `admin.biblioteca` | `demo123` | Biblioteca Central |
| Responsable de tesis y solvencias | `responsable.tesis` | `demo123` | — |
| Administrador general del sistema | `admin.general` | `demo123` | Ademar Mendez; todos los permisos |
| Bibliotecario (inactivo) | `bibliotecario.inactivo` | `demo123` | Usuario desactivado: su login debe fallar con el mismo 401 genérico |

## Servicio de validación institucional simulado

En el prototipo, la validación por RU (préstamos P9.1 y P9.3) consulta una lista de RU vigentes dentro del frontend (`core/auth/servicio-institucional.mock.ts`):

- RU de los tres académicos anteriores: vigentes y ya registrados.
- `2021004321`: vigente pero **no registrado** en el sistema, para mostrar el alta automática de datos mínimos antes del préstamo.
- `2010000000`: no vigente, para mostrar el mensaje de error.
