# Paso 4 — Cierre de investigación y validación de fuentes

**Proyecto:** Kol Basilea · Historia bíblica  
**Fecha:** 2026-11-01  
**Decisión:** APROBADO para iniciar el paso 5, con alcance de piloto y controles de calidad explícitos.

## 1. Fuentes y derechos de uso

| Fuente | Uso autorizado / delimitado | Evidencia |
| --- | --- | --- |
| Reina-Valera 1909 (eBible.org) | Texto bíblico base, generado por el workflow de compilación | `.github/workflows/static.yml`, `scripts/convert-usfm.mjs`, `scripts/validate-generated.mjs` |
| BSB `base/headings.jsonl` | Índice candidato de comienzos de secciones; licencia CC0 declarada por el proyecto generador | https://github.com/BSB-publishing/bsb-data (apartado *Headings Index*) |
| BSB `bsb-data-output` | Datos generados; verificar la licencia de cada ruta, no asumir que todo el repositorio tiene la misma | https://github.com/BSB-publishing/bsb-data-output |
| Berean Standard Bible | Texto dedicado al dominio público el 30 de abril de 2023 | https://berean.bible/terms.htm y https://berean.bible/licensing.htm |

**Decisión editorial:** las coordenadas de BSB son propuestas de división, no delimitaciones canónicas ni títulos obligatorios. Kol Basilea puede publicar títulos, resúmenes y relatos propios en español. Registrar `sourceId`, `sourceVersion`, `license` y `reviewStatus` en el producto derivado. No incorporar morfología, diccionarios o índices CC-BY/CC-BY-SA sin sus avisos correspondientes.

## 2. Auditoría técnica reproducible

- Workflow: `.github/workflows/audit-history-headings.yml`
- Script: `scripts/audit-history-headings.mjs`
- Ejecución verificada: https://github.com/ivanndlezz/kol-basilea-lectura/actions/runs/41353465424
- Artefacto: `history-heading-compatibility`

| Libro | Inicio de sección válido | Duplicados | Fuera de orden |
| --- | ---: | ---: | ---: |
| Éxodo | 123/123 | 0 | 0 |
| Jueces | 52/52 | 0 | 0 |
| Lucas | 154/154 | 0 | 0 |
| Hechos | 110/110 | 0 | 0 |
| **Total** | **439/439** | **0** | **0** |

**Qué valida:** existencia de capítulo y versículo inicial de cada registro `s1` en RV1909 y orden de sus comienzos. **Qué no valida:** límites finales, equivalencia exegética, historicidad de los acontecimientos, cronología, traducción de títulos ni el resto de los 66 libros. La prueba es piloto, no cobertura universal.

## 3. Contrato editorial para el paso 5

Cada registro importado tendrá, como mínimo:

- `id` estable; `bookId` compatible con RV1909; `start` y `end` con capítulo y versículo.
- `source`: origen, identificador original, versión y licencia.
- `kind`: `literary-unit`, `event`, `story` o `context`. No confundir sección literaria con suceso histórico.
- `eraId` y `subEraId` cuando la clasificación esté justificada; permitir `null` o varias relaciones cuando haya incertidumbre o solapamiento.
- `date`: precisión explícita (`undated`, `debated`, `approximate`, `documented`); no inferir fechas a partir del orden bíblico.
- `title`, `summary` e `icon` como metadatos editoriales propios, con valores por defecto accesibles.
- `reviewStatus`: `candidate`, `verified-reference`, `editorially-reviewed`, `published`.

La **referencia bíblica** es un dato comprobable; la **asignación de era** es una interpretación editorial; el **relato** es contenido original. Mantenerlas en capas independientes.

## 4. Criterios de aceptación del importador

1. Lectura de `headings.jsonl` sin publicar automáticamente los textos originales de encabezado.
2. Mapeo explícito de códigos BSB/OSIS a IDs RV1909; errores claros para libros desconocidos.
3. Verificación de todos los puntos de inicio y límites finales derivados contra el corpus generado.
4. Determinación de límites finales como el versículo anterior al siguiente comienzo, usando índices reales de versículos y gestionando cambios de capítulo/libro; revisión de secciones anidadas.
5. Detección de duplicados, referencias fuera de orden, rangos vacíos y solapamientos no justificados.
6. Exportación JSON determinista y reporte de cobertura/errores; **no publicar** registros con errores críticos.
7. Separación entre importación técnica y revisión humana de eras, fechas, títulos, iconos y narraciones.
8. Extender auditoría a 66 libros antes de declarar cobertura completa.

## 5. Riesgos residuales y próximos pasos

- El piloto 439/439 no garantiza compatibilidad en libros con diferencias de versificación; registrar excepciones por libro.
- El índice BSB puede dividir un texto de forma distinta de la organización literaria adoptada por Kol Basilea; respetar revisiones humanas.
- Los títulos de encabezados en inglés no equivalen a una edición española: evitar traducción/publicación masiva sin revisión.
- Versionar fuente y resultados para poder repetir la auditoría.
- Validar iconos semánticos contra un catálogo de nombres admitidos y mantener representación accesible.

## Dictamen

**Paso 4 aprobado como investigación de fuentes y viabilidad del método.** Se ha identificado una fuente de encabezados CC0 y verificado técnicamente el piloto. **Paso 5 autorizado:** construir importador, clasificación y validación, con expansión progresiva de la cobertura y revisión editorial antes de publicar. No se declara todavía una base histórica de 66 libros completa.
