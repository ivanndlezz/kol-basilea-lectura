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
