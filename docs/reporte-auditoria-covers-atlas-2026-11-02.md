# Reporte de auditoría — Portadas del Atlas Bíblico

**Proyecto:** Kol Basilea Lectura  
**Repositorio:** [ivanndlezz/kol-basilea-lectura](https://github.com/ivanndlezz/kol-basilea-lectura)  
**Fecha:** 2 de noviembre de 2026  
**Estado:** **Corrección parcial; trabajo pendiente.**  
**Alcance:** Portadas de los relatos históricos del Atlas Bíblico, especialmente Génesis.

## 1. Resumen ejecutivo

El usuario reportó repetidamente una **regresión visual**: las imágenes previamente trabajadas fueron reemplazadas u ocultadas, y en su lugar aparecieron ilustraciones abstractas genéricas. Se realizaron cambios sucesivos sin comprobar visualmente el resultado desplegado en Safari. Esto generó pérdida de continuidad en el trabajo y una experiencia frustrante.

La revisión del repositorio encontró que el código de las tarjetas renderiza una ilustración SVG editorial como respaldo y solo muestra el elemento `<img>` cuando `cover.match` pertenece a `exact`, `related` o `period-context`. Por tanto, marcar imágenes como `unverified` las oculta, incluso cuando el archivo existe.

Se recuperaron asociaciones de portadas válidas y se añadieron medidas contra regresiones, pero **no se ha completado la cobertura visual ni se ha confirmado el resultado final en Safari**.

## 2. Estado cuantitativo al cierre de la revisión

| Indicador | Resultado |
| --- | ---: |
| Relatos en `dist/data/history/timeline.json` | 151 |
| Portadas aprobadas en el JSON | 10 |
| Portadas aprobadas con archivos locales WebP | 8 |
| Portadas aprobadas mediante referencias externas | 2 |
| Relatos sin portada aprobada (usan respaldo editorial) | 141 |
| Portadas todavía marcadas `unverified` | 1 |
| Referencias locales aprobadas sin archivo correspondiente en el repositorio | 0 |
| Rutas de imagen aprobadas duplicadas | 0 |

**Importante:** estas cifras proceden de inspección del repositorio y no constituyen una prueba visual del sitio publicado. La clasificación `approved` indica el estado editorial registrado, no una certificación independiente de exactitud iconográfica.

## 3. Problemas identificados

1. **Regresión por filtrado:** la exclusión de portadas no verificadas dejó visibles únicamente los respaldos SVG, ocultando parte del trabajo anterior.
2. **Respaldos genéricos:** el componente `editorialArt(story)` genera ilustraciones de paisajes y formas abstractas que no representan necesariamente el contenido de cada relato.
3. **Asignaciones históricamente incorrectas:** se detectaron archivos reutilizados para historias distintas, por ejemplo un retrato asociado a relatos de José y una Natividad utilizada para otros personajes o acontecimientos.
4. **Inconsistencia entre tarjeta y detalle:** la página de detalle consultaba `cover.src` sin aplicar originalmente la misma validación editorial que la tarjeta.
5. **Actualización y caché:** el sitio dispone de service worker y archivos versionados; se reforzó la invalidación de versiones para reducir la persistencia de código anterior. Esto no demuestra por sí solo que la caché haya sido la causa de la captura.

## 4. Cambios aplicados

- **Restauración de seis portadas de Génesis:** `creacion.webp`, `caida.webp`, `cain-y-abel.webp`, `primeras-ciudades.webp`, `diluvio.webp` y `babel.webp`.
- **Recuperación de imágenes adicionales:** se habilitaron las asociaciones de Jericó y del nacimiento en Belén, y dos obras vinculadas con Abram, con metadatos editoriales añadidos.
- **Validación centralizada:** se incorporó `isApprovedStoryCover(story)` para que la tarjeta y el detalle utilicen el mismo criterio de aprobación.
- **Carga prioritaria:** las seis imágenes iniciales de Génesis se solicitan con `loading="eager"` en lugar de `lazy`.
- **Actualización de recursos:** se modificaron las versiones de los recursos del Atlas y se incrementó la versión de la caché offline a `kol-basilea-lectura-data-v8`, incluyendo ocho WebP aprobados en el precache.
- **Prevención de regresiones:** se añadieron reglas de protección en `scripts/ensure-atlas-covers.py` y pruebas en `tests/history-covers.test.mjs`; el script de comprobación del proyecto incorpora la auditoría.

### Commits relevantes

- [Restauración de seis portadas de Génesis](https://github.com/ivanndlezz/kol-basilea-lectura/commit/2fb2fce622b982b3da93e48ba0ec132a6cdaebd0)
- [Recuperación de Jericó y Belén](https://github.com/ivanndlezz/kol-basilea-lectura/commit/57f30b4933bc1b6a3cf1b6b35a590e23feccf202)
- [Validación común para tarjetas](https://github.com/ivanndlezz/kol-basilea-lectura/commit/16b7b9d6211d802a9fbaafb6db38fd092c6917c6)
- [Validación en vista de detalle](https://github.com/ivanndlezz/kol-basilea-lectura/commit/6df0e2c97945fc06b96f6e3c3351118551c6fe44)
- [Metadatos de dos obras sobre Abram](https://github.com/ivanndlezz/kol-basilea-lectura/commit/41fba9f62a8a48dc2c0aa4a0a4732d11ce5bf630)
- [Invalidación de archivos del Atlas](https://github.com/ivanndlezz/kol-basilea-lectura/commit/82751a92c04717ac08e91ba004305a7ebcba3109)
- [Actualización de URL del catálogo](https://github.com/ivanndlezz/kol-basilea-lectura/commit/825158a4615abcb9a43f44db4a830c5eb9953c1d)
- [Protección contra regresiones](https://github.com/ivanndlezz/kol-basilea-lectura/commit/763828f64762993ff90226130995f5217ef27235)
- [Pruebas de portadas](https://github.com/ivanndlezz/kol-basilea-lectura/commit/17f191420d14959e891ace5d729a67f99511b8a5)
- [Carga prioritaria de Génesis](https://github.com/ivanndlezz/kol-basilea-lectura/commit/f4943ebf3ead8ad1a4bce4854cef41307fbac40e)
- [Actualización final del módulo](https://github.com/ivanndlezz/kol-basilea-lectura/commit/4c84c1fdbfa19364e244315fc89137df829b47fc)
- [Caché offline v8](https://github.com/ivanndlezz/kol-basilea-lectura/commit/cc513a36c7b062aefabad8390b4ca637ffec19e0)

## 5. Archivos implicados

| Archivo | Función |
| --- | --- |
| `dist/data/history/timeline.json` | Relatos, rutas y estados de aprobación de las portadas |
| `dist/history-sheet-ui.js` | Render de tarjetas y respaldo editorial |
| `dist/history.js` | Render de eras, tarjetas y detalles |
| `dist/history.css` | Capas visuales de imágenes y respaldos |
| `dist/history-data.js` | Obtención del JSON de cronología |
| `dist/history/index.html` | Referencias versionadas a CSS y JS |
| `dist/sw.js` | Caché offline y precarga |
| `scripts/ensure-atlas-covers.py` | Auditoría de asignaciones |
| `tests/history-covers.test.mjs` | Pruebas de regresión |

## 6. Trabajo pendiente — prioridad

1. **Verificación visual real:** abrir la versión desplegada en Safari móvil y comprobar que Génesis muestra sus seis portadas originales, sin flashes prolongados de respaldo ni errores de carga. Verificar también la vista de detalle.
2. **Ejecutar pruebas y confirmar despliegue:** validar `npm run check` y el estado de publicación de GitHub Pages; las pruebas fueron agregadas al repositorio, pero en esta revisión no se ejecutaron en un navegador real.
3. **Auditar la pertinencia de las diez portadas aprobadas:** confirmar tema representado, autoría, licencia, atribución y correspondencia con el relato; corregir cualquier metadato impreciso.
4. **Completar los 141 relatos restantes:** obtener o producir una imagen pertinente y distinta para cada historia. No reutilizar una obra por coincidencia superficial de palabras o personajes.
5. **Mantener una cola editorial:** registrar por relato `id`, fuente, licencia, archivo, estado de revisión y evidencia de correspondencia antes de publicarlo.
6. **Evitar nuevos cambios destructivos:** no retirar portadas ya aprobadas salvo evidencia documentada de error; sustituirlas por alternativas validadas, no por un vacío.

## 7. Criterio de aceptación

La incidencia solo podrá considerarse **resuelta** cuando:

- Las portadas existentes y correctas sigan visibles.
- No se muestren imágenes semánticamente incorrectas ni duplicados arbitrarios.
- Cada relato publicado tenga una portada propia y pertinente, o se identifique explícitamente como pendiente sin presentarlo como terminado.
- El resultado haya sido comprobado en Safari móvil y en la versión efectivamente desplegada.
- Las pruebas automatizadas y la auditoría editorial pasen sin errores.

**Conclusión:** se corrigieron asociaciones y mecanismos de render/caché, pero el objetivo de portadas completas, pertinentes y visualmente verificadas **sigue abierto**. Este reporte no debe utilizarse como declaración de cierre del problema.
