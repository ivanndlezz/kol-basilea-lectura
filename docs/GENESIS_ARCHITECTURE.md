# Génesis — arquitectura literaria y navegación

## Objetivo
Distinguir libro, bloques narrativo-históricos, unidades literarias y relatos editoriales, sin alterar el lector ni el progreso guardado.

## Fuente de datos
`dist/data/history/timeline.json` contiene `genesisStructure`: un prólogo, diez fórmulas *toledot* y cinco ciclos narrativos. Las eras `primeval` y `patriarchs` son agrupaciones de exploración; no deben confundirse con las fórmulas literarias.

## Implementación (1 de noviembre de 2026)
- `dist/genesis-structure.js` renderiza las unidades de la era activa, con acordeones, rangos bíblicos, historias relacionadas y enlace al lector.
- `dist/history.js` incorpora el panel sin reemplazar las portadas ni el carrusel existente.
- `dist/history.css` añade controles táctiles y disposición responsive.
- Los ciclos narrativos son una navegación paralela por los relatos ya registrados.
- Los enlaces incluyen libro, capítulo y versículo inicial. El lector debe verificarse por separado para confirmar que respeta el parámetro `verse`.

## Criterios de aceptación
1. Historia primigenia presenta prólogo y cinco *toledot*; Patriarcas presenta las otras cinco.
2. Abrir cada unidad muestra su función literaria y vínculos a relatos relacionados.
3. Los ciclos se seleccionan sin modificar el progreso.
4. El carrusel existente, sus portadas y los enlaces a historias siguen funcionando.
5. Verificar en iPhone: scroll horizontal del carrusel, contraste, controles de 44 px y enlaces.
6. Ejecutar `npm run check` y una revisión visual en navegador antes de dar por concluida la entrega.

## Pendientes
- Precisar las relaciones historia–unidad mediante rangos de versículos estructurados, incluyendo relatos que cruzan unidades.
- Añadir una vista editorial dedicada por unidad literaria (actualmente se expande dentro de la era).
- Comprobar que el lector navegue al versículo, no solo al capítulo.
- Pruebas automatizadas y verificación visual real de ambas eras.
- Resolver si el filtro de ciclos debe abarcar ambas eras en una vista global del libro.
