# Arquitectura de datos — Kol Basilea Lectura

## Separación de responsabilidades

| Capa | Archivo | Responsabilidad |
| --- | --- | --- |
| Catálogo bíblico | `dist/data/bible-catalog.js` | 66 libros, 1,189 capítulos, clasificación, testamento, orden canónico y orden editorial independiente |
| Texto bíblico | `dist/data/bible-rvr1909.js` | Traducción RVR1909, versículos disponibles, fuente y licencia; el contenido faltante no se inventa |
| Contenido editorial | `dist/data/editorial-content.js` | Introducciones y videos con atribución; notas históricas documentadas |
| Progreso | `dist/data/reading-progress.js` | Selectores puros y actualización de capítulos; libros terminados derivados |
| Interfaz y navegación | `dist/app.js` | Pantallas, eventos, persistencia local y presentación |

## Invariantes

- `BOOKS.length === 66`; suma de capítulos `=== 1189`.
- `canonicalOrder` representa el orden tradicional del canon de 66 libros; `readingOrder` conserva la ruta editorial del proyecto (3 Juan primero, Salmos último).
- Los identificadores de libro permanecen estables (`3-juan`, `1-juan`, etc.) para conservar progreso existente.
- `completedChapters` es la única fuente persistida de progreso; `completedBooks`, contador y estantería son derivados, nunca una segunda fuente de verdad.
- La clave de almacenamiento permanece `kol-basilea-lectura-v1` para no reiniciar sesiones ni capítulos marcados.
- La traducción y los contenidos editoriales son capas separadas: no se presentan interpretaciones como texto bíblico.
- El contenido editorial no disponible permanece ausente; no se rellenan metadatos históricos, licencias o videos con supuestos.

## Contratos actuales

```js
import { BOOKS, getCanonicalBooks, getReadingBooks, getBooksByCategory } from "./data/bible-catalog.js";
import { getBibleChapter, getBibleTranslation } from "./data/bible-rvr1909.js";
import { getBookEditorial, BOOK_INFO } from "./data/editorial-content.js";
import { completedChapters, isBookFinished, completedBookCount, nextReadingBook, markChapterComplete } from "./data/reading-progress.js";
```

La capa de progreso es pura: recibe un estado y devuelve valores calculados o una copia actualizada. `app.js` conserva la responsabilidad de guardar ese estado en `localStorage`.

## Próximas extensiones

- Incorporar metadatos bibliográficos y fuentes verificadas para cada libro sin inventar autoría o cronología.
- Agregar traducciones mediante adaptadores que preserven atribución, derechos y licencias.
- Añadir pruebas automatizadas de integridad del catálogo y compatibilidad del almacenamiento.
- Preparar sincronización opcional en el futuro, sin registro obligatorio.
