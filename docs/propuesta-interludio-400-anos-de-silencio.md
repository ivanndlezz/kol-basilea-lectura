# Propuesta editorial y funcional: 400 años de silencio

> **Proyecto:** Kol Basilea Lectura  
> **Ubicación:** Eras bíblicas → Segundo Templo tardío → interludio entre Malaquías y los Evangelios  
> **Tipo:** Artículo histórico-editorial, no libro bíblico  
> **Estado:** Propuesta de producto y criterios de aceptación. La existencia de contenido en el repositorio no equivale a implementación visual validada.

## 1. Problema que resuelve

El lector termina Malaquías y comienza los Evangelios en un mundo transformado: Persia ha cedido paso a potencias helenísticas y luego a Roma; Judea está bajo influencia romana; aparecen Herodes, fariseos, saduceos y un ambiente ampliamente helenizado.

**Pregunta central:** ¿Qué sucedió entre ambos libros?

El artículo debe tender un puente narrativo e histórico, sin presentar el período como un vacío de acontecimientos.

## 2. Concepto editorial

- **Título:** 400 años de silencio
- **Subtítulo:** El mundo cambió mientras Israel esperaba.
- **Alternativa:** Cuatro siglos entre la promesa y su cumplimiento.
- **Categoría visible:** Interludio histórico.
- **Contexto:** Del dominio persa al mundo romano.
- **Temas:** Historia · Contexto · Profecía.

### Introducción propuesta

> Entre las últimas palabras de los profetas y la aparición de Juan el Bautista transcurrieron aproximadamente cuatro siglos. Imperios surgieron y cayeron, Jerusalén fue conquistada y el Templo profanado. Pero la promesa de Malaquías permanecía: «He aquí, yo os envío el profeta Elías».

**Precisión histórica:** «400 años de silencio» es una denominación teológica aproximada, no una cronología exacta ni una afirmación de ausencia absoluta de literatura, religiosidad o revelación percibida. Malaquías suele situarse en el siglo V a. C.; el dominio persa comienza antes de su actividad.

## 3. Ubicación y experiencia de navegación

Mantener las eras existentes y su numeración. **No reemplazar ni borrar** Segundo Templo tardío, sus eventos, suberas, historias o vínculos.

La nueva pieza debe ser visible como una **sección editorial propia** dentro de la sexta era, destacada antes de los acontecimientos históricos existentes. Además, ofrecer una conexión contextual en el paso entre Malaquías y los Evangelios.

```text
Malaquías
  ↓
INTERLUDIO HISTÓRICO
400 años de silencio
Del dominio persa al mundo romano
[Leer el artículo]
  ↓
Los Evangelios
Mateo · Marcos · Lucas · Juan
```

- **Ruta de lectura:** invitación opcional al completar Malaquías; continuar al siguiente libro según el orden editorial actual, sin imponer el interludio.
- **Ruta en Eras:** `/history/segundo-templo/cuatrocientos-anos-de-silencio/` (conservar o adaptar a las reglas reales del router).
- **Tarjeta:** título, subtítulo, categoría «Interludio histórico», sin referencia falsa a un capítulo bíblico.
- **Artículo:** cabecera, introducción, secciones narrativas, cronología, personajes, fuentes y enlace para seguir con los Evangelios.
- **Regreso:** enlace claro a Segundo Templo tardío y navegación entre eras.

## 4. Arquitectura del artículo

Desarrollar una historia continua, con transiciones narrativas, evitando una sucesión de fichas enciclopédicas.

1. **La última promesa.** Malaquías 4:5–6 y la expectativa de Elías.
2. **El dominio persa.** Retorno del exilio, reconstrucción del Segundo Templo y reorganización de Judea. Distinguir 539 a. C. de la época de Malaquías.
3. **La llegada de los griegos.** Alejandro Magno (332 a. C. en la región), helenización y traducción griega de las Escrituras.
4. **El Templo profanado.** Antíoco IV (167 a. C.), resistencia macabea y purificación del santuario (164 a. C.).
5. **Roma entra en Jerusalén.** Pompeyo (63 a. C.), dinastía herodiana y gobierno romano.
6. **El silencio de los profetas.** 1 Macabeos 4:46; 9:27; 14:41, tradición rabínica de la *bat kol* y expectativa mesiánica. No confundir *bat kol* con el nombre del período.
7. **Una voz en el desierto.** Zacarías, Lucas 1:5–22, Juan el Bautista y la conexión literaria con Malaquías.

Incluir una explicación contextual del surgimiento y la diversidad de fariseos, saduceos y otros movimientos judíos, con la cautela necesaria respecto de su cronología.

## 5. Cronología interactiva

Mostrar hitos ordenados, con fecha aproximada cuando corresponda:

| Fecha | Hito |
|---|---|
| 539 a. C. | Ciro conquista Babilonia |
| c. 516 a. C. | Finalización del Segundo Templo |
| 332 a. C. | Alejandro Magno llega a la región |
| 167 a. C. | Crisis bajo Antíoco IV y revuelta macabea |
| 164 a. C. | Purificación del Templo |
| 63 a. C. | Pompeyo toma Jerusalén |
| 37–4 a. C. | Reinado de Herodes el Grande |
| Finales del siglo I a. C. | Marco narrativo de los anuncios de Lucas 1 |

La línea de tiempo debe ser usable en móvil, accesible con teclado y compatible con `prefers-reduced-motion`. Los eventos pueden abrir fichas breves sin sacar al lector del artículo.

## 6. Personajes y movimientos

Fichas breves de Ciro II, Alejandro Magno, Antíoco IV, Judas Macabeo, Pompeyo, Herodes el Grande, Zacarías y Juan el Bautista. Añadir contexto sobre fariseos, saduceos y otros grupos relevantes. Cada ficha debe distinguir evidencia histórica, fuente textual y tradición.

## 7. Tratamiento de fuentes

Identificar visualmente y en el contenido tres categorías:

- **Texto bíblico:** referencias y citas de Malaquías y Lucas.
- **Historia documentada:** acontecimientos sustentados en fuentes antiguas e historiografía.
- **Interpretación teológica:** la lectura cristiana de la relación entre Malaquías, Juan y Jesús.

No presentar como hecho histórico universal la afirmación de que Dios guardó silencio literalmente ni que Juan no fue profeta. Diferenciar las tradiciones canónicas sobre 1 Macabeos. Referenciar, entre otras fuentes, 1 Macabeos 4:46; 9:27; 14:41, Josefo y la tradición rabínica posterior (Yoma 9b).

## 8. Requisitos de integración técnica

1. **Fuente de datos:** conservar la estructura actual de `dist/data/history/timeline.json`; el interludio puede referenciarse por ID estable `cuatrocientos-anos-de-silencio`. No duplicar contenido si se normaliza en un archivo editorial.
2. **Render:** admitir artículos con múltiples secciones, no solo sinopsis y botón «Comenzar a leer». El interludio no debe enlazar por defecto a Génesis ni a otro libro incorrecto.
3. **Visibilidad:** mostrar la tarjeta editorial antes de los eventos de Segundo Templo tardío, incluso cuando la era contenga otros relatos. Conservar los demás elementos de la era.
4. **Navegación:** URL profunda funcional con carga directa, recarga y retroceso del navegador; evitar que la selección de otra era deje una ruta de artículo inconsistente.
5. **Progreso:** no contar el interludio como libro, capítulo, lectura obligatoria ni hito de los 66 libros.
6. **Metadatos:** título y descripción únicos, Open Graph y vista previa para compartir por WhatsApp.
7. **Caché:** actualizar las referencias de versión necesarias y revisar el service worker para evitar contenido obsoleto.
8. **Diseño:** respetar la identidad móvil, tipografía, tema claro/oscuro y componentes existentes de Kol Basilea. No introducir regresiones ni eliminar funcionalidades previas.

## 9. Criterios de aceptación

- [ ] En Eras → Segundo Templo tardío se ve una sección claramente titulada «400 años de silencio», no únicamente un registro oculto en JSON.
- [ ] La tarjeta abre el artículo completo mediante una URL compartible.
- [ ] La URL funciona al abrirla directamente y al recargar.
- [ ] El artículo presenta las siete secciones narrativas y sus fuentes.
- [ ] La cronología y las fichas de personajes son visibles y funcionales.
- [ ] El lector puede distinguir Biblia, historia e interpretación.
- [ ] Existe una invitación opcional entre Malaquías y los Evangelios.
- [ ] No cambia el conteo ni el progreso de los 66 libros.
- [ ] Los eventos, suberas, relatos y controles preexistentes siguen funcionando.
- [ ] Se verifica en móvil, tema claro/oscuro y después del despliegue de GitHub Pages.

## 10. Alcance y secuencia recomendada

**Primera entrega:** artículo editorial completo, tarjeta destacada, ruta profunda y navegación correcta.  
**Segunda entrega:** cronología interactiva, fichas y referencias cruzadas.  
**Tercera entrega:** invitación contextual al terminar Malaquías y metadatos de difusión.

**Principio de implementación:** arreglar los huecos sin quitar lo que ya funciona. Validar visualmente la versión desplegada, no solo la presencia del contenido en el repositorio.
