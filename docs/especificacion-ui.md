# Especificación UI — Kol Basilea Lectura

Estado: primer prototipo funcional local  
Fecha: 30 de octubre de 2026

## Propósito

Definir la experiencia visual y de interacción de la miniapp móvil de lectura bíblica. La UI debe hacer que la persona avance por una ruta editorial de 66 libros sin sentir que está pagando una deuda ni que tiene que reconstruir su progreso después de una pausa.

La unidad principal de avance es el capítulo; la unidad emocional y editorial es el libro terminado.

## Principios de experiencia

- Una acción principal por pantalla.
- El siguiente paso siempre debe ser evidente.
- Celebrar lo que ya se terminó antes de mostrar lo pendiente.
- Permitir pausas sin rachas rotas, penalizaciones ni mensajes de atraso.
- Mostrar contexto breve antes de la lectura.
- Mantener el significado bíblico por encima de puntos, premios o competencia.
- Empezar sin registro y guardar el progreso localmente.
- Usar lenguaje histórico-editorial, claro y no denominacional.

## Referencia Apple HIG

La implementación adopta principios de Apple Human Interface Guidelines, adaptados a una PWA y no a una aplicación nativa:

- **Simplicidad y jerarquía:** una estructura de pantalla enfocada, textos breves y una acción primaria dominante.
- **Familiaridad y consistencia:** navegación inferior persistente, botón de regreso en el lector y controles con estados previsibles. La barra inferior conserva Hoy, Ruta y Progreso; su cuarto control es Menú (hamburguesa) y abre el side sheet, donde se encuentra Biblioteca bíblica junto con las demás secciones.
- **Feedback claro:** barras de progreso, estado de libro actual, confirmación de capítulo guardado y toast de finalización.
- **Accesibilidad:** semántica HTML, nombres accesibles para iconos, foco visible, contraste, `role="progressbar"` y soporte para `prefers-reduced-motion`.
- **Interacción táctil:** controles con área mínima aproximada de 44 × 44 px, separación suficiente y acciones directas.
- **Adaptación de pantalla:** tipografía del sistema, `safe-area-inset` y layout móvil sin scroll horizontal.
- **Recuperación:** el progreso se conserva localmente y la persona puede volver desde el lector sin perder su contexto.

Referencias oficiales: [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles), [UI Design Dos and Don’ts](https://developer.apple.com/design/tips/), [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) y [Layout](https://developer.apple.com/design/human-interface-guidelines/layout).

## Arquitectura de navegación

La navegación principal tiene cuatro destinos:

1. **Hoy:** siguiente acción y resumen breve del avance.
2. **Ruta:** los 66 libros ordenados editorialmente, con estado por libro.
3. **Progreso:** libros, capítulos, porcentaje y próximos hitos.
4. **Más:** meta de lectura, persistencia local y notas sobre contenido/licencias.

El lector es una vista enfocada fuera de la navegación inferior. Tiene botón de regreso arriba y una acción fija al final para marcar el capítulo.

Las vistas secundarias muestran una ruta contextual visible: `Hoy › Ruta`, `Hoy › Progreso` o `Hoy › Más`. El lector conserva el origen desde el que se abrió y ofrece una salida explícita como `Volver a Ruta` o `Volver a Hoy`, además de `Ruta › Libro` como breadcrumb del contenido actual.

## Flujo de onboarding

### Paso 1 — Orientación

- Mensaje: “Lee la Biblia libro por libro.”
- Explica que la ruta es progresiva y que el avance celebra lo terminado.
- Acción primaria: “Comenzar con 3 Juan”.
- Acción secundaria: “Explorar la ruta primero”.

### Paso 2 — Ritmo

Tres opciones excluyentes:

- 365 días.
- 180 días.
- Sin fecha.

La meta es una preferencia, no una obligación. Puede cambiarse después sin borrar el progreso.

### Paso 3 — Primer libro

- Presenta 3 Juan como primer paso.
- Incluye tarjeta para video de contexto.
- Acción: “Abrir 3 Juan”.
- El onboarding termina cuando la persona marca el capítulo de 3 Juan como leído.

## Pantallas del MVP

### Hoy

Debe mostrar, en este orden:

- saludo editorial breve;
- libro actual y número dentro de la ruta;
- capítulo siguiente;
- progreso del libro;
- acción primaria de lectura;
- resumen de libros y capítulos completados;
- tira horizontal de libros cercanos.

Estado inicial: “Un paso a la vez.”  
Estado con avance: “Ya terminaste X libros.”

### Ruta

Cada fila incluye:

- número editorial;
- nombre del libro;
- capítulos completados de capítulos totales;
- estado “Siguiente” cuando corresponde;
- estado “Listo” cuando se completó.

La ruta conserva el orden editorial progresivo, pero ofrece filtros secundarios por categoría: Todos, La Ley, Históricos, Poéticos y sapienciales, Profetas mayores, Los 12 profetas menores, Evangelios, Historia de la iglesia, Cartas de Pablo, Cartas generales y Apocalipsis. Filtrar no reordena ni modifica el progreso; solo reduce las filas visibles.

El orden visible validado contiene 66 libros y 1,189 capítulos. Las inserciones son: Miqueas después de Joel; Oseas después de Lamentaciones; Ester después de Nehemías; Job después de 1 Corintios; 1 y 2 Samuel después de 2 Reyes.

### Progreso

Incluye:

- porcentaje principal calculado por libros terminados de 66, redondeado al entero más cercano;
- libros terminados de 66;
- capítulos leídos de 1,189;
- meta actual;
- hitos de 1, 7 y 33 libros.

El porcentaje debe acompañarse de cantidades absolutas para evitar que los primeros avances pequeños parezcan invisibles. Por ejemplo, 2 libros terminados muestran 3% (2/66 ≈ 3%), aunque el detalle de capítulos siga siendo independiente.

### Más

Incluye:

- cambio de meta;
- confirmación de que el progreso está guardado en el dispositivo;
- estado del contenido de demostración y futura integración de fuentes/licencias.

### Lector

Incluye:

- libro, capítulo y posición dentro de los 66 libros;
- introducción “Antes de leer”;
- video de contexto embebible o placeholder durante el MVP;
- área de texto bíblico con fuente, traducción y licencia visibles;
- botón “Marcar capítulo X como leído”;
- lista compacta de todos los capítulos del libro, con estados pendiente, en curso y leído;
- botón de información del libro antes del primer capítulo, tratado como una entrada de contenido propia;
- check visual en cada capítulo completado y contador “X de Y”;
- selección directa de un capítulo desde la lista para revisar o continuar en otro punto;
- en libros de más de 12 capítulos, vista resumida de capítulos cercanos y acción “Ver todos los capítulos”;
- navegador completo de capítulos en side-sheet para escritorio y bottom sheet para móvil;
- barra compacta de consumo con libro/capítulo seleccionable y traducción visible;
- barra de progreso total en el encabezado y progreso independiente del libro;
- sección de contexto en video colapsable, que no carga la miniatura hasta que la sección está abierta;
- menú “Formato” para cambiar entre tipografía serif/sans y temas claro, sepia u oscuro;
- breadcrumb con el origen y el libro actual;
- botón textual de regreso a la vista de origen.
- en móvil, una barra sticky inferior con porcentaje de lectura del capítulo y la acción para marcarlo como completado; el CTA permanece muted y deshabilitado hasta llegar al final del texto;

El lector debe mantener el foco en una sola acción principal y evitar acciones competitivas o distracciones innecesarias. La lista de capítulos funciona como navegación secundaria: el capítulo actual se destaca, y al guardar un capítulo el check aparece de inmediato mientras el lector avanza al siguiente pendiente. El menú de formato se considera una preferencia persistente, no una acción de lectura.

La referencia visual aportada para la Bible App inspira una navegación de lectura más directa: el libro y capítulo permanecen identificables arriba, la traducción se ve como una elección explícita y el texto ocupa la mayor parte de la pantalla. Kol Basilea adopta esa claridad mediante una barra de selección conectada al índice de capítulos, pero conserva su regreso explícito, el contexto en video y el progreso por capítulos.

La ficha de información toma como referencia el patrón minimalista de Bible App: una sola `i` al inicio del índice, sin competir con los capítulos. No se comporta como un acordeón ni añade una navegación nueva: al tocarla reemplaza únicamente el área donde normalmente aparece el texto bíblico. La lista de capítulos y el contexto permanecen en el mismo lector; basta elegir un capítulo para volver al texto. En 1 Juan contiene una síntesis editorial propia sobre contexto, temas y propósito. La [introducción consultada en Bible App](https://www.bible.com/es/bible/149/1JN.INTRO1.RVR1960) funciona únicamente como referencia de estructura y contexto; la UI no reproduce su texto.

### Recurso implementado: 1–3 Juan

Para 3 Juan, 2 Juan y 1 Juan se reutiliza como contexto compartido el video oficial [Resumen de los libros de 1–3 Juan](https://www.youtube.com/watch?v=wQtMnuBzb4c), publicado por Proyecto Biblia. La fuente editorial es su [guía oficial](https://bibleproject.com/es/guides/libro-de-1-3-juan/).

La UI no carga el iframe al entrar a la pantalla: muestra la miniatura oficial de YouTube con `loading="lazy"` y crea el reproductor `youtube-nocookie` solamente después de una acción explícita de reproducir. El video se reproduce sin descargarlo ni almacenarlo localmente. La tarjeta identifica a Proyecto Biblia, enlaza la fuente y comunica que el reproductor se carga bajo demanda.

El mismo recurso se trata como panorama del conjunto, no como tres videos distintos. En la ruta actual se presenta con especial relevancia al entrar a 3 Juan y queda disponible desde 2 Juan y 1 Juan.

### Versiones bíblicas de uso libre

El lector ofrece RVR1909, PDT, ONBV y BES mediante un selector explícito. El contenido se genera desde USFM oficial y vive en `dist/data/<translationId>/<bookId>.json`; `dist/data/bible-translations.js` separa nombre, licencia, fuente y directorio de cada versión. La URL conserva la selección (`?book=juan&chapter=3&version=pdt`) para navegar y compartir. El progreso sigue vinculado al libro y capítulo, no a la traducción.

Debajo de la acción de lectura se muestra la leyenda: “En Kol Basilea usamos versiones bíblicas de uso libre. Para leer otras versiones comerciales, recomendamos utilizar tu aplicación de la Biblia o consultar tu Biblia en casa.”

## Componentes visuales

- **Marca:** símbolo de estrella de cuatro puntas y nombre Kol Basilea.
- **Tipografía:** pila del sistema para sensación nativa y carga rápida.
- **Color principal:** verde profundo para acciones, progreso y énfasis.
- **Fondo:** crema cálido para lectura y superficies blancas para tarjetas.
- **Estados:** `default`, `pressed`, `selected`, `completed`, `current`, `disabled` y `focus-visible`.
- **Progreso:** barra lineal para unidades pequeñas y anillo para resumen global.
- **Feedback:** toast breve después de guardar o cambiar una preferencia.
- **Iconografía:** Lucide mediante SVG inline, con `aria-hidden` en iconos decorativos y etiquetas accesibles en los botones que dependen de un icono.

## Estados que deben diseñarse

- primer ingreso sin progreso;
- onboarding en cada paso;
- video no disponible o no iniciado;
- contexto de video abierto y colapsado;
- capítulo disponible y pendiente;
- lista de capítulos con capítulo actual seleccionado;
- ruta filtrada por categoría sin alterar el orden editorial;
- navegador de capítulos abierto para libros largos;
- lector en tema claro, sepia u oscuro;
- capítulo completado;
- libro completado;
- pausa con progreso conservado;
- ruta completa terminada;
- meta sin fecha;
- contenido pendiente de licencia;
- almacenamiento local disponible o no disponible;
- viewport móvil estrecho y viewport de escritorio amplio.

## Criterios de aceptación UI

- La persona entiende qué hacer en los primeros cinco segundos de cada pantalla principal.
- El onboarding llega a 3 Juan y tiene una finalización inequívoca.
- Al completar el capítulo de 3 Juan, la pantalla muestra 1 de 66 libros y propone 2 Juan.
- La ruta muestra exactamente 66 libros y 1,189 capítulos.
- La ruta permite filtrar los 66 libros por categoría y muestra el número de resultados del filtro.
- Las categorías son metadatos de exploración: no cambian la secuencia editorial ni el cálculo de progreso.
- El progreso queda disponible después de recargar la página en el mismo dispositivo.
- Cambiar de 365 a 180 o sin fecha no modifica capítulos ni libros completados.
- Todos los botones principales son operables con toque, teclado y lector de pantalla básico.
- No hay scroll horizontal en móvil.
- El lector conserva una acción primaria visible y no depende de una racha diaria.
- La lista del lector muestra todos los capítulos del libro, identifica el capítulo actual y convierte en check los capítulos guardados.
- Al seleccionar un capítulo, el título y la acción primaria se actualizan al capítulo seleccionado sin perder el progreso existente.
- Después de marcar un capítulo pendiente, el lector conserva la vista, muestra el check y propone el siguiente capítulo pendiente, salvo al terminar el libro.
- El video de contexto se puede contraer y el contenido multimedia permanece diferido mientras está cerrado.
- El menú de formato permite cambiar tipografía y tema sin perder el capítulo ni el progreso.
- En móvil, el lector muestra una barra sticky inferior con la acción “Marcar capítulo X como leído” y una barra de lectura que refleja el desplazamiento real dentro del texto.
- El CTA de completar solo se habilita al alcanzar el final del documento; llegar al 100% de lectura activa el botón sin recargar la pantalla.
- Los libros largos no generan una lista extensa dentro del lector: muestran capítulos cercanos y abren el índice completo bajo demanda.
- El índice completo permite saltar a cualquier capítulo, muestra el capítulo actual y se cierra al seleccionar uno o tocar fuera del panel.
- Desde cualquier vista secundaria se puede volver a Hoy mediante breadcrumb; desde el lector se puede volver a la vista que lo abrió.
- El prototipo comunica claramente qué textos y videos son demostrativos mientras se resuelven licencias.

## Implementación actual

El primer prototipo vive en `dist/` como HTML, CSS y JavaScript sin build step:

- `dist/index.html`: shell de la aplicación;
- `dist/styles.css`: tokens, layout, componentes y responsive;
- `dist/app.js`: navegación, onboarding, ruta, lector, progreso y persistencia local.
- `dist/data/bible-rvr1909.js`: primera fuente de lectura local y adaptador de contenido bíblico.

Para verlo localmente:

```bash
python3 -m http.server 4173 --directory dist
```

## Próximas decisiones de diseño

1. Definir la fuente bíblica y el formato de lectura autorizado.
2. Seleccionar la fuente de los videos y sus reglas de embebido.
3. Sustituir iconos textuales por un sistema accesible y consistente.
4. Diseñar estados vacíos, errores de almacenamiento y recuperación.
5. Probar la ruta con lectores nuevos y personas que abandonaron Génesis.
6. Decidir si la sincronización futura será una cuenta propia o un proveedor externo.
