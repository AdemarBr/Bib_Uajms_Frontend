# Sistema de diseño (variables de Figma)

Valores tomados de las variables y estilos locales del archivo de Figma. Se trasladan a Tailwind CSS v4 con `@theme` en `src/styles.css`. No inventar colores ni tamaños fuera de esta lista.

## Colores

| Variable de Figma | Valor | Token sugerido |
|---|---|---|
| brand/dark | `#232931` | `--color-brand-dark` (menú lateral, fondo inverso) |
| brand/dark-alt | `#393e46` | `--color-brand-dark-alt` (hover del primario) |
| brand/accent | `#4ecca3` | `--color-brand-accent` (botón primario, estado activo) |
| brand/light | `#eeeeee` | `--color-brand-light` (fondo de la aplicación) |
| gray/0 … gray/1000 | `#ffffff`, 50 `#fafafa`, 100 `#f2f2f2`, 200 `#e4e4e4`, 300 `#d1d1d1`, 400 `#b0b0b0`, 500 `#8a8a8a`, 600 `#6b6b6b`, 700 `#4a4a4a`, 800 `#2e2e2e`, 900 `#1a1a1a`, 1000 `#000000` | `--color-gray-*` |

Colores sueltos de componentes de Figma (no son variables del archivo, pero se usan en los componentes):

| Uso en Figma | Valor | Token |
|---|---|---|
| Encabezados de grupo del menú lateral («DASHBOARDS», «REPORTES») | `#9ea8b2` | `--color-menu-grupo` |
| Interruptor de estado apagado («Control de estado») | `#c7ccd6` | `--color-interruptor-inactivo` |

Alias semánticos de Figma: fondo de lienzo = brand/light; superficie = gray/0; superficie alternativa = gray/100; fondo inverso = brand/dark; deshabilitado = gray/100; primario = brand/accent; primario hover = brand/dark-alt; texto primario = gray/900; texto secundario = gray/600; texto deshabilitado = gray/400; texto inverso = gray/0; borde = gray/300; borde fuerte = gray/500; borde de foco = gray/900; íconos = gray/600 (inverso gray/0). Fondo del modal: negro al 40 %.

## Tipografía (Inter)

| Estilo | Fuente | Tamaño / interlineado |
|---|---|---|
| type/h1 | Inter Bold | 28 / 34 |
| type/h2 | Inter Bold | 22 / 28 |
| type/h3 | Inter Semi Bold | 18 / 24 |
| type/body | Inter Regular | 14 / 20 |
| type/body-strong | Inter Semi Bold | 14 / 20 |
| type/caption | Inter Regular | 12 / 16 |
| type/label | Inter Semi Bold | 12 / 16 |

Tamaños que los componentes de Figma usan sin estilo de texto propio (interlineado normal):

| Uso en Figma | Tamaño | Token |
|---|---|---|
| Título «Iniciar sesión» del panel de P1.1 | 20 | `--text-titulo-panel` |
| Título «Biblioteca UAJMS» de la barra superior, título del modal, flechas del paginador | 16 | `--text-subtitulo` |
| Valores de datos en P1.2 | 15 | `--text-dato` |
| Celdas de tabla, mensaje del modal, números del paginador | 13 | `--text-tabla` |
| Encabezados de grupo del menú lateral, textos de ayuda | 11 | `--text-mini` |

## Espaciado y radios

- Espaciado: xs 4, sm 8, md 12, lg 16, xl 24, 2xl 32, 3xl 48 (px).
- Radios: none 0, sm 4, md 8, lg 12, full 999 (px).
- En Tailwind: `p-lg`, `gap-sm`, `rounded-md`, `text-h2`, `text-body-strong`, `bg-brand-accent`, `text-gray-600`, etc. (definidos con `@theme` en `src/styles.css`; la escala `gray` de Tailwind se reemplaza por la de Figma).
- Alerta (Tone=Error): `app-alerta`, recuadro de 320 px con fondo gray/100, borde gray/500, título body-strong y mensaje caption.
- Botones y campos: clases `.btn-primario`, `.btn-secundario` y `.campo-texto` en `src/styles.css` (Button Primary/Secondary e Input/Text de Figma).

## Pantalla

- Diseño de escritorio a 1440 px de ancho: barra superior, menú lateral oscuro (brand/dark) y pie de página, como en Figma.
- Íconos: `@lucide/angular`. Los íconos del menú lateral de Figma son dibujos propios; se usan sus equivalentes de Lucide: User, School, Book, Layers (Ejemplares), Bookmark, Calendar, ArrowRightLeft (Préstamos), GraduationCap, MessageSquare, ChartNoAxesColumn; en la barra superior, CircleUser con un punto brand/accent. Gráficos: Chart.js con `ng2-charts`.
