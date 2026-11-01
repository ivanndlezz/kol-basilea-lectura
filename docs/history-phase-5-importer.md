# Paso 5 — Motor de importación (piloto)

## Primer entregable
`scripts/import-history-sections.mjs` genera unidades literarias a partir de encabezados `s1` BSB y el corpus RV1909 generado por el build. El catálogo **no** se sirve en la UI ni se considera publicación editorial.

### Ejecutar después de generar RV1909
```sh
node scripts/import-history-sections.mjs /tmp/kol-basilea-headings.jsonl dist/data/rvr1909 reports/history-sections-pilot.json reports/history-sections-pilot-report.json
```

Entradas: archivo JSONL con `b`, `level`, `c`, `before_v` e `id`; archivos JSON de RV1909 por libro.

Salidas: `sections[]` con referencias de inicio/fin, procedencia y `reviewStatus: verified-reference`; reporte con errores y cobertura por libro. El proceso termina con código 1 si hay errores. Los títulos, resúmenes, iconos y asignaciones cronológicas permanecen `null` hasta revisión.

## Limitaciones conocidas
- Piloto limitado a Éxodo, Jueces, Lucas y Hechos.
- Los límites finales se derivan del siguiente encabezado `s1`, no de una comprobación exegética.
- No incluye encabezados anidados `s2` ni otros niveles.
- No infiere eras ni convierte secciones automáticamente en relatos.
- Falta fijar revisión exacta de la fuente y automatizar la ejecución y sus pruebas en GitHub Actions.
- El script está versionado, **pero su ejecución y sus resultados todavía deben verificarse**.

## Próxima puerta
Ejecutar con los archivos reales del workflow, revisar los 439 intervalos y los informes; después agregar pruebas de rangos y un mapeo editorial de clasificación, antes de ampliar a los 66 libros.

## Clasificación editorial (segunda etapa)

`scripts/classify-history-sections.mjs` lee el catálogo generado y el árbol de eras de `dist/data/history/timeline.json`. Añade `eraCandidates` según `bookIds`, pero conserva `eraId: null` mientras no haya una decisión editorial explícita.

```sh
node scripts/classify-history-sections.mjs reports/history-sections-pilot.json dist/data/history/timeline.json reports/history-sections-classified.json reports/history-classification-report.json
```

Se puede pasar un quinto argumento con un archivo JSON de revisiones manuales, indexado por identificador de sección:

```json
{
  "exodo-001": {
    "eraId": "exodus-judges",
    "kind": "literary-unit",
    "title": "Título editorial revisado",
    "icon": "book-open"
  }
}
```

No se proporcionan revisiones por defecto: una coincidencia por libro no acredita cronología ni género. Las revisiones deben comprobarse con el texto bíblico antes de publicarse. El reporte informa cuántas secciones están sugeridas, revisadas o sin clasificar. El workflow de auditoría ahora genera ambos reportes y mantiene `publicationReady: false`.
