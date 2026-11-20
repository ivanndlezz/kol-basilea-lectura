# Atlas bíblico de Kol Basilea — Documento de continuidad

**Estado:** propuesta documentada; sin implementación.  
**Fecha:** 19 de noviembre de 2026.  
**Repositorio:** `ivanndlezz/kol-basilea-lectura`.  
**Objetivo:** sustituir el directorio de enlaces de «Mapas bíblicos» por un atlas geográfico histórico, interactivo, accesible y móvil, conectado con la lectura de las Escrituras.

## 1. Contexto y diagnóstico

En la revisión del repositorio se identificó:

- `dist/app.js`: el menú «Atlas bíblico» contiene «Mapas bíblicos» (`data-view="maps"`). La función `renderMaps()` presenta un directorio de recursos externos (Scriptoria, Wikimedia Commons y Atalayas21), **no** un mapa geográfico integrado.
- `dist/history/world/index.html`: página «Pueblos, identidades y lenguas», con diagramas de nodos, pestañas y fichas. Son esquemas de relaciones históricas/lingüísticas, **no cartografía basada en coordenadas**.
- `dist/data/history/world-glossary.json`: tres diagramas conceptuales: descendencia tradicional de Sem, pueblos y lugares de Mesopotamia, familias lingüísticas semíticas. Deben conservarse como material contextual, sin confundirlos con mapas geográficos.

**Decisión de producto:** no reproducir el atlas esquemático anterior como si fuera cartografía. Mantener diferenciados el atlas geográfico, las genealogías, los pueblos y las familias lingüísticas. La navegación existente requiere revisión antes de implementar cambios.

## 2. Fuentes de referencia

1. **Biblia para la Vida:** https://bibliaparalavida.com/mapas-biblicos/  
   Utilidad: catálogo introductorio de mapas esenciales (mundo antiguo, Éxodo, tribus, reinos, imperios, Jerusalén, viajes de Pablo). Referencia para taxonomía y alcance inicial.
2. **iBible Maps:** https://ibiblemaps.com/map-index/  
   Utilidad: organización de mapas por relatos, personajes, viajes, episodios y pasajes. Referencia para experiencias narrativas por etapas.

**Restricción legal:** usar ambas páginas como fuentes de investigación y referencias de organización/UX. No copiar imágenes, textos editoriales, archivos cartográficos ni datasets protegidos sin autorización o licencia compatible. Verificar derechos y atribuciones de cada recurso. Contrastar localizaciones y rutas con bibliografía independiente.

## 3. Visión del producto

El lector debe poder pasar de un pasaje a su contexto geográfico y volver al mismo punto de lectura. El atlas debe ofrecer:

- **Territorios:** regiones, ciudades, ríos, relieve y fronteras por época.
- **Rutas:** itinerarios por etapas, con fuentes y nivel de certeza.
- **Acontecimientos:** lugares vinculados a eventos y pasajes concretos.
- **Ciudades históricas:** fichas con nombres antiguos/modernos, cronología y bibliografía.
- **Capas temporales:** evitar mostrar simultáneamente límites políticos de épocas incompatibles.

La experiencia será **mobile-first**, con zoom, desplazamiento táctil, controles accesibles, panel de fichas, regreso a lectura y diseño visual cuidado.

## 4. Alcance inicial propuesto

Catálogo editorial de seis conjuntos, sujeto a investigación y validación:

1. Abraham y sus desplazamientos.
2. Éxodo y rutas propuestas (sin presentar una hipótesis como certeza).
3. Distribución tradicional de las doce tribus.
4. Israel y Judá durante la monarquía dividida.
5. Mundo de Jesús y lugares de sus narraciones.
6. Viajes misioneros de Pablo y traslado a Roma.

**MVP recomendado:** primer viaje misionero de Pablo, vinculado a Hechos 13–14. Probar primero un mapa completo antes de multiplicar pantallas y datasets.

## 5. Arquitectura técnica propuesta (no aprobada aún)

- Motor cartográfico candidato: **MapLibre GL JS**; evaluar compatibilidad, peso, rendimiento móvil, accesibilidad y proveedor/licencia de mapas base.
- Datos geográficos propios: **GeoJSON** para puntos, líneas y polígonos.
- Datos editoriales: **JSON** con referencias bíblicas, etapas, períodos, nombres, descripciones, fuentes y certeza.
- Separar presentación, cartografía y contenido. No codificar rutas directamente en componentes UI.
- Proveer alternativa de lista para quienes no puedan usar el mapa.
- Evaluar carga diferida y disponibilidad offline antes de comprometer una solución.

Ejemplo **ilustrativo de esquema** (sin coordenadas históricas verificadas):

```json
{
  "id": "primer-viaje-pablo",
  "title": "Primer viaje misionero de Pablo",
  "period": "siglo I d. C.",
  "references": ["Hechos 13", "Hechos 14"],
  "stops": [
    {
      "placeId": "antioquia-siria",
      "references": ["Hechos 13:1-3"],
      "certainty": "high",
      "sources": []
    }
  ]
}
```

Campos de certeza sugeridos: `high`, `medium`, `disputed`, `unknown`, con explicación editorial; **no equivalen a validación arqueológica automática**.

## 6. Integración con Kol Basilea Lectura

- Desde el capítulo: acción contextual «Ver en el mapa».
- Desde el mapa: seleccionar etapa/lugar → ficha → «Leer pasaje».
- Mantener posición y progreso de lectura al regresar.
- Respetar arquitectura actual de navegación, historial, tema claro/oscuro y diseño responsive.
- Revisar el menú «Atlas bíblico» para evitar duplicar la sección «Pueblos, identidades y lenguas».

## 7. Criterios editoriales y de calidad

- Diferenciar **texto bíblico**, **identificación geográfica respaldada**, **reconstrucción histórica** e **hipótesis debatida**.
- Documentar fuente, fecha, licencia y confianza de cada localización, límite o ruta.
- No presentar fronteras modernas como fronteras antiguas.
- No convertir genealogías bíblicas en clasificaciones étnicas o lingüísticas modernas.
- Validar topónimos, transliteraciones y cronologías antes de publicar.
- Probar gestos móviles, teclado, lectores de pantalla, contraste, rendimiento y retorno al lector.

## 8. Plan de trabajo para retomar

**Fase 0 — Auditoría:** inspeccionar versión actual de `dist/app.js`, navegación, assets y estructura de despliegue; confirmar si se mantiene el directorio de enlaces.

**Fase 1 — Investigación:** preparar dataset verificable del primer viaje de Pablo (lugares, coordenadas, secuencia, versículos, fuentes, incertidumbres y licencias).

**Fase 2 — Prototipo:** crear pantalla mobile-first con mapa real, ruta, etapas y ficha; comparar rendimiento en móvil/tablet/escritorio.

**Fase 3 — Integración:** conectar atlas con Hechos 13–14, preservando estado de lectura y navegación.

**Fase 4 — Validación:** revisión histórica, pruebas de accesibilidad, dispositivos y experiencia visual.

**Fase 5 — Escalamiento:** reutilizar motor y esquema de datos para el resto del catálogo.

## 9. Decisiones pendientes

- Confirmar proveedor de mapa base y condiciones de uso.
- Definir dónde residirá el módulo en la navegación.
- Decidir si las capas temporales forman parte del MVP o de una versión posterior.
- Establecer formato de bibliografía y validación editorial.
- Definir estrategia de caché/offline y presupuesto de rendimiento.

## 10. Punto de reanudación

> «Retomemos el Atlas bíblico de Kol Basilea desde `docs/ATLAS_BIBLICO_PLAN.md`. Revisa el estado actual del repositorio y desarrolla un prototipo del primer viaje de Pablo conectado con Hechos 13–14. No reutilices mapas de terceros sin licencia ni confundas diagramas de pueblos con cartografía».

**Nota:** este archivo registra decisiones y propuestas. No implica que el atlas, los datos o el prototipo ya estén desarrollados.
