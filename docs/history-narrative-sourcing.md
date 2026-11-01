# Catálogo narrativo: protocolo de fuentes y segmentación (v0.1)

## Objetivo
Cubrir las diez eras con unidades narrativas verificables, sin confundir relatos bíblicos con episodios historiográficos posteriores al canon. La interfaz del sheet es independiente de este catálogo.

## Estado de la investigación (2026-11-01)
- **Texto base:** RV1909 ya utilizado por Kol Basilea. No reemplazarlo.
- **Candidato para segmentación:** NuBerea/segments, https://huggingface.co/datasets/NuBerea/segments . Declara segmentaciones por perícopa y CC BY 4.0 para tablas principales, pero existen excepciones y especificaciones con acceso condicionado. **No aprobado para importación automática** hasta verificar acceso, columnas, cobertura y términos por configuración.
- **Texto de control alternativo:** midvash/bible-data, https://github.com/midvash/bible-data . Proporciona texto y referencias OSIS; **no se ha verificado que proporcione delimitaciones narrativas**.
- **No importar encabezados de ESV masivamente:** https://www.esv.org/api/ contiene límites de almacenamiento y reproducción.
- **Revisión académica:** contrastar límites propuestos con bibliografía por libro. Los títulos editoriales son interpretaciones, no parte automática del texto inspirado.

## Contrato de datos
Cada unidad debe registrar:
- id estable; bookId; referencia inicial y final normalizadas (capítulo y versículo)
- title y summary originales de Kol Basilea
- kind: narrative | poetry | prophecy | discourse | epistle | genealogy | law | historiography | other
- parentId (macroestructura); eraIds (una o varias)
- source: nombre, URL/cita, versión, licencia, atribución y fecha de consulta
- boundaryEvidence: razón de inicio y fin; confidence: proposed | reviewed | verified
- status: draft | reviewed | published
- relations: paralelos, continuación, intertextualidad (opcionales)

## Flujo reproducible
1. Inventariar libros asignados a cada era y marcar huecos, sin asumir que bookIds es exhaustivo.
2. Verificar acceso y licencia de una fuente de límites por perícopas; documentar cobertura exacta por libro.
3. Importar SOLO referencias y metadatos permitidos a staging, conservando el registro original y su procedencia.
4. Normalizar identificadores de libros y referencias al canon RV1909; validar versículos reales, duplicados, solapamientos y vacíos. Los solapamientos pueden ser legítimos, pero se reportan.
5. Clasificar género y agrupar perícopas en relatos/ciclos. La agrupación no es deducible mecánicamente del encabezado; queda en estado proposed hasta revisión.
6. Asignar eras por contenido y contexto histórico, no solo por fecha de composición. Conservar relaciones muchos-a-muchos.
7. Revisión editorial de límites y atribución. Solo publicar registros reviewed/verified.
8. Exportar JSON para la capa de datos. El sheet renderiza el mismo contrato UI en todas las eras.

## Política de cobertura
- Eras 1–7: relatos bíblicos y, cuando corresponda, contexto histórico. La era 6 requiere fuentes intertestamentarias externas; la era 7 incluye textos narrativos y no narrativos.
- Eras 8–10: relatos historiográficos documentados, nunca etiquetados como relatos bíblicos.
- No convertir automáticamente cada capítulo o cada acontecimiento en un relato.
- Medir por separado cobertura de referencias bíblicas y cobertura histórica; cero relatos no significa cero datos.
- Preservar los 21 relatos existentes y la estructura de Génesis como datos editoriales iniciales, sujetos a verificación de límites.

## Criterios de aceptación para adoptar un dataset
- Acceso real al archivo y especificación completa.
- Delimitaciones por libro/capítulo/versículo, exportables y con identificadores estables.
- Cobertura medida sobre los 66 libros, sin inferir completitud de una descripción.
- Licencia compatible con redistribuir metadatos derivados y atribución realizable.
- Versionado y procedencia reproducibles.
- Comparación piloto: Éxodo, Jueces, Lucas y Hechos; revisión manual de al menos diez límites por libro.

## Próxima ejecución
Auditar NuBerea/segments (configuraciones, acceso, licencia y referencias), documentar los resultados y **solo entonces** escribir el importador. No se ha importado ningún relato nuevo ni modificado la UI con este protocolo.
