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
- RF5: tarjetas de P5.1 y P5.3 de 482 px; filtros de P5.2 de 150 px con etiqueta visible, como en P4.3. Disponibilidad de P5.2 (RF5.6.4): `app-badge-estado` con `tono="acento"` (fondo brand/accent, texto gray/0) si el ejemplar está disponible y tono neutral (gray/100) con el estado que lo restringe si no. Ubicación vacía: «Sin ubicación asignada» en gray/600. Ayuda de estados de P5.3: 11 px gray/600.
- RF6: Card de Figma (`features/catalogo/components/tarjeta`): borde gray/300, radio md, padding lg, separación sm, imagen de 120 px (gray/100, radio sm), título body-strong y texto caption gray/600. Ancho 282 px en P6.1 (280 de Figma + 2 de borde); en Home se usan los anchos de Figma sin sumar el borde, 280 px sin sesión y 256 px con sesión, porque con sesión cuatro novedades ocupan justo los 1084 px del contenido (filas de bibliotecas de 880 y 808 px, tres por fila). Home: separación de 40 px entre secciones (`gap-10`), título h1 centrado y buscador de 480 px; títulos de sección h3. P6.1: buscador de 400 px, filtros de 150 px con etiqueta visible y resultados con 20 px entre columnas y 16 px entre filas; la etiqueta de disponibilidad va debajo de la tarjeta. P6.2: título de 24 px Bold (Figma, sin estilo de texto), portada de 220 × 300 (radio md; gray/100 si no hay), 32 px entre portada y datos, 20 px entre secciones, rótulos label gray/600 y valores de 15 px (`--text-dato`) separados por «  ·  ». Barra superior: el enlace activo («Catálogo» o «Tesis») lleva borde gray/900, radio 6 px y padding 4 × 10 (NavItem activo de Figma, valores sin token).
- RF7: tarjeta de P7.1 de 482 px con rótulos label gray/600 y valores de 15 px (`--text-dato`); «Disponibilidad verificada» en body gray/600. P7.2: columnas de 160 px (la última ocupa el resto), estado con `app-badge-estado` (`acento` para «Confirmada», neutral para el resto) y «Cancelar» como texto de tabla (13 px, gray/900, subrayado al pasar). Modal «Cancelar reserva» (Figma 324:39): `app-modal-confirmacion` con `variante="modal"`, 560 px, padding 24 × 32, separación lg, título h3 Bold, mensaje body gray/600 y «✕» de 16 px gray/600 (`cerrable`).
- RF8: P8.1 con buscador de 400 px, filtros de 180 px con etiqueta visible (Biblioteca, Estado y fechas «Desde»/«Hasta» con `<input type="date">` y `.campo-texto`), columnas de 140, 210, 100, 140 y 130 px y Acciones con el resto; el desplegable de Estado ocupa la columna (Figma 108 px cortaba «Confirmada»), modalidad de 150 px, «Prestar» `.btn-primario` y «Confirmar / Rechazar» y «Cancelar» como texto de tabla. Ventanas de reservas: Modal de Figma (560 px, «✕») con el campo «Motivo (opcional)» de todo el ancho. P8.2: columnas iguales y filtros de fecha de 180 px.
- RF9: tarjetas de formulario de P9.1 (`w-[710px]`), P9.3 (`w-[656px]`) y P9.5 (`w-[522px]`) con `p-2xl` y `gap-lg`; botón principal de 456 px (P9.1), 361 px (P9.3) o de todo el ancho (P9.5), junto a «Cancelar» `.btn-secundario`. Ejemplares: «EJ — título» + `app-badge-estado` («Seleccionado», el estado o «Uso exclusivo en sala») y debajo «Autor: … · Ubicación: …» en `text-caption`; «Habilitado para préstamo a domicilio» como badge neutral. Texto de ayuda de P9.1 en `text-mini`. P9.2 y P9.6: columnas iguales; P9.4: columnas de 160 px. Colores nuevos de Figma 22:2118: `--color-estado-vencido` #bf2626 («Vencido», y el badge `tono="alerta"` de «Con retraso — N días» en P9.5) y `--color-estado-vigente` #1a8c40 («Vigente»). Ventanas «¿Cancelar el préstamo?» (312:5378 y 312:5390) y «Ampliar plazo de préstamo» (281:253): Modal de Figma (560 px, «✕»).
- RF10: tarjetas de formulario de P10.1 y P10.4 de `w-[562px]` (560 de Figma + 2) con `p-2xl`, `gap-lg` y 6 px entre rótulo y campo (`gap-1.5`); desplegables Carrera y Facultad de 240 px (`w-60`). P10.3: buscador flexible y desplegables Carrera y Gestión de 240 px, columnas de 160 px más «Acciones». P10.2 y P10.5: tarjeta de `w-[622px]`; en P10.2 cada sección en una fila (nombre `text-body-strong`, badge «Pendiente»/«Cargado» y «Subir archivo» `.btn-primario`) separadas por una línea gray/300; en P10.5 zona de arrastre con borde punteado gray/300 (gray/900 al arrastrar), radio md y `py-2xl`, badge con el archivo elegido y «Reemplazar documento» de todo el ancho. Ventanas de desactivar/activar: Dialog de Figma (360 px), como P4.4.
- RF11: P11.1 con buscador flexible y desplegables Carrera y Gestión de 240 px; resultados en la Card de RF6 (`app-tarjeta`) de 342 px (340 de Figma + 2), con 16 px entre tarjetas. P11.2: tarjeta de `w-[682px]` (680 + 2) con `p-2xl` y 12 px entre líneas; rótulos semibold gray/600 y valores gray/900 de 14 px; subtítulos de sección `text-body-strong`; documentos como ícono PDF de 40 × 48 (ícono File de Lucide con «PDF» de 8 px bold, `components/icono-pdf`) y el nombre de la sección en `text-caption`, 24 px entre documentos; «Volver al listado» `.btn-secundario`.
- Botones y campos: clases `.btn-primario`, `.btn-secundario` y `.campo-texto` en `src/styles.css` (Button Primary/Secondary e Input/Text de Figma).

## Pantalla

- Diseño de escritorio a 1440 px de ancho: barra superior y pie de página; con sesión, además el menú lateral oscuro (brand/dark) en todas las pantallas (RF1.2.10), como en Figma.
- Íconos: `@lucide/angular`. Los íconos del menú lateral de Figma son dibujos propios; se usan sus equivalentes de Lucide: User, School, Book, Layers (Ejemplares), Bookmark, Calendar, ArrowRightLeft (Préstamos), GraduationCap, MessageSquare, ChartNoAxesColumn; en la barra superior, CircleUser con un punto brand/accent. Gráficos: Chart.js con `ng2-charts`.
