const RVR1909_SOURCE = "https://ebible.org/spaRV1909/3JN01.htm";

export const BIBLE_TRANSLATIONS = {
  rvr1909: {
    id: "rvr1909",
    name: "Reina-Valera 1909",
    shortName: "RVR09",
    language: "Español",
    license: "Dominio público",
    publisher: "Reina y Valera",
    sourceName: "eBible.org",
    sourceUrl: "https://ebible.org/spaRV1909/copyright.htm"
  }
};

const CHAPTERS = {
  "rvr1909/3-juan/1": {
    bookId: "3-juan",
    chapter: 1,
    sourceUrl: RVR1909_SOURCE,
    verses: [
      [1, "EL anciano al muy amado Gaio, al cual yo amo en verdad."],
      [2, "Amado, yo deseo que tú seas prosperado en todas cosas, y que tengas salud, así como tu alma está en prosperidad."],
      [3, "Ciertamente me gocé mucho cuando vinieron los hermanos y dieron testimonio de tu verdad, así como tú andas en la verdad."],
      [4, "No tengo yo mayor gozo que éste, el oir que mis hijos andan en la verdad."],
      [5, "Amado, fielmente haces todo lo que haces para con los hermanos, y con los extranjeros,"],
      [6, "Los cuales han dado testimonio de tu amor en presencia de la iglesia: á los cuales si ayudares como conviene según Dios, harás bien."],
      [7, "Porque ellos partieron por amor de su nombre, no tomando nada de los Gentiles."],
      [8, "Nosotros, pues, debemos recibir á los tales, para que seamos cooperadores á la verdad."],
      [9, "Yo he escrito á la iglesia: mas Diótrefes, que ama tener el primado entre ellos, no nos recibe."],
      [10, "Por esta causa, si yo viniere, recordaré las obras que hace parlando con palabras maliciosas contra nosotros; y no contento con estas cosas, no recibe á los hermanos, y prohibe á los que los quieren recibir, y los echa de la iglesia."],
      [11, "Amado, no sigas lo que es malo, sino lo que es bueno. El que hace bien es de Dios: mas el que hace mal, no ha visto á Dios."],
      [12, "Todos dan testimonio de Demetrio, y aun la misma verdad: y también nosotros damos testimonio; y vosotros habéis conocido que nuestro testimonio es verdadero."],
      [13, "Yo tenía muchas cosas que escribirte; empero no quiero escribirte por tinta y pluma:"],
      [14, "Porque espero verte en breve, y hablaremos boca á boca. Paz sea contigo. Los amigos te saludan. Saluda tú á los amigos por nombre."]
    ].map(([number, text]) => ({ number, text }))
  }
};

export function getBibleTranslation(id = "rvr1909") {
  return BIBLE_TRANSLATIONS[id] || BIBLE_TRANSLATIONS.rvr1909;
}

export function getBibleChapter(bookId, chapter, translationId = "rvr1909") {
  return CHAPTERS[`${translationId}/${bookId}/${chapter}`] || null;
}
