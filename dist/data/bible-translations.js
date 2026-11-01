/** Open Spanish Bible translations bundled by the build pipeline. */
export const BIBLE_TRANSLATIONS = Object.freeze({
  rvr1909: Object.freeze({
    id: "rvr1909",
    name: "Reina-Valera 1909",
    shortName: "RVR09",
    language: "Español",
    license: "Dominio público",
    publisher: "Reina y Valera",
    sourceName: "eBible.org",
    sourceUrl: "https://ebible.org/spaRV1909/copyright.htm",
    dataDir: "rvr1909"
  }),
  pdt: Object.freeze({
    id: "pdt",
    name: "Palabra de Dios para ti",
    shortName: "PDT",
    language: "Español",
    license: "Creative Commons Atribución 4.0",
    publisher: "Asociación Bíblica Latinoamericana",
    sourceName: "eBible.org",
    sourceUrl: "https://ebible.org/spapddpt/copyright.htm",
    dataDir: "pdt"
  }),
  onbv: Object.freeze({
    id: "onbv",
    name: "Biblica Open Nueva Biblia Viva",
    shortName: "ONBV",
    language: "Español",
    license: "Creative Commons Atribución-CompartirIgual 4.0",
    publisher: "Biblica, Inc.",
    sourceName: "eBible.org",
    sourceUrl: "https://ebible.org/spaonbv/copyright.htm",
    dataDir: "onbv"
  }),
  bes: Object.freeze({
    id: "bes",
    name: "Biblia en Español Sencillo",
    shortName: "BES",
    language: "Español",
    license: "Dominio público",
    publisher: "AudioBiblia.org / Irma Flores",
    sourceName: "eBible.org",
    sourceUrl: "https://ebible.org/spabes/copyright.htm",
    dataDir: "bes"
  })
});

export const DEFAULT_TRANSLATION_ID = "rvr1909";
export const getBibleTranslation = (id = DEFAULT_TRANSLATION_ID) => BIBLE_TRANSLATIONS[id] || BIBLE_TRANSLATIONS[DEFAULT_TRANSLATION_ID];
export const getBibleTranslations = () => Object.values(BIBLE_TRANSLATIONS);
export const isBibleTranslationId = id => Boolean(id && BIBLE_TRANSLATIONS[id]);
