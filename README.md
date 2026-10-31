# Kol Basilea — Lectura

Miniapp/PWA móvil para acompañar una ruta progresiva de lectura bíblica.

Este repositorio pertenece al universo conceptual de **Kol Basilea**, pero mantiene un ciclo de producto independiente. Su objetivo es ayudar a lectores nuevos o sin hábito estable a comenzar, comprender y completar la lectura de la Biblia mediante una ruta editorial de 66 libros.

## Estado actual

Prototipo UI mobile-first en construcción, ejecutable localmente sin registro ni backend.

La propuesta ya cuenta con:

- ruta editorial completa de 66 libros;
- 1,189 capítulos validados;
- seis inserciones estratégicas en el orden de lectura;
- onboarding hasta completar 3 Juan;
- progreso por capítulos y libros;
- metas opcionales de 365 días, 180 días o sin fecha;
- persistencia local inicial sin registro;
- análisis comparativo de seis referencias de UI y gamificación.

La primera vertical funcional incluye onboarding de tres pasos, lector de 3 Juan, guardado local del check de capítulo, ruta completa, progreso y preferencias de meta.

## Preview local

Con Python instalado, ejecuta desde la raíz del repositorio:

```bash
python3 -m http.server 4173 --directory dist
```

Después abre [http://127.0.0.1:4173/](http://127.0.0.1:4173/).

La UI aplica criterios relevantes de Apple HIG: tipografía del sistema, áreas seguras para dispositivos con notch, controles táctiles amplios, estados de foco visibles, navegación inferior móvil, jerarquía clara y respeto por `prefers-reduced-motion`.

## Documentación

- [Especificación de producto](docs/especificacion-producto.md)
- [Especificación UI](docs/especificacion-ui.md)
- [Análisis de referencias UI](docs/analisis-referencias-ui.md)

## Relación con Kol Basilea

`kol-basilea-lectura` comparte el universo conceptual, el enfoque histórico-editorial y los principios de marca de Kol Basilea. No comparte código por defecto: cualquier componente, contenido o sistema visual reutilizable se extraerá únicamente cuando exista una necesidad comprobada.

## Principios de diseño

- una acción principal por pantalla;
- progreso visible por capítulos y libros;
- finalización clara de cada unidad;
- pausas sin castigo;
- contexto antes de la lectura;
- gamificación subordinada al significado;
- experiencia móvil, cálida y no denominacional;
- sin registro obligatorio para comenzar.

## Próximo paso

Convertir este prototipo en una especificación concreta de pantallas, estados, navegación y componentes para el MVP, y sustituir los contenidos de demostración por fuentes bíblicas y videos con licencia definida.

