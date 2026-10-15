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
- Alerta: `app-alerta`, recuadro de hasta 320 px con fondo gray/100, título body-strong y mensaje caption; borde gray/500 (Tone=Error) o gray/300 (Tone=Success, P2.4).
- Chip (P2.5): fondo gray/100, borde gray/300, radio full, padding 4 × 8, texto caption gray/900. Tarjeta de rol: borde gray/300, radio md, padding lg, título 15 Semi Bold (`--text-dato`).
- Chip seleccionado (pestañas de P3.1): fondo brand/dark, borde gray/300 y texto gray/0; los no seleccionados, como el Chip de P2.5.
- Radio (P3.2 y P3.3): clase `.radio` de `src/styles.css` sobre `<input type="radio">`, 18 px, aro de 1,5 px gray/500 y, marcado, punto de 5 px brand/accent; separación de 8 px con su texto y de 20 px entre opciones.
- Tarjetas de formulario (RF2 y RF3): borde gray/300, radio lg, padding 2xl y separación lg. Figma dibuja el borde por dentro y no lo cuenta en el ancho; en CSS sí cuenta, así que el ancho en código es el de Figma + 2 px: P2.1 1052, P2.3 628, P2.4 352, P3.2 363, P3.3 250, P3.4 725 y P3.5 917 px. Selects de 240 px (en P3.3, de todo el ancho; en Facultad y Carrera de P3.5, 256 px para que «No aplica — Biblioteca Central» se lea completo). Textos de ayuda de P3.4 y P3.5: 11 px (`--text-mini`) gray/600. Modal «Usuario registrado correctamente»: 560 px, padding 24 × 32, título 18 Bold.
- RF4: tarjetas de P4.2 y P4.4 de 562 px; en P4.1, el formulario ocupa el ancho libre y el recuadro «Portada» mide 282 px (imagen de 180 × 240, fondo gray/100, radio sm). En P4.4 el recuadro «Portada» va dentro de la tarjeta, de todo el ancho, y los campos llenos tienen borde gray/500. Enlace «Ver historial de cambios»: 14 px brand/accent subrayado. Filtros de P4.3: selects de 140 px con etiqueta visible (`text-label` gray/600) encima.
- RF5: tarjetas de P5.1 y P5.3 de 482 px; filtros de P5.2 de 150 px con etiqueta visible, como en P4.3. Disponibilidad de P5.2 (RF5.6.4): `app-badge-estado` con `tono="disponible"` (fondo brand/accent, texto gray/0) si el ejemplar está disponible y tono neutral (gray/100) con el estado que lo restringe si no. Ubicación vacía: «Sin ubicación asignada» en gray/600. Ayuda de estados de P5.3: 11 px gray/600.
- Botones y campos: clases `.btn-primario`, `.btn-secundario` y `.campo-texto` en `src/styles.css` (Button Primary/Secondary e Input/Text de Figma).

## Pantalla

- Diseño de escritorio a 1440 px de ancho: barra superior y pie de página; con sesión, además el menú lateral oscuro (brand/dark) en todas las pantallas (RF1.2.10), como en Figma.
- Íconos: `@lucide/angular`. Los íconos del menú lateral de Figma son dibujos propios; se usan sus equivalentes de Lucide: User, School, Book, Layers (Ejemplares), Bookmark, Calendar, ArrowRightLeft (Préstamos), GraduationCap, MessageSquare, ChartNoAxesColumn; en la barra superior, CircleUser con un punto brand/accent. Gráficos: Chart.js con `ng2-charts`.
