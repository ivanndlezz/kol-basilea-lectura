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
- **Familiaridad y consistencia:** navegación inferior persistente, botón de regreso en el lector y controles con estados previsibles.
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

El orden visible validado contiene 66 libros y 1,189 capítulos. Las inserciones son: Miqueas después de Joel; Oseas después de Lamentaciones; Ester después de Nehemías; Job después de 1 Corintios; 1 y 2 Samuel después de 2 Reyes.

### Progreso

Incluye:

- porcentaje global;
- libros terminados de 66;
- capítulos leídos de 1,189;
- meta actual;
- hitos de 1, 7 y 33 libros.

El porcentaje debe acompañarse de cantidades absolutas para evitar que los primeros avances pequeños parezcan invisibles.

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
- área de texto bíblico con fuente autorizada;
- botón “Marcar capítulo X como leído”;
- breadcrumb con el origen y el libro actual;
- botón textual de regreso a la vista de origen.

El lector debe mantener el foco en una sola acción y evitar acciones competitivas o distracciones innecesarias.

### Recurso implementado: 1–3 Juan

Para 3 Juan, 2 Juan y 1 Juan se reutiliza como contexto compartido el video oficial [Resumen de los libros de 1–3 Juan](https://www.youtube.com/watch?v=wQtMnuBzb4c), publicado por Proyecto Biblia. La fuente editorial es su [guía oficial](https://bibleproject.com/es/guides/libro-de-1-3-juan/).

La UI no carga el iframe al entrar a la pantalla: muestra la miniatura oficial de YouTube con `loading="lazy"` y crea el reproductor `youtube-nocookie` solamente después de una acción explícita de reproducir. El video se reproduce sin descargarlo ni almacenarlo localmente. La tarjeta identifica a Proyecto Biblia, enlaza la fuente y comunica que el reproductor se carga bajo demanda.

El mismo recurso se trata como panorama del conjunto, no como tres videos distintos. En la ruta actual se presenta con especial relevancia al entrar a 3 Juan y queda disponible desde 2 Juan y 1 Juan.

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
- capítulo disponible y pendiente;
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
- El progreso queda disponible después de recargar la página en el mismo dispositivo.
- Cambiar de 365 a 180 o sin fecha no modifica capítulos ni libros completados.
- Todos los botones principales son operables con toque, teclado y lector de pantalla básico.
- No hay scroll horizontal en móvil.
- El lector conserva una acción primaria visible y no depende de una racha diaria.
- Desde cualquier vista secundaria se puede volver a Hoy mediante breadcrumb; desde el lector se puede volver a la vista que lo abrió.
- El prototipo comunica claramente qué textos y videos son demostrativos mientras se resuelven licencias.

## Implementación actual

El primer prototipo vive en `dist/` como HTML, CSS y JavaScript sin build step:

- `dist/index.html`: shell de la aplicación;
- `dist/styles.css`: tokens, layout, componentes y responsive;
- `dist/app.js`: navegación, onboarding, ruta, lector, progreso y persistencia local.

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
