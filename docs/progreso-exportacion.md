# Exportación de progreso

## Estado local actual

La PWA conserva su estado en `localStorage` bajo la clave
`kol-basilea-lectura-v1`. El valor incluye progreso de lectura, preferencias y
estado de interfaz. La aplicación no usa esa clave como cuenta ni como
credencial.

Desde la versión de exportación, cada estado también conserva `progressId`, un
UUID generado localmente. El identificador permite reconocer el mismo progreso
cuando el usuario lo importa en otra aplicación, pero no concede acceso a
ninguna cuenta.

## Contrato de exportación v1

El archivo descargado es JSON y tiene la siguiente forma:

```json
{
  "schemaVersion": 1,
  "appId": "kol-basilea-lectura",
  "progressId": "uuid",
  "exportedAt": "2026-11-05T00:00:00.000Z",
  "sourceOrigin": "https://ivanndlezz.github.io",
  "payload": {
    "completedChapters": {},
    "goal": "none",
    "readerTranslation": "rvr1909",
    "resume": {
      "bookId": "3-juan",
      "chapter": 1
    },
    "preferences": {
      "readerFont": "serif",
      "readerTheme": "light"
    }
  }
}
```

La exportación aplica una lista blanca. No incluye menús abiertos, animaciones,
toasts, estado de navegación ni hitos temporales. Los capítulos se validan
contra el catálogo y se eliminan duplicados o valores fuera de rango.

## Importación local v1

En Configuración → Transferir progreso, el usuario selecciona un archivo JSON
exportado previamente. La aplicación comprueba que el archivo pertenece a esta
app, que usa el esquema v1, que contiene un UUID válido y que los capítulos
existen en el catálogo actual. También limita el archivo a 512 KiB y no ejecuta
ningún contenido del JSON.

Antes de guardar, se muestra una confirmación con el número de capítulos nuevos.
La fusión es no destructiva: los capítulos locales y los importados se combinan
como una unión, y repetir el mismo archivo no crea duplicados ni cambia el
resultado. Las preferencias, meta, traducción y posición de lectura del archivo
se aplican después de la confirmación. Si el dispositivo todavía no tiene
progreso, conserva el `progressId` del archivo importado; si ya tiene progreso,
conserva su propio identificador local.

El flujo sigue siendo manual y entre orígenes: una aplicación hospedada en
`kol-basilea.mynl.ink` no puede leer directamente el `localStorage` de GitHub
Pages. Esta importación es el puente temporal antes de cuentas y sincronización.
