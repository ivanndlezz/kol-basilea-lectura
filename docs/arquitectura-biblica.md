# Arquitectura de datos — Kol Basilea Lectura

## Separación de responsabilidades

| Capa | Archivo | Responsabilidad |
| --- | --- | --- |
| Catálogo bíblico | `dist/data/bible-catalog.js` | 66 libros, 1,189 capítulos, clasificación, testamento, orden canónico y orden editorial independiente |
| Personas y relaciones | `dist/data/catalog/people.json`, `sources.json`, `relationships.json` | Autores, escribas, compiladores y fuentes enlazados por identificadores estables |
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
- Las relaciones editoriales almacenan `personId`, `bookId` y `sourceId`; los nombres y etiquetas para la interfaz se resuelven al cargar los registros.
- `npm run validate:data` comprueba IDs únicos, referencias existentes, órdenes del catálogo y los enlaces de videos antes de probar o publicar la PWA.

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

## Pipeline USFM → JSON en GitHub Actions

Fuente: [Reina-Valera 1909, eBible.org](https://ebible.org/spaRV1909/) — dominio público.
Archivo USFM confirmado: `https://ebible.org/Scriptures/spaRV1909_usfm.zip`.

En cada despliegue, `.github/workflows/static.yml` descarga el archivo oficial en un directorio temporal, ejecuta `scripts/convert-usfm.mjs`, valida con `scripts/validate-generated.mjs` y publica los JSON en `dist/data/rvr1909/<bookId>.json`. Los archivos generados se empaquetan en el artefacto de Pages; no se versionan en el repositorio.

La PWA utiliza `dist/data/bible-loader.js` para descargar un libro cuando se necesita. `dist/sw.js` conserva en caché el shell de la app y los libros que el usuario ya consultó para permitir volver a leerlos sin conexión, después de una primera descarga exitosa. La descarga de toda la Biblia de una sola vez no está implementada.

Los marcadores USFM de versículo vacíos se registran como advertencias, sin inventar texto. El pipeline valida los 66 libros, 1,189 capítulos y más de 30,000 versículos no vacíos; también detecta marcadores USFM residuales en el texto visible.

Para ejecutar el conversor en una computadora local:

```bash
mkdir -p sources/rvr1909
curl -fL https://ebible.org/Scriptures/spaRV1909_usfm.zip -o /tmp/spaRV1909_usfm.zip
unzip -q /tmp/spaRV1909_usfm.zip -d sources/rvr1909
npm run build:bible
node scripts/validate-generated.mjs
```

La app mantiene la clave de almacenamiento `kol-basilea-lectura-v1`, los identificadores de libros y el avance guardado. Los JSON son contenido estático generado; no se requiere Oracle ni servidor Node permanente.
