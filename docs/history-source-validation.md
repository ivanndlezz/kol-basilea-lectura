# Paso 4/6 — Auditoría de fuentes (2026-11-01)

## Dictamen
**NuBerea/segments: CONDICIONAL / NO APROBADO para importación automática.** La ficha pública declara límites de perícopas para Biblia hebrea y NT griego y topología de eventos, pero los archivos y la especificación completa requieren aceptar condiciones de acceso. No se ha verificado esquema por configuración, cobertura real de los 66 libros ni posibilidad de descarga reproducible.

**midvash/bible-data: APTO COMO CANDIDATO para normalizar/verificar referencias, NO como segmentador.** Publica 66 libros con identificadores OSIS, JSON por libro y SQLite; no se ha demostrado que contenga límites de perícopas. Cada versión tiene licencia propia. RV1909 permanece como texto de lectura de Kol Basilea.

**Open Bible Data (Freely-Given.org): CANDIDATO PARA ESTUDIAR divisiones por sección.** Presenta lectura por secciones y paralelos de evangelios. Antes de reutilizar límites, verificar acceso a datos estructurados y licencia concreta de la edición OET.

## Matriz de evaluación
| Fuente | Límites de perícopas | Acceso a datos | Licencia | Resultado |
|---|---|---|---|---|
| NuBerea/segments | Declarados AT+NT | Gated: aceptar condiciones; SPEC gated | CC BY 4.0 general; excepciones CC BY-NC 4.0 por configuración | Condicional |
| NuBerea/pericope-features | Declarados AT+NT | Gated | CC BY 4.0 declarado | Condicional |
| midvash/bible-data | No acreditados | Público (JSON/SQLite) | Por versión | Candidato validador |
| Open Bible Data/OET | Secciones visibles | Sitio público; exportación por verificar | Por edición | Investigar |

## Riesgos bloqueantes
1. **Acceso:** NuBerea requiere aceptar condiciones y compartir información de contacto. No intentar eludir el control.
2. **Licencias:** no asumir CC BY 4.0 universal. La configuración `dss_pericopes` tiene linaje CC BY-NC 4.0; Sefaria también presenta términos NC. Verificar por configuración antes de cualquier redistribución comercial.
3. **Cobertura:** una afirmación de «AT y NT» no prueba que todas las referencias de los 66 libros estén segmentadas.
4. **Semántica:** perícopa no equivale a relato; clasificar unidades por género y revisar agrupaciones.
5. **Cronología:** las eras 8–10 necesitan corpus historiográficos y un protocolo distinto para acontecimientos posbíblicos.
6. **Reproducibilidad:** fijar revisión/hash, licencia, fecha de descarga y mapeo de libros antes de generar catálogos.

## Puertas de aprobación
- [ ] Acceso autorizado a archivos y especificación por configuración.
- [ ] Licencia y atribución de cada configuración revisadas.
- [ ] Esquema y versificación inspeccionados con ejemplos reales.
- [ ] Cobertura cuantificada por libro (66/66), incluidos huecos.
- [ ] Piloto Éxodo, Jueces, Lucas y Hechos: límites y solapamientos.
- [ ] Exportación reproducible sin copiar textos protegidos.
- [ ] Fuentes historiográficas de eras 8–10 seleccionadas y licenciadas.

## Fuentes consultadas
- https://huggingface.co/datasets/NuBerea/segments
- https://huggingface.co/datasets/NuBerea/pericope-features
- https://github.com/midvash/bible-data
- https://freely-given.org/OBD/

**Estado del hito 4:** investigación y evaluación preliminar realizadas; aprobación final BLOQUEADA por acceso y verificación de archivos. No ejecutar el paso 5 sobre datos no aprobados.


## Actualización: alternativa pública prioritaria — BSB (2026-11-01)

**Candidato principal para el piloto: BSB-publishing/bsb-data-output.** El repositorio publica `base/headings.jsonl` (índice de encabezados) y `base/paragraphs.jsonl`. El proyecto BSB-publishing/bsb2usfm documenta la columna `Hdg` como encabezados de sección y declara cobertura de los 66 libros. En Berean Blue se documenta la extracción de paratexto de la BSB desde USFM como dominio público, con límites de perícopas por libro. Esto ofrece una ruta abierta más viable que NuBerea, pero aún hay que inspeccionar el archivo real y verificar condiciones concretas de redistribución del índice.

Fuentes:
- https://github.com/BSB-publishing/bsb-data-output
- https://github.com/BSB-publishing/bsb2usfm/blob/main/README_developer.md
- https://berean.blue/sources

**Decisión revisada:** priorizar BSB como fuente candidata de encabezados/límites para el piloto Éxodo–Jueces–Lucas–Hechos; NuBerea queda como fuente complementaria condicionada a acceso autorizado. No copiar el texto inglés ni sustituir RV1909. Los encabezados son divisiones editoriales, no relatos automáticamente. Su agrupación y los títulos españoles requieren revisión.

**Aprobación:** candidata, **no aprobada aún para importación productiva**. Quedan por ejecutar: descarga/inspección de `headings.jsonl`, mapeo de versificación y libros, medición de cobertura real 66/66, verificación de derechos del archivo concreto y comparación piloto. La selección de fuentes historiográficas para eras 8–10 sigue pendiente.


## Auditoría ejecutada sobre archivos reales — 2026-11-01

Se leyó el archivo completo `base/headings.jsonl` directamente del repositorio de BSB a través de GitHub: **4,543 registros JSONL, 66 libros con al menos un encabezado `s1`**. El archivo tiene niveles `s1`, `s2`, `r`, `d`; `r` son referencias cruzadas y **no** límites de sección. Conteo de encabezados `s1` en el piloto: **Éxodo 123, Jueces 52, Lucas 154, Hechos 110**. Son recuentos de encabezados editoriales, no de relatos.

El esquema `schema/headings.schema.json` requiere `id`, `b`, `c`, `before_v`, `level`, `text`; `before_v` indica el versículo siguiente al encabezado. Los límites finales deben derivarse del siguiente encabezado del mismo nivel y del último versículo real del libro; **todavía no se verificaron contra RV1909**.

`VERSION.json` indica build `2026-09-20T02:23:43Z`, fuente BSB-USJ `3c13b1892e9f37c53ca7d75b531bd1336a874a13`. La procedencia está identificada, pero falta fijar el commit exacto de `bsb-data-output` para reproducibilidad.

**Licencia:** `ATTRIBUTION.md` identifica BSB-USJ como CC0; `LICENSE-CC0.md` describe reutilización comercial. El README clasifica `base/display/` como CC0 y `base/index-cc-by/` como CC BY 4.0, **pero no clasifica expresamente `base/headings.jsonl` en su tabla**. Antes de distribuir ese archivo o títulos derivados, confirmar su alcance legal específico (o utilizar solo referencias de límites verificadas con atribución voluntaria).

**Resultado del piloto de accesibilidad y estructura: APROBADO.** Resultado de reutilización y versificación: **PENDIENTE**. El hito 4 no está cerrado. No se modificó la UI ni se publicaron relatos nuevos.

Archivos revisados:
- https://github.com/BSB-publishing/bsb-data-output/blob/main/base/headings.jsonl
- https://github.com/BSB-publishing/bsb-data-output/blob/main/schema/headings.schema.json
- https://github.com/BSB-publishing/bsb-data-output/blob/main/VERSION.json
- https://github.com/BSB-publishing/bsb-data-output/blob/main/ATTRIBUTION.md
- https://github.com/BSB-publishing/bsb-data-output/blob/main/README.md


## Verificación adicional de la licencia y del corpus local (2026-11-01)

Se volvió a leer el README de `BSB-publishing/bsb-data-output`: la tabla de licencias **no menciona** `base/headings.jsonl` (aunque sí `base/display/`, `base/index-cc-by/`, `base/concordance/` y `schema/`). `ATTRIBUTION.md` identifica el texto fuente BSB-USJ como CC0, pero **esto no equivale a una declaración explícita de licencia del archivo de encabezados generado**. Estado legal: pendiente de confirmación con los responsables del repositorio. Hasta entonces, no incorporar ni redistribuir títulos de BSB en Kol Basilea.

Se inspeccionó el repositorio Kol Basilea: `dist/data/bible-translations.js` declara RV1909 con `dataDir: "rvr1909"`; `dist/data/bible-loader.js` solicita libros desde `./rvr1909/{bookId}.json`. No obstante, la ruta `dist/data/rvr1909/` no está disponible en el árbol GitHub consultado (404). Por ello **no se realizó aún el contraste versículo por versículo**. La app también cuenta con `dist/data/pericopes.js`, que ya maneja secciones editoriales separadas por libro y capítulo, pero esto no acredita que los límites de BSB sean válidos para RV1909.

**Bloqueos pendientes para completar el paso 4:**
1. Obtener declaración inequívoca de licencia para `base/headings.jsonl` (o elegir otra fuente expresamente licenciada).
2. Obtener un corpus RV1909 accesible y verificable para contrastar 439 límites candidatos del piloto, incluyendo versículos de inicio y fin.
3. Registrar diferencias de versificación y decidir su tratamiento editorial.

No se debe dar por aprobado el paso 4 ni avanzar a publicación automática de relatos mientras persistan estos bloqueos.


## Corrección de diagnóstico — corpus RV1909 generado en despliegue (2026-11-01)

La ausencia de `dist/data/rvr1909/` en el **árbol fuente** de GitHub **no implica** ausencia de la traducción en el sitio publicado. Se verificaron los siguientes archivos reales del repositorio:

- `.github/workflows/static.yml`: el despliegue descarga `https://ebible.org/Scriptures/spaRV1909_usfm.zip`, descomprime la fuente, ejecuta `node scripts/convert-usfm.mjs` para RV1909 y otras tres traducciones, valida resultados y publica `dist/`.
- `.github/workflows/build-bible.yml`: genera los JSON de las cuatro traducciones como artefacto descargable (retención 7 días).
- `scripts/convert-usfm.mjs`: convierte USFM por libro a JSON y valida número de capítulos y presencia de versículos iniciales.
- `scripts/validate-generated.mjs`: verifica 66 libros, 1,189 capítulos y al menos 28,000 versículos por traducción.

**Consecuencia:** la ruta RV1909 está **identificada y reproducible por diseño**, no hay que reconstruir un corpus nuevo. No se ha inspeccionado aún el resultado efectivo del último workflow ni contrastado sus versículos contra los encabezados BSB; por tanto, la compatibilidad de versificación sigue **pendiente de medición**.

**Próxima prueba auditable:** ejecutar una comparación no distributiva de los registros `s1` de BSB (EXO, JDG, LUK, ACT) contra `dist/data/rvr1909/{exodo,jueces,lucas,hechos}.json` generados por el workflow. Validar existencia de capítulo/versículo, orden, encabezados duplicados, diferencias de versificación y porcentajes de aceptación; publicar solo métricas y referencias, no títulos BSB. Mantener pendiente la licencia específica de `base/headings.jsonl`.

La afirmación anterior de que no se encontró el directorio fue correcta respecto del **repositorio fuente**, pero insuficiente como diagnóstico del **producto desplegado**.


## Resultado ejecutado — auditoría piloto de referencias (2026-11-01)

**GitHub Actions:** https://github.com/ivanndlezz/kol-basilea-lectura/actions/runs/41353465424 (conclusión: `success`; trabajo `compare`, ID 124988429114). Se verificaron los registros del trabajo y el artefacto `history-heading-compatibility` está disponible (no expirado).

| Libro | Referencias `s1` válidas | Duplicados | Fuera de orden |
|---|---:|---:|---:|
| Éxodo | 123/123 | 0 | 0 |
| Jueces | 52/52 | 0 | 0 |
| Lucas | 154/154 | 0 | 0 |
| Hechos | 110/110 | 0 | 0 |
| **Total** | **439/439** | **0** | **0** |

**Alcance:** validación automatizada de existencia y orden de referencias iniciales `c:before_v` frente a los JSON RV1909 generados desde eBible.org. **No** valida equivalencia de títulos, final de perícopas, interpretación editorial ni permiso de reproducción de BSB. El script de auditoría y el workflow están en `scripts/audit-history-headings.mjs` y `.github/workflows/audit-history-headings.yml`. La revisión de licencia continúa abierta; el paso 5 debe consumir solo coordenadas verificadas y títulos originales propios, sin redistribuir texto BSB hasta autorización.
