# Reporte de auditoría · covers del Atlas, Eras y línea del tiempo

**Fecha:** 2026-11-02  
**Proyecto:** `kol-basilea-lectura`  
**Alcance:** imágenes del Atlas, portadas de relatos, catálogo de eras, suberas, acontecimientos y escala temporal.

## Veredicto

**La cobertura visual quedó resuelta, pero el proyecto aún no está completamente consistente.** Los 151 relatos tienen imagen asignada y las URLs remotas fueron verificadas; permanecen pendientes los hallazgos estructurales de Eras, acontecimientos y escala temporal descritos abajo.

## Hallazgos críticos

### 1. Cobertura de imágenes — resuelto en esta pasada

`dist/data/history/timeline.json` contiene **151 relatos** y ahora los **151 tienen `cover.src` aprobado**. Hay **8 imágenes locales** y **143 URLs remotas**; las 143 remotas conservan `verification.status: 200` y `verification.ok: true`.

| Era | Relatos | Con portada aprobada | En reserva |
|---|---:|---:|---:|
| Historia primigenia | 6 | 6 | 0 |
| Patriarcas | 15 | 15 | 0 |
| Éxodo y jueces | 40 | 40 | 0 |
| Monarquía | 30 | 30 | 0 |
| Exilio y restauración | 16 | 16 | 0 |
| Segundo Templo tardío | 1 | 1 | 0 |
| Jesús y los apóstoles | 43 | 43 | 0 |

La auditoría de `scripts/ensure-atlas-covers.py` devuelve:

```text
total: 151 · approved: 151 · editorial_fallback: 0 · unverified: 0
```

El asignador quedó disponible en `scripts/assign-history-cover-urls.mjs`; busca en fuentes abiertas, descarta licencias no reutilizables, comprueba que la respuesta sea una imagen y solo escribe candidatos con HTTP 200. El detalle de cada pasada está en `reports/history-cover-url-assignment.json`.

Además, hay **8 archivos de imagen históricos huérfanos** que ya no son referenciados por el catálogo: tres escenas de José, nacimiento de Isaac y cuatro relatos antiguos. Esto deja activos restos de una tanda anterior y aumenta el riesgo de volver a conectar arte rechazado.

### 2. Los acontecimientos de las primeras siete eras no se muestran — P1

En `dist/history.js`, cuando una era tiene relatos (`stories.length`), se renderiza únicamente la colección de relatos y no se llama a `renderEraOverview`, que es la función que pinta los acontecimientos.

Resultado: **29 acontecimientos** de las primeras siete eras existen en los datos, pero no tienen tarjetas visibles en la interfaz. Solo las eras sin relatos —Cristianismo antiguo, Cristianismo medieval y Reformas y modernidad— llegan a mostrar sus acontecimientos.

Esto rompe la expectativa de que la sección de Eras y la línea del tiempo representen la misma cronología.

### 3. Referencias rotas entre eras, suberas y acontecimientos — P1

La auditoría de referencias encontró **17 inconsistencias**:

- `eras[].events` contiene títulos como `"Caín y Abel"`, `"Isaac"` o `"Calvino"`, pero no IDs de acontecimientos.
- Tres acontecimientos apuntan a suberas inexistentes:
  - `jacob` → `patriarchs--isaac-jacob`
  - `joseph` → `patriarchs--jose-egipto`
  - `editorial-patriarchs-29` → `patriarchs--isaac-jacob`
- Las suberas declaradas sí usan otros IDs: `patriarchs--isaac`, `patriarchs--jacob` y `patriarchs--jose`.

Cuando esos acontecimientos se rendericen, no caerán dentro de sus periodos correctos; terminarán como elementos sin agrupación o quedarán fuera del filtro.

### 4. La escala visual no representa las fechas declaradas — P1

La línea del tiempo se genera con diez segmentos de igual ancho (`repeat(10, ...)`), aunque el eje muestra `1000 a. C.`, `0`, `1000` y `2000`, y los datos declaran rangos muy distintos:

- Monarquía: aproximadamente 1000–586 a. C.
- Exilio y restauración: aproximadamente 586–400 a. C.
- Segundo Templo tardío: aproximadamente 400–4 a. C.
- Cristianismo antiguo: aproximadamente 100–750 d. C.
- Cristianismo medieval: aproximadamente 750–1500 d. C.

La visual parece una secuencia de diez pasos, no una escala temporal. Presentarla como línea del tiempo induce a leer proporciones cronológicas que no existen.

### 5. Contrato de nombres del Atlas inconsistente — P2

`dist/app.js` y el archivo real usan `eras-y-epocas.PNG`, mientras `dist/assets/images/atlas/README.md` documenta `eras-y-epocas.webp`. Hoy carga en el preview, pero el contrato de assets es inconsistente y puede fallar en procesos que normalicen extensiones o nombres.

## Validación visual

La revisión en preview local confirmó:

- El carrusel de cuatro tarjetas del Atlas carga sus imágenes.
- La tarjeta de Eras muestra arte panorámico recortado dentro del card.
- En las siete eras con relatos ahora aparecen portadas asignadas; el arte de reserva queda como respaldo visual.
- La línea del tiempo muestra diez bloques iguales y las tarjetas de era se desplazan horizontalmente, pero no hay correspondencia proporcional entre bloques y años.

## Validaciones ejecutadas

- `python3 scripts/ensure-atlas-covers.py`
- `node scripts/assign-history-cover-urls.mjs --write`
- Verificación final de los 151 `cover.src`: 8 locales + 143 remotos con HTTP 200.
- `python3 scripts/history-cover-pipeline.py audit`
- Comprobación de referencias cruzadas de `timeline.json` para eras, suberas, acontecimientos y relatos.
- Preview local de `/history/`, `/history/patriarcas/` y del carrusel Atlas del inicio.

Nota: `scripts/history-cover-pipeline.py audit` clasifica las dos URLs remotas de Rijksmuseum como `missing-file` porque intenta comprobarlas como rutas locales. Es un falso positivo del auditor y debe corregirse antes de usarlo como gate de CI.

## Prioridad recomendada

1. Reparar el contrato de datos de eras/suberas/eventos y renderizar acontecimientos junto con relatos.
2. Decidir si la escala será realmente proporcional a fechas o si debe cambiarse a una secuencia editorial explícita.
3. Corregir la auditoría para aceptar URLs remotas y limpiar la cola de assets rechazados.
4. Unificar el nombre/extensión de `eras-y-epocas` en código, README y pipeline.

**Estado del checkout:** se actualizó el catálogo de portadas, el índice de atribuciones, el asignador automático, sus comandos de auditoría y este reporte.
