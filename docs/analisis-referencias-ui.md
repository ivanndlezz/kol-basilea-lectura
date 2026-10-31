# Kol Basilea — Notas de análisis UI

## Ejercicio 1: onboarding de Duolingo

**Estado:** Ejercicio de referencias completado — seis plataformas observadas  
**Referencia:** [Duolingo](https://www.duolingo.com)  
**Fecha de observación:** 30 de octubre de 2026  
**Objetivo:** Analizar cómo una plataforma gamificada lleva a una persona desde el primer contacto hasta establecer su primer objetivo.

## 1. Alcance del ejercicio

El ejercicio comienza en la pantalla pública de Duolingo y termina cuando el usuario ha configurado su objetivo inicial y está listo para entrar a la experiencia de aprendizaje.

En esta observación no se creó una cuenta ni se aceptaron permisos de notificaciones. El análisis se detuvo antes de cualquier acción que requiriera registro o permisos del navegador.

### Criterio de finalización del ejercicio

El ejercicio se considera completo cuando tenemos documentados:

- el punto de inicio;
- la secuencia de pasos;
- el indicador de progreso;
- el objetivo de cada pantalla;
- el momento en que termina el onboarding;
- los patrones que conviene adaptar;
- los patrones que conviene descartar.

## 2. Punto de inicio

La experiencia pública comienza con una propuesta muy directa:

> ¡La forma más divertida de aprender idiomas, ajedrez y más!

La acción principal es **“Empieza ahora”**. La pantalla también muestra una acción secundaria para quienes ya tienen cuenta: **“Ya tengo una cuenta”**.

### Observación

El inicio no obliga a leer una explicación extensa. Presenta una promesa y conduce rápidamente a una primera decisión.

### Aplicación para Kol Basilea

La pantalla inicial podría usar una promesa igualmente directa:

> Empieza a leer la Biblia con una ruta progresiva.

Acción principal:

> Comenzar con 3 Juan

Acción secundaria:

> Ya tengo progreso

## 3. Secuencia observada del onboarding

### Paso 1 — Elegir qué aprender

Duolingo pregunta:

> ¿Qué quieres aprender?

En la versión observada ofreció opciones como inglés, ajedrez, portugués, francés, italiano, japonés, coreano, alemán, ruso, chino, catalán y sueco. También muestra el número de estudiantes de algunas opciones.

### Aprendizaje para Kol Basilea

Kol Basilea no debería comenzar con muchas opciones. La ruta principal ya está definida. La primera decisión podría ser:

- comenzar la ruta progresiva;
- conocer cómo funciona;
- continuar un progreso existente.

No conviene presentar las 66 decisiones antes de que el usuario haya comenzado.

### Paso 2 — Presentación emocional

Duolingo presenta a Duo, su mascota, con una pantalla breve de bienvenida:

> ¡Hola! Yo soy Duo.

Después utiliza otra pantalla celebratoria:

> ¡Que empiece la fiesta!

### Observación

La plataforma introduce una personalidad antes de pedir demasiada información. Esto hace que el onboarding se sienta como una bienvenida, no como un formulario.

### Aplicación para Kol Basilea

Podemos utilizar una bienvenida visual y cálida, pero sin convertir la experiencia en un juego infantil. El equivalente podría ser una breve frase editorial:

> Esta es una ruta para comenzar con calma, entender el contexto y avanzar libro por libro.

## 4. Preguntas de personalización

Duolingo hace varias preguntas sucesivas:

1. ¿Cómo supiste de Duolingo?
2. ¿Por qué quieres aprender inglés?
3. ¿Cuánto inglés sabes?

Estas preguntas usan opciones predefinidas y botones de selección. El botón **“Continuar”** permanece deshabilitado hasta que el usuario responde.

### Observación

La interfaz mantiene una sola decisión por pantalla. Eso reduce la carga cognitiva, aunque el número total de pasos puede sentirse largo si la persona solo quiere comenzar.

### Aplicación para Kol Basilea

El onboarding de Kol Basilea debe ser mucho más corto. Bastaría con una decisión obligatoria y una opcional:

1. ¿Quieres leer con una meta?
   - 365 días;
   - 180 días;
   - sin fecha.
2. Opcionalmente: ¿qué te gustaría recibir?
   - contexto histórico;
   - videos;
   - recordatorios.

La app no debería preguntar por denominación, nivel bíblico ni motivaciones personales antes de mostrar 3 Juan.

## 5. Pantalla de beneficios

Duolingo muestra una pantalla aspiracional:

- conversar con confianza;
- practicar comprensión;
- expandir vocabulario;
- desarrollar un hábito de aprendizaje.

### Observación

Antes de pedir la meta diaria, la plataforma muestra qué puede obtener el usuario. Primero vende el resultado; después solicita compromiso.

### Aplicación para Kol Basilea

Podríamos presentar tres beneficios concretos:

- comenzar sin sentir que Génesis es una barrera;
- entender el contexto antes de cada libro;
- ver el avance acumulado hasta completar la Biblia.

El copy debe ser motivador, pero no prometer transformación espiritual automática.

## 6. Elección de meta

Duolingo pregunta:

> ¿Cuál es tu meta diaria de aprendizaje?

Las opciones observadas fueron:

- 5 min/día — Relajado;
- 10 min/día — Normal;
- 15 min/día — Serio;
- 20 min/día — Intenso.

### Observación

La meta se presenta como niveles de intensidad. El usuario puede elegir una expectativa que se ajuste a su disponibilidad.

### Aplicación para Kol Basilea

Kol Basilea ya tiene tres modalidades definidas:

- 365 días;
- 180 días;
- sin fecha.

La elección debe mostrarse como una preferencia de ritmo, no como un examen. Recomendación de copy:

> Elige el ritmo que te gustaría intentar. Siempre podrás cambiarlo.

## 7. Indicador de finalización

Durante el onboarding observado existe un elemento accesible de tipo `progressbar`. En el segundo paso se observó un valor aproximado de **10%**.

### Lo que funciona

- comunica que el onboarding tiene un final;
- permite que el sistema conozca el avance;
- aparece de forma consistente entre pantallas;
- evita que cada pantalla se sienta aislada.

### Lo que puede mejorar

El indicador visual es muy sutil y no muestra de forma evidente un texto como:

> Paso 2 de 8

Para una persona que está formando un hábito, el indicador debería ser visible y comprensible sin depender de un lector de pantalla o de la interpretación de una barra.

## 8. Indicador propuesto para Kol Basilea

Kol Basilea debería mostrar dos indicadores simultáneos, porque hay dos progresos distintos.

### Progreso del onboarding

```text
Paso 2 de 6
```

Este indicador responde: “¿cuánto falta para empezar?”.

### Progreso de lectura

```text
3 Juan · capítulo 0 de 1
Libro 1 de 66
```

Este indicador responde: “¿cuánto he avanzado en la ruta?”.

### Al completar el primer libro

```text
Onboarding completado

Has terminado tu primer libro:
3 Juan · 1 de 66 libros

Siguiente: 2 Juan
```

La app debe considerar completado el onboarding cuando el usuario marca el capítulo 1 de 3 Juan, no cuando termina de configurar sus preferencias.

## 9. Recorrido equivalente para Kol Basilea

El primer recorrido recomendado sería:

```text
Primera apertura
→ propuesta de valor
→ elegir 365, 180 o sin fecha
→ explicación breve de la ruta
→ presentación de 3 Juan
→ contexto en video
→ lectura del capítulo 1
→ marcar capítulo
→ celebrar primer libro
→ presentar 2 Juan
```

### Inicio del recorrido

La primera apertura de la app.

### Final del onboarding

La finalización de 3 Juan.

### Final de una sesión

Cuando el usuario marca el capítulo leído y la pantalla deja claro cuál es el siguiente paso.

### Final de la experiencia completa

Cuando el usuario completa Salmos, el libro 66.

## 10. Qué tomar de Duolingo

- una sola decisión por pantalla;
- botones de continuación claros;
- onboarding con personalidad;
- metas configurables;
- progreso persistente entre pasos;
- mensajes aspiracionales antes de pedir compromiso;
- una secuencia de acciones muy evidente;
- celebración al avanzar.

## 11. Qué no copiar

- un onboarding demasiado largo;
- demasiadas preguntas antes de leer;
- convertir la meta en presión diaria;
- depender de rachas para demostrar progreso;
- utilizar puntos como sustituto del significado;
- hacer que la experiencia bíblica parezca una competencia;
- esconder el progreso real detrás de una barra poco explícita.

## 12. Decisiones preliminares para la UI de Kol Basilea

1. El usuario debe ver siempre el siguiente paso.
2. El indicador de onboarding debe mostrar número y total.
3. El progreso de lectura debe mostrar libros y capítulos.
4. El primer logro debe ser completar 3 Juan.
5. El onboarding no debe requerir registro.
6. La meta debe poder cambiarse sin perder progreso.
7. La pausa no debe reiniciar ni castigar al usuario.
8. El botón principal debe usar verbos concretos: “Comenzar”, “Leer capítulo”, “Marcar como leído”, “Continuar”.

## 13. Preguntas abiertas

- ¿Queremos un personaje o una identidad visual editorial sin mascota?
- ¿El indicador debe mostrarse como “Paso 2 de 6” o como una barra con porcentaje y texto?
- ¿El contexto de 3 Juan debe aparecer antes o después de elegir la meta?
- ¿La primera pantalla debe presentar directamente el libro o explicar primero la ruta completa?
- ¿La celebración de 3 Juan debe ser visual, textual o ambas?

## 14. Estado del ejercicio

**Referencia analizada:** Duolingo  
**Estado:** Análisis inicial completado  
**Siguiente referencia:** BibleProject  
**Criterio de cierre del bloque comparativo:** seis referencias analizadas con la misma matriz de pantallas y decisiones de diseño consolidadas para el documento de UI.

---

## Ejercicio 2: BibleProject

**Referencia observada:** [BibleProject App](https://bibleproject.com/app/)  
**Superficies revisadas:** página de presentación de la app, FAQ y catálogo de planes de lectura.  
**Objetivo:** Analizar cómo una plataforma bíblica conecta contexto, recursos audiovisuales, lectura y progreso.

## 15. Punto de entrada

La página de presentación de BibleProject propone la app como un lugar para:

> Discover the Bible's Unified Story

El llamado principal no es “completa una tarea”, sino descubrir una biblioteca de recursos relacionados con la Biblia. La propuesta se apoya en:

- videos;
- podcasts;
- clases;
- artículos;
- reflexión;
- recursos anotados;
- lectura bíblica.

### Observación

BibleProject comienza por el contenido y por la promesa de comprensión. La entrada no parece ser una ruta obligatoria, sino una biblioteca editorial que invita a explorar.

### Aplicación para Kol Basilea

Kol Basilea sí necesita una ruta principal más definida, porque su problema es ayudar a alguien a comenzar. Podemos tomar la calidad de presentación de BibleProject, pero no su apertura total como primera experiencia.

La primera pantalla de Kol Basilea debería decir:

> Esta es tu ruta de lectura.

Y después ofrecer el contenido contextual del libro actual, en lugar de abrir una biblioteca completa.

## 16. Organización de la aplicación

La documentación de ayuda de BibleProject identifica cuatro áreas principales:

1. **Home:** novedades y opción de continuar donde el usuario se quedó.
2. **Search:** búsqueda de videos, podcasts, clases y artículos.
3. **Bible:** lector bíblico con varias traducciones y recursos vinculados a capítulos o versículos.
4. **Me:** cuenta, marcadores y progreso.

Fuente: [guía oficial de inicio de BibleProject](https://help.bibleproject.com/hc/en-us/articles/4478975400727-I-m-new-to-the-app-How-do-I-get-started).

### Lo que funciona

- separa descubrimiento, lectura y cuenta;
- permite continuar desde el último punto;
- conecta recursos con el texto bíblico;
- ofrece una biblioteca amplia sin mezclarlo todo en una sola pantalla;
- utiliza categorías de contenido comprensibles.

### Riesgo para Kol Basilea

Una estructura con Home, Search, Bible y Me puede ser demasiado amplia para el primer contacto. Un lector que todavía no tiene hábito podría no saber si debe buscar, leer, explorar o completar un plan.

### Aplicación para Kol Basilea

El MVP debería tener una navegación más pequeña:

- **Hoy:** siguiente acción y progreso actual;
- **Ruta:** los 66 libros;
- **Progreso:** libros y capítulos completados;
- **Más:** configuración, meta y fuentes.

La lectura y el contexto deben vivir dentro de la ficha del libro, no en secciones completamente separadas.

## 17. “Continuar donde quedaste”

BibleProject coloca el regreso del usuario dentro de Home. Esta es una buena decisión porque reduce la necesidad de recordar qué recurso estaba viendo.

### Aplicación para Kol Basilea

La pantalla inicial debe priorizar una tarjeta de continuación:

```text
Continúa tu ruta

3 Juan · capítulo 1 de 1

[Leer ahora]
```

Después de completar el capítulo:

```text
3 Juan terminado

Siguiente libro: 2 Juan

[Continuar]
```

La app no debe llevar al usuario a un dashboard abstracto antes de mostrarle su próxima acción.

## 18. Contexto y recursos audiovisuales

BibleProject presenta videos, podcasts, clases y artículos como partes de una misma experiencia de aprendizaje. La aplicación permite avanzar en distintos tipos de contenido y registrar progreso de esos recursos.

### Lo que funciona

- el video no es un adorno aislado;
- el contenido se agrupa por temas y libros;
- los recursos se pueden descubrir desde distintos caminos;
- el progreso puede representar aprendizaje audiovisual, no solo lectura.

### Aplicación para Kol Basilea

El video de cada libro debe tener una función clara dentro de la secuencia:

```text
Ver contexto → leer → marcar capítulos → completar libro
```

El video no debe ser un requisito bloqueante. Si no carga o el usuario decide saltarlo, la lectura debe seguir disponible.

La ficha del libro podría mostrar:

```text
Antes de leer
Video de contexto · 8 min

Después
Libro: 3 Juan
Capítulos: 1
Progreso: 0%
```

## 19. Progreso y cuenta

BibleProject permite explorar la aplicación sin cuenta, pero su documentación indica que para registrar progreso de videos, podcasts y clases se necesita iniciar sesión o crear una cuenta. [Referencia oficial](https://help.bibleproject.com/hc/en-us/articles/4478987866007-Do-I-need-a-BibleProject-account-to-use-the-app).

### Aplicación para Kol Basilea

Este es un punto de diferenciación importante para el MVP: Kol Basilea debe permitir el progreso local sin registro.

El usuario debería poder:

- marcar capítulos;
- cerrar la app;
- volver después;
- conservar sus libros completados;
- continuar sin crear una cuenta.

La sincronización futura puede ser opcional, pero no debe ser una barrera de activación.

## 20. Planes de lectura

El catálogo de BibleProject muestra muchos planes con duraciones distintas, desde pocos días hasta 365 días. También presenta planes de un año y planes enfocados en libros, temas o secciones bíblicas.

### Lo que funciona

- ofrece distintas puertas de entrada;
- comunica duración de manera visible;
- permite asociar un tema o sección con un tiempo concreto;
- hace que una experiencia extensa parezca elegible y acotada.

### Lo que Kol Basilea debe hacer diferente

Kol Basilea no necesita mostrar decenas de planes al principio. Su diferenciador es una ruta principal de 66 libros. Las opciones de 365, 180 días o sin fecha deben modificar el ritmo, no crear tres productos distintos.

La interfaz debe evitar esta sensación:

> Elige entre demasiados planes.

Y buscar esta:

> Esta es la ruta; elige a qué ritmo quieres recorrerla.

## 21. Indicador de finalización en BibleProject

En la superficie pública revisada, BibleProject comunica categorías, biblioteca y planes, pero no presenta un indicador único y dominante de finalización de toda la experiencia. El progreso aparece asociado a recursos concretos y a la cuenta del usuario.

### Aprendizaje para Kol Basilea

Aquí hay una oportunidad clara de diferenciación. Kol Basilea debe hacer visible el final desde el primer día:

```text
Ruta completa
0 de 66 libros
0 de 1,189 capítulos
```

Y dentro del libro actual:

```text
3 Juan
0 de 1 capítulos
Libro 1 de 66
```

El usuario debe saber qué significa terminar una unidad, qué viene después y cuánto falta para completar la ruta total.

## 22. Qué tomar de BibleProject

- contexto audiovisual integrado al contenido;
- organización por tipos de recurso;
- conexión entre capítulos y materiales de apoyo;
- botón o tarjeta de “continuar donde quedaste”;
- tono visual editorial y educativo;
- duración visible en planes y contenidos;
- posibilidad de explorar temas relacionados;
- contenido alternativo cuando un formato no está disponible.

## 23. Qué no copiar

- comenzar con una biblioteca demasiado abierta;
- exigir cuenta para registrar el primer progreso;
- ocultar el avance global detrás de diferentes tipos de contenido;
- hacer que el usuario decida entre demasiados planes;
- separar completamente lectura, contexto y siguiente acción;
- depender de novedades editoriales para activar al usuario.

## 24. Decisiones preliminares después de dos referencias

Después de observar Duolingo y BibleProject, la dirección de Kol Basilea queda más clara:

| Necesidad de Kol Basilea | Referencia principal | Decisión preliminar |
|---|---|---|
| Saber qué hacer ahora | Duolingo | Una acción principal visible |
| Ver cuánto falta | Duolingo | Paso y total, no solo barra |
| Entender antes de leer | BibleProject | Video y contexto en la ficha del libro |
| Retomar fácilmente | Ambas | Tarjeta “continúa desde aquí” |
| Mantener progreso sin cuenta | Diferenciación propia | Persistencia local desde el MVP |
| No sentirse perdido entre opciones | Kol Basilea | Una ruta principal, no una biblioteca abierta |
| Ver el final completo | Diferenciación propia | 66 libros y 1,189 capítulos visibles |

## 25. Estado actualizado del ejercicio

**Referencias analizadas:** 2 de 6  
**Referencias:** Duolingo y BibleProject  
**Indicador del ejercicio:** `2/6 referencias analizadas`  
**Siguiente referencia:** Finch  
**Criterio de cierre del bloque:** seis referencias analizadas con la misma matriz y una decisión de diseño asociada a cada patrón relevante.

## 49. Estado general del ejercicio

**Referencias analizadas:** 4 de 6  
**Referencias:** Duolingo, BibleProject, Finch y Forest  
**Indicador del ejercicio:** `4/6 referencias analizadas`  
**Siguiente referencia:** Habitica  
**Hallazgo acumulado:** la interfaz debe mostrar una acción pequeña, un final inequívoco y un progreso que se conserve visualmente; una pausa nunca debe destruir lo construido.

---

## Ejercicio 4: Forest

**Referencia observada:** [Forest](https://www.forestapp.cc/)  
**Superficie revisada:** página oficial de producto y descripción del ciclo de enfoque.  
**Objetivo:** Analizar cómo se convierte una acción invisible en una representación visual acumulativa.

## 37. Problema y promesa

Forest comienza con un problema cotidiano y reconocible:

> Your hours keep slipping away. Take them back.

Después presenta un contraste entre dos estados:

- distraído y atrapado en desplazamientos interminables;
- enfocado y en control del tiempo.

### Observación

Forest no empieza explicando todas sus funciones. Primero nombra el problema y muestra el estado deseado.

### Aplicación para Kol Basilea

Kol Basilea puede iniciar con un problema igualmente concreto:

> Quieres leer la Biblia, pero no sabes por dónde empezar ni cómo mantener el ritmo.

Y presentar el resultado:

> Empieza con un libro breve y avanza hasta completar toda la ruta.

## 38. El ciclo principal de Forest

La página oficial describe un ciclo muy simple:

1. elegir una duración y una especie de árbol;
2. comenzar a concentrarse;
3. ver crecer el árbol en tiempo real;
4. terminar la sesión;
5. conservar el árbol dentro del bosque.

La unidad de acción es una sesión. La unidad de progreso acumulado es el bosque.

### Aplicación para Kol Basilea

Podemos traducir esa estructura así:

```text
Elegir el capítulo
→ leer
→ marcar como leído
→ completar el libro
→ añadir el libro a la biblioteca recorrida
```

La unidad de acción es el capítulo. La unidad visual acumulada es la colección de libros terminados.

## 39. Progreso visual acumulativo

Forest convierte cada sesión terminada en un árbol que permanece dentro de un bosque. Su sitio describe el bosque como un registro visible de cada momento en que el usuario eligió concentrarse.

### Lo que funciona

- el avance no depende solamente de un porcentaje;
- cada unidad completada deja una marca permanente;
- el conjunto se vuelve más significativo con el tiempo;
- el usuario puede mirar hacia atrás y ver lo que construyó;
- la metáfora es fácil de entender sin instrucciones largas.

### Aplicación para Kol Basilea

La ruta de Kol Basilea podría tener una representación visual de libros terminados:

- una biblioteca que se va llenando;
- un camino con estaciones;
- una colección de volúmenes;
- un paisaje editorial que se completa;
- una secuencia de hitos por cada libro.

La decisión visual debe respetar el tono bíblico y editorial. No es necesario copiar un bosque literalmente.

## 40. Inicio y final claros

Forest tiene un inicio inequívoco: elegir una sesión y comenzarla. También tiene un final inequívoco: la sesión termina y el árbol se incorpora al bosque.

### Aplicación para Kol Basilea

Cada sesión de lectura debería tener un inicio y un final igualmente claros:

**Inicio:**

```text
Leer 3 Juan · capítulo 1
```

**Final:**

```text
Capítulo completado
```

Y al finalizar el último capítulo del libro:

```text
3 Juan completado
Libro 1 de 66
```

El usuario no debe preguntarse si su lectura “contó”. El check y la actualización del progreso deben ser inmediatos.

## 41. La penalización de Forest

Forest utiliza una tensión explícita: si el usuario abandona la sesión para usar otras aplicaciones, el árbol puede morir.

### Lo que puede enseñar

- una consecuencia inmediata refuerza la intención;
- el riesgo hace que la sesión se sienta significativa;
- la metáfora vuelve memorable la interrupción.

### Lo que no debemos copiar

Kol Basilea no debe destruir el progreso de lectura por una pausa. El usuario puede tener un día difícil, cambiar de ritmo o dejar un libro durante semanas.

Regla de adaptación:

```text
Pausa = el progreso se conserva
Abandono de sesión = la sesión no se completa
Regreso = la app retoma desde el último capítulo pendiente
```

La pausa debe detener el crecimiento, no matar el árbol.

## 42. Indicador de finalización en Forest

Forest comunica el final mediante el estado del árbol: semilla, crecimiento, árbol completado y árbol incorporado al bosque.

### Aprendizaje para Kol Basilea

Podemos crear estados equivalentes para cada libro:

```text
Pendiente → En curso → Libro completado → Integrado a la ruta
```

En la interfaz:

```text
3 Juan
1 de 1 capítulo
Completado

Ruta: 1 de 66 libros
```

El indicador debe combinar estado textual, número y representación visual. La metáfora sola no es suficiente.

## 43. Permanencia del logro

Una característica importante de Forest es que el árbol no desaparece al terminar la sesión. Forma parte de una colección permanente.

### Aplicación para Kol Basilea

Cada libro completado debe permanecer visible en algún lugar:

- en la ruta;
- en el progreso;
- en una biblioteca de libros terminados;
- en la pantalla de hitos.

Esto refuerza la idea central de Kol Basilea: el lector mira lo que ya ha logrado, no solo lo que le falta.

## 44. Qué tomar de Forest

- una metáfora visual fácil de comprender;
- progreso acumulativo y permanente;
- inicio y final inequívocos;
- una colección que crece con cada sesión;
- separación entre la acción actual y el historial construido;
- representación visual del tiempo o esfuerzo invertido.

## 45. Qué no copiar

- destruir progreso por distraerse;
- hacer que la penalización sea el centro de la motivación;
- convertir la lectura en una carrera contra el reloj;
- medir el valor de la sesión únicamente por minutos;
- usar una metáfora natural si entra en conflicto con la identidad editorial de Kol Basilea.

## 46. Propuesta visual derivada

La referencia de Forest sugiere que Kol Basilea necesita un objeto visual que crezca. La opción inicial más coherente sería una **biblioteca de libros completados**:

```text
Biblioteca de Kol Basilea

[3 Juan] [2 Juan] [1 Juan] [Filemón] ...

4 de 66 libros completados
```

Otra posibilidad sería un camino de lectura con 66 estaciones, pero la biblioteca tiene una ventaja emocional: muestra lo que ya existe y no solo una línea hacia el futuro.

## 47. Decisiones preliminares después de cuatro referencias

| Necesidad de Kol Basilea | Referencia principal | Decisión preliminar |
|---|---|---|
| Acción concreta | Finch + Forest | Leer un capítulo en una sesión |
| Final visible | Forest | Check textual y visual al completar |
| Progreso permanente | Forest | Cada libro terminado permanece en la colección |
| Reanudación | Finch | Pausar conserva el avance |
| Ruta | Duolingo | Mostrar el siguiente paso |
| Contexto | BibleProject | Video antes de la lectura |
| Motivación | Adaptación propia | Ver lo construido, no temer perderlo |
| Indicador global | Kol Basilea | `4 de 66 libros · 72 de 1,189 capítulos` |

## 48. Estado actualizado del ejercicio

**Referencias analizadas:** 4 de 6  
**Referencias:** Duolingo, BibleProject, Finch y Forest  
**Indicador del ejercicio:** `4/6 referencias analizadas`  
**Siguiente referencia:** Habitica  
**Criterio de cierre del bloque:** seis referencias analizadas con la misma matriz y una decisión de diseño asociada a cada patrón relevante.

---

## Ejercicio 5: Habitica

**Referencia observada:** [Habitica — Características](https://habitica.com/static/features)  
**Superficie revisada:** página oficial de características y descripción de tareas, recompensas, grupos, desafíos y misiones.  
**Objetivo:** Analizar cómo una plataforma convierte tareas cotidianas en misiones, recompensas y progreso dentro de un sistema de juego.

## 50. Propuesta de valor

Habitica presenta una promesa muy explícita:

> ¡Adquiere mejores hábitos nivel a nivel!

Su modelo traslada la vida cotidiana a un juego. Las tareas completadas producen Oro, Experiencia y artículos, y el usuario avanza de nivel conforme completa más tareas.

### Observación

Habitica hace visible la relación entre una acción real y una consecuencia dentro del sistema. El usuario no solo marca una tarea: obtiene una respuesta del mundo del juego.

### Aplicación para Kol Basilea

Kol Basilea también necesita una respuesta inmediata después de una lectura, pero esa respuesta debe estar ligada al significado de la ruta:

```text
Marcar capítulo
→ actualizar progreso
→ acercarse a completar el libro
→ ver el siguiente paso
```

No necesitamos inventar una economía de monedas para que la lectura tenga una consecuencia visible.

## 51. Tipos de recompensa

Habitica utiliza recompensas como:

- monedas de Oro;
- Experiencia;
- equipo y artículos;
- sorpresas;
- niveles;
- premios dentro de desafíos.

### Lo que funciona

- la recompensa ocurre justo después de completar;
- el usuario entiende qué ganó;
- el avance puede acumularse durante mucho tiempo;
- existe una colección que representa el esfuerzo;
- los artículos dan una sensación de personalización.

### Qué adaptar para Kol Basilea

La recompensa debe ser principalmente editorial y de progreso:

- libro completado;
- hito de ruta;
- porcentaje global actualizado;
- tarjeta contextual;
- ilustración o símbolo del libro;
- mensaje de continuidad;
- biblioteca de libros terminados.

La recompensa debe reforzar “ya leí esto” y “ahora puedo continuar”, no crear una segunda actividad que compita con la lectura.

## 52. Misiones

Habitica usa misiones con monstruos y equipos. La página oficial explica que las tareas completadas producen daño al monstruo y que no cumplir puede producir daño colectivo al equipo.

### Lo que puede enseñar

- una serie de tareas puede agruparse dentro de una narrativa;
- completar tareas intermedias puede acercar a un hito mayor;
- una misión da forma y nombre a un conjunto de acciones;
- el usuario entiende que varias acciones pequeñas construyen un resultado.

### Lo que no debemos copiar

La idea de daño colectivo no es apropiada para el tono de Kol Basilea. La lectura no debe convertirse en una obligación hacia un equipo ni producir culpa por no cumplir.

### Aplicación para Kol Basilea

Podemos usar misiones editoriales sin castigo:

```text
Misión: completar los primeros 7 libros
Progreso: 4 de 7 libros
Recompensa: hito “Primer tramo completado”
```

O:

```text
Misión: recorrer los libros breves del inicio
Progreso: 8 de 13 libros
```

Estas misiones deben ser opcionales y nunca bloquear el avance principal.

## 53. Progreso por niveles

Habitica presenta la mejora como avance de nivel. El nivel funciona como una lectura simple del historial acumulado.

### Aplicación para Kol Basilea

Podemos utilizar hitos en vez de niveles:

- primer libro;
- primeros 7 libros;
- 10 libros;
- primer libro profético;
- primer libro histórico largo;
- 25 libros;
- mitad de la ruta;
- 50 libros;
- ruta completa.

El concepto de “nivel espiritual” debe evitarse. Los hitos deben describir el recorrido de lectura, no medir madurez, fe o valor personal.

## 54. Responsabilidad social

Habitica incorpora grupos, cooperación, competencia y desafíos comunitarios. Esto puede servir para objetivos compartidos, pero también puede aumentar la presión.

### Aplicación futura para Kol Basilea

La lectura compartida podría ser una fase posterior y opcional:

- grupos privados;
- una ruta compartida;
- celebración de libros terminados;
- acompañamiento sin ranking;
- invitaciones a conversar sobre un libro.

No debería formar parte del MVP ni ser necesaria para conservar el progreso.

## 55. Indicador de finalización en Habitica

Habitica comunica el cierre de una tarea a través del check, la recompensa, la experiencia y el cambio de estado del personaje. En las misiones, el avance se relaciona con el daño al monstruo y la recompensa final.

### Aprendizaje para Kol Basilea

El indicador debe ser más sobrio y directo:

```text
Capítulo marcado
1 de 1

Libro completado
1 de 66

Ruta total
1 de 1,189 capítulos
```

El usuario debe distinguir entre:

- completar una acción;
- completar un libro;
- completar una misión opcional;
- completar toda la ruta.

## 56. Qué tomar de Habitica

- agrupar acciones pequeñas en misiones;
- entregar una respuesta inmediata al completar;
- usar hitos acumulativos;
- hacer visible la relación entre acción y recompensa;
- permitir objetivos opcionales;
- conservar una colección de logros;
- reservar la colaboración para una fase posterior.

## 57. Qué no copiar

- daño por no cumplir;
- presión sobre compañeros;
- rankings como centro de motivación;
- monedas y equipo como objetivo principal;
- lenguaje de combate aplicado a la lectura espiritual;
- niveles que parezcan medir madurez o valor religioso;
- exceso de elementos de videojuego.

## 58. Misiones recomendadas para Kol Basilea

Estas misiones podrían aparecer después de que el usuario ya haya completado su primer libro:

| Misión | Condición | Recompensa |
|---|---|---|
| Primer paso | Completar 3 Juan | Primer libro terminado |
| Primer tramo | Completar 7 libros | Hito de continuidad |
| Cartas breves | Completar los primeros libros epistolares | Tarjeta de contexto |
| Voces proféticas | Completar un bloque de profetas menores | Ilustración editorial |
| Mitad del camino | Completar 33 libros | Celebración de mitad de ruta |
| Toda la ruta | Completar 66 libros | Cierre de la experiencia |

Las misiones no deben aparecer como una lista interminable en el onboarding. Primero debe consolidarse el hábito básico.

## 59. Decisiones preliminares después de cinco referencias

| Necesidad de Kol Basilea | Referencia principal | Decisión preliminar |
|---|---|---|
| Hitos | Habitica | Usar misiones editoriales opcionales |
| Respuesta inmediata | Habitica + Finch | Celebrar el check sin demorar la lectura |
| Colección | Forest + Habitica | Conservar visualmente los libros terminados |
| Acción siguiente | Duolingo | Mostrar siempre el próximo capítulo o libro |
| Contexto | BibleProject | Integrar video y resumen antes de leer |
| Tono | Finch | Acompañar sin castigar |
| Competencia | Ninguna | Excluir rankings del MVP |
| Progreso global | Kol Basilea | Mostrar libros y capítulos, no puntos abstractos |

## 60. Estado actualizado del ejercicio

**Referencias analizadas:** 5 de 6  
**Referencias:** Duolingo, BibleProject, Finch, Forest y Habitica  
**Indicador del ejercicio:** `5/6 referencias analizadas`  
**Siguiente referencia:** YouVersion  
**Criterio de cierre del bloque:** seis referencias analizadas con la misma matriz y una decisión de diseño asociada a cada patrón relevante.

---

## Ejercicio 6: YouVersion

**Referencia observada:** [Bible App de YouVersion](https://www.youversion.com/bible-app) y [catálogo de planes de lectura](https://www.bible.com/reading-plans).  
**Superficies revisadas:** página oficial de la app, navegación web de Bible.com y catálogo de planes.  
**Objetivo:** Analizar cómo una plataforma bíblica de gran escala organiza texto, audio, video, planes y comunidades.

## 61. Propuesta de valor

YouVersion presenta la Bible App como una herramienta para leer, escuchar y orar, con la intención de ayudar a las personas a construir un ritmo diario de conexión con Dios.

### Observación

La propuesta no está limitada a una ruta de lectura. YouVersion funciona como una plataforma amplia de acceso a la Biblia, planes, contenido, audio, video y actividades relacionadas.

### Aplicación para Kol Basilea

Kol Basilea puede tomar el lenguaje de ritmo diario, pero debe conservar su foco:

> Una ruta progresiva para comenzar y terminar la Biblia.

No debe intentar convertirse desde el inicio en una plataforma general de oración, comunidad, audio, video, devocionales y planes infinitos.

## 62. Arquitectura de navegación

La navegación web observada presenta áreas principales como:

- Home;
- Bible;
- Verse of the Day;
- Videos;
- Plans;
- búsqueda;
- acceso a la app;
- cuenta.

### Lo que funciona

- las áreas principales están separadas;
- el usuario puede acceder directamente al texto bíblico;
- los planes tienen una sección propia;
- el contenido audiovisual tiene una entrada reconocible;
- la búsqueda permite descubrir contenido sin recorrer toda la navegación.

### Riesgo para Kol Basilea

Cada sección adicional abre una nueva decisión. Para un lector principiante, Home, Bible, Verse of the Day, Videos y Plans pueden competir entre sí.

### Aplicación para Kol Basilea

La navegación del MVP debería limitarse a cuatro destinos:

```text
Hoy · Ruta · Progreso · Más
```

El texto bíblico, el video y el contexto deben estar asociados al libro actual. Una biblioteca general puede llegar después.

## 63. Catálogo de planes

El catálogo de YouVersion muestra una gran cantidad de planes, agrupados por temas y categorías. Entre las categorías visibles aparecen temas como amor, ansiedad, sanidad, esperanza, miedo, paz, estrés y paciencia, además de categorías como novedades, relaciones, escuchar y ver, y libros del Antiguo y Nuevo Testamento.

### Lo que funciona

- la duración y el tema ayudan a elegir;
- la organización por categorías facilita el descubrimiento;
- existen múltiples puertas de entrada;
- la plataforma puede atender necesidades y perfiles muy distintos.

### Qué no copiar para el MVP

Kol Basilea no debe comenzar mostrando cientos de planes. El proyecto ya cuenta con una decisión editorial central: la ruta de 66 libros.

La elección del usuario debe ser de ritmo:

```text
Una ruta
Tres ritmos

365 días · 180 días · sin fecha
```

Esto reduce la parálisis por elección y protege la identidad del producto.

## 64. Lectura, audio y video

YouVersion integra distintas formas de acercarse al contenido bíblico: lectura, escucha, video, planes y devocionales.

### Aplicación para Kol Basilea

El modelo futuro podría incorporar audio o distintos formatos, pero el MVP debe priorizar una secuencia simple:

```text
Contexto en video
→ lectura del capítulo
→ check de avance
```

Si se incorpora audio, debe aparecer como una alternativa dentro del capítulo, no como otra ruta paralela que confunda al usuario.

## 65. Escala y organización

YouVersion demuestra que una plataforma bíblica puede sostener una cantidad enorme de contenidos, planes y organizaciones. Esa escala requiere una arquitectura de navegación clara, filtros y categorías.

### Aplicación para Kol Basilea

Aunque Kol Basilea empiece con una única ruta, conviene preparar algunos metadatos:

- orden de lectura;
- canon o orden tradicional;
- género literario;
- testamento;
- duración aproximada;
- video disponible;
- estado de progreso;
- fuente y licencia.

La diferencia es que esos metadatos deben ayudar a la ruta, no convertirse en filtros visibles desde el primer día.

## 66. Cuenta y sincronización

YouVersion se apoya en cuentas para sincronizar progreso, planes y actividad entre dispositivos.

### Aplicación para Kol Basilea

La decisión del MVP se mantiene:

- sin registro obligatorio;
- progreso local desde el primer uso;
- sincronización futura opcional;
- recuperación o exportación como mejora posterior.

La ausencia de cuenta puede ser una ventaja de activación, siempre que la app explique con honestidad que el progreso inicial queda guardado en el dispositivo.

## 67. Indicador de finalización en YouVersion

YouVersion comunica la duración de los planes y organiza el progreso dentro de planes seleccionados, pero su amplitud de contenidos hace que no exista un único final global de la plataforma.

### Aprendizaje para Kol Basilea

La claridad de final es una oportunidad de diferenciación. Kol Basilea sí tiene un final definido:

```text
Ruta completa
66 libros
1,189 capítulos
Final: Salmos
```

La interfaz debe mostrar siempre:

- el estado del capítulo actual;
- el estado del libro actual;
- el número de libros completados;
- el número de capítulos completados;
- el siguiente destino;
- el final de la ruta.

## 68. Qué tomar de YouVersion

- navegación por áreas bien diferenciadas;
- acceso directo al texto;
- planes con duración visible;
- categorías para descubrir contenido;
- soporte de lectura, audio y video;
- arquitectura preparada para múltiples fuentes;
- cuenta opcional en una fase posterior;
- sensación de plataforma confiable y completa.

## 69. Qué no copiar

- exceso de opciones en la primera pantalla;
- cientos de planes antes de completar el primer libro;
- mezclar lectura, devocional, video, audio y comunidad como acciones equivalentes;
- pedir cuenta antes de demostrar valor;
- hacer que el usuario construya su propio camino cuando ya existe una ruta editorial definida.

## 70. Decisiones preliminares después de seis referencias

| Necesidad de Kol Basilea | Referencias principales | Decisión preliminar |
|---|---|---|
| Ruta única | Duolingo + decisión propia | Una ruta principal de 66 libros |
| Contexto | BibleProject | Video y resumen dentro del libro |
| Acción pequeña | Finch | Un capítulo por acción |
| Progreso visual | Forest | Biblioteca o colección de libros terminados |
| Hitos opcionales | Habitica | Misiones editoriales sin castigo |
| Navegación | YouVersion | Separar Hoy, Ruta, Progreso y Más |
| Ritmo | Duolingo + YouVersion | 365, 180 días o sin fecha |
| Sincronización | YouVersion | Cuenta opcional futura, no requisito inicial |
| Final claro | Kol Basilea | 66 libros y 1,189 capítulos visibles |

## 71. Síntesis del ejercicio completo

Las seis referencias no apuntan a copiar una interfaz completa. Cada una resuelve una parte distinta del problema:

```text
Duolingo     → siguiente paso y estructura de hábito
BibleProject → contexto y aprendizaje audiovisual
Finch        → amabilidad y acciones pequeñas
Forest       → progreso visual acumulativo
Habitica     → misiones y hitos opcionales
YouVersion   → arquitectura bíblica y amplitud de formatos
```

La combinación recomendada para Kol Basilea es:

```text
Ruta clara
→ contexto breve
→ lectura pequeña
→ check inmediato
→ celebración sobria
→ biblioteca que crece
→ siguiente libro visible
```

## 72. Principios UI consolidados

1. **Una acción principal por pantalla.** El usuario debe saber qué hacer ahora.
2. **Un final visible por unidad.** Cada capítulo y cada libro deben poder marcarse como terminados.
3. **Dos escalas de progreso.** Mostrar tanto el capítulo actual como la ruta completa.
4. **Progreso acumulativo.** Lo terminado permanece visible.
5. **Pausas sin castigo.** La ausencia no borra ni destruye lo construido.
6. **Contexto antes de dificultad.** El video prepara, pero no bloquea.
7. **Una ruta, tres ritmos.** La meta cambia el ritmo, no la estructura.
8. **Gamificación subordinada al significado.** Los hitos ayudan a leer; no reemplazan la lectura.
9. **Sin registro como barrera inicial.** El usuario puede demostrar valor antes de crear una cuenta.
10. **Tono editorial y cálido.** La app debe sentirse acompañada, no infantil ni competitiva.

## 73. Indicador final del ejercicio

**Referencias analizadas:** 6 de 6  
**Referencias:** Duolingo, BibleProject, Finch, Forest, Habitica y YouVersion  
**Indicador de finalización:** `6/6 referencias analizadas — ejercicio completo`  
**Resultado:** principios UI consolidados para comenzar el documento de especificación visual y de interacción de Kol Basilea.

---

## Ejercicio 3: Finch

**Referencia observada:** [Finch](https://finchcare.com/about-finch)  
**Superficies revisadas:** presentación del producto, pantalla principal documentada y flujo de creación/completado de objetivos.  
**Objetivo:** Analizar cómo una app convierte acciones pequeñas en progreso emocionalmente positivo.

## 26. Propuesta de valor

Finch se presenta como:

> A self-care app. A little friend for you.

Su idea central es que el usuario da pequeños pasos para sí mismo mientras una mascota virtual crece junto con él. El lenguaje de producto insiste en que los pasos pequeños cuentan.

### Observación

Finch no comienza con una gran transformación. Comienza con una acción sencilla que puede completarse hoy.

### Aplicación para Kol Basilea

La lectura bíblica completa puede parecer enorme si se presenta como “1,189 capítulos”. La interfaz debe comenzar por una acción pequeña:

```text
Lee 3 Juan · capítulo 1
```

El progreso total puede estar disponible, pero no debe dominar la primera acción.

## 27. Estructura de la experiencia

Finch describe su ciclo principal en tres pasos:

1. conocer a la mascota y comenzar con algunos objetivos simples;
2. completar un objetivo o actividad y obtener energía;
3. enviar a la mascota a una aventura que luego devuelve una historia o descubrimiento.

### Observación

La recompensa no ocurre únicamente en el momento del check. El check habilita una experiencia posterior. Eso crea una relación entre acción pequeña y consecuencia significativa.

### Aplicación para Kol Basilea

Podemos adaptar la estructura sin utilizar una mascota:

```text
Leer capítulo
→ marcar capítulo
→ avanzar el libro
→ desbloquear el siguiente paso o hito
```

Ejemplo:

```text
Completaste 3 Juan

Has abierto el siguiente tramo de la ruta:
2 Juan
```

El libro siguiente funciona como la “aventura” desbloqueada, y el contexto histórico o literario puede funcionar como el descubrimiento que acompaña el avance.

## 28. Pantalla principal

La pantalla principal documentada de Finch coloca en el centro:

- objetivos diarios;
- un botón de aventura que aparece al completar la energía necesaria;
- una interacción posterior con la mascota;
- la mascota como elemento vivo del estado del día.

La barra inferior incluye Home, Quests, Shop, Friends, Bag y perfil de la mascota.

### Lo que funciona

- la pantalla principal comunica qué hacer hoy;
- los objetivos están agrupados en un lugar visible;
- existe una consecuencia clara después de completarlos;
- la mascota funciona como representación emocional del progreso;
- la navegación separa la acción principal de recompensas y extras.

### Riesgo para Kol Basilea

Una pantalla con demasiadas secciones —ruta, biblioteca, video, notas, estadísticas, premios y comunidad— puede diluir la acción de leer.

### Aplicación para Kol Basilea

La pantalla principal debería tener esta jerarquía:

1. siguiente capítulo;
2. progreso del libro;
3. progreso de la ruta;
4. meta de ritmo;
5. celebración o hito reciente.

Los extras deben quedar fuera del primer plano.

## 29. Objetivos pequeños

Finch permite crear objetivos con:

- título;
- frecuencia diaria, semanal u otra;
- hora opcional;
- notificaciones opcionales;
- pausa, posposición o edición.

Al completar un objetivo se pulsa un check y se obtienen energía o piedras arcoíris.

### Aplicación para Kol Basilea

La unidad mínima de acción debe ser el capítulo, no el libro completo ni una cantidad rígida de minutos.

```text
Capítulo 1 de 1 · 3 Juan
[Marcar como leído]
```

El lector puede leer más de un capítulo, pero nunca debe sentirse obligado a terminar un libro largo en una sola sesión.

## 30. Reanudación y flexibilidad

Un detalle especialmente valioso de Finch es que permite:

- marcar un objetivo de un día anterior;
- pausar un objetivo;
- posponerlo;
- editarlo.

### Aplicación para Kol Basilea

La app debe asumir que el lector puede ausentarse. Si vuelve después de varios días, la experiencia debe decir:

```text
Qué bueno verte de nuevo.

Terminaste 7 libros.
Retoma en: Cantares · capítulo 3 de 8

[Continuar lectura]
```

No deben aparecer mensajes como “perdiste tu racha” o “vas atrasado”.

El progreso no se marca retroactivamente de manera automática, pero el usuario sí debería poder corregir un check si terminó un capítulo fuera de la app.

## 31. Recompensas y tono

Finch usa energía, piedras, aventuras, historias, descubrimientos, ropa y decoración. El valor principal no está en una puntuación abstracta, sino en que el mundo del usuario cambia y responde.

### Lo que funciona

- la recompensa es visible;
- el tono es cálido;
- el producto celebra el cuidado, no el rendimiento;
- las acciones pequeñas tienen consecuencias acumulativas;
- los usuarios pueden personalizar parte de la experiencia.

### Qué adaptar para Kol Basilea

La recompensa no debería ser una moneda ni un avatar. Puede ser:

- un libro completado;
- un nuevo tramo de la ruta;
- una tarjeta de contexto desbloqueada;
- una ilustración editorial;
- un hito de lectura;
- una frase de reconocimiento;
- una vista más completa de la biblioteca recorrida.

La gamificación debe servir al significado de la lectura, no competir con él.

## 32. Indicador de finalización en Finch

Finch tiene un check muy claro para objetivos individuales y una consecuencia visible al completarlos. Sin embargo, su modelo está pensado para objetivos recurrentes y autocuidado, no para una ruta larga de 66 unidades.

### Aprendizaje para Kol Basilea

Debemos combinar dos niveles:

```text
Capítulo: completado
Libro: 1 de 66
Ruta: 1 de 1,189 capítulos
```

El check debe ser inmediato y local. El avance del libro y de la ruta debe ser acumulativo y persistente.

## 33. Qué tomar de Finch

- acciones pequeñas y concretas;
- check inmediato;
- recompensas cálidas;
- sensación de compañía;
- objetivos editables y pausables;
- posibilidad de retomar sin castigo;
- progreso emocionalmente visible;
- una pantalla principal centrada en la acción del día.

## 34. Qué no copiar

- mascota obligatoria;
- estética infantil o demasiado tierna;
- monedas como objetivo principal;
- tienda o personalización antes de formar el hábito;
- demasiadas tareas diarias;
- convertir la lectura en una lista de productividad;
- asociar el valor espiritual con el rendimiento de una racha.

## 35. Decisiones preliminares después de tres referencias

| Necesidad de Kol Basilea | Referencia principal | Decisión preliminar |
|---|---|---|
| Acción pequeña | Finch | Un capítulo es la unidad mínima |
| Check inmediato | Finch | Marcar leído debe ser sencillo y visible |
| Continuidad | Duolingo + Finch | Mostrar el siguiente capítulo o libro |
| Reanudación | Finch | Pausar y volver sin penalización |
| Contexto | BibleProject | Video y resumen dentro de la ficha del libro |
| Meta | Duolingo | Ritmo opcional, nunca obligación rígida |
| Recompensa | Adaptación propia | Hitos editoriales, no monedas |
| Progreso global | Kol Basilea | 66 libros y 1,189 capítulos explícitos |

## 36. Estado final de la bitácora

**Referencias analizadas:** 6 de 6  
**Referencias:** Duolingo, BibleProject, Finch, Forest, Habitica y YouVersion  
**Indicador del ejercicio:** `6/6 referencias analizadas — ejercicio completo`  
**Siguiente paso:** convertir los principios consolidados en la especificación de UI de Kol Basilea.  
**Criterio de cierre del bloque:** seis referencias analizadas con la misma matriz y una decisión de diseño asociada a cada patrón relevante.

