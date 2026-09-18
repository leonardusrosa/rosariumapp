import {
  Work,
  Edition,
  LibraryItem,
  ReadingRecord,
  ReadingQueueItem,
  WishlistItem,
  BookNote,
  NavSection
} from "@/types/bibliotheca";

export const NAV_SECTIONS: NavSection[] = [
  { id: "library", latinTitle: "Bibliotheca", subtitle: "Minha biblioteca", href: "/library", iconName: "BookCopy" },
  { id: "reading", latinTitle: "Lectio", subtitle: "Lendo agora", href: "/reading", iconName: "BookOpen" },
  { id: "next", latinTitle: "Proxima", subtitle: "Próximas leituras", href: "/next", iconName: "Bookmark" },
  { id: "read", latinTitle: "Lecta", subtitle: "Histórico de leitura", href: "/read", iconName: "BookCheck" },
  { id: "wishlist", latinTitle: "Desiderata", subtitle: "Lista de desejos", href: "/wishlist", iconName: "Heart" },
  { id: "collections", latinTitle: "Collectiones", subtitle: "Coleções", href: "/collections", iconName: "Layers" },
  { id: "notes", latinTitle: "Notae", subtitle: "Notas", href: "/notes", iconName: "NotebookPen" },
  { id: "ai", latinTitle: "Sapientia", subtitle: "Explorar com IA", href: "/ai", iconName: "Sparkles" }
];

export const SAMPLE_WORKS: Work[] = [
  { id: "w-1", title: "Crime e Castigo", originalTitle: "Преступление и наказание", author: "Fiódor Dostoiévski", originalPublicationYear: 1866 },
  { id: "w-2", title: "Confissões", originalTitle: "Confessiones", author: "Agostinho de Hipona", originalPublicationYear: 397 },
  { id: "w-3", title: "Ilíada", originalTitle: "Ἰλιάς", author: "Homero", originalPublicationYear: -750 },
  { id: "w-4", title: "A Divina Comédia", originalTitle: "Divina Commedia", author: "Dante Alighieri", originalPublicationYear: 1320 },
  { id: "w-5", title: "Hamlet", originalTitle: "The Tragedy of Hamlet", author: "William Shakespeare", originalPublicationYear: 1603 },
  { id: "w-6", title: "A República", originalTitle: "Πολιτεία", author: "Platão", originalPublicationYear: -375 },
  { id: "w-7", title: "Os Irmãos Karamázov", originalTitle: "Братья Карамазовы", author: "Fiódor Dostoiévski", originalPublicationYear: 1880 },
  { id: "w-8", title: "Odisseia", originalTitle: "Ὀδύσσεια", author: "Homero", originalPublicationYear: -720 },
  { id: "w-9", title: "Meditações", originalTitle: "Τὰ εἰς ἑαυτόν", author: "Marco Aurélio", originalPublicationYear: 180 },
  { id: "w-10", title: "Dom Quixote", originalTitle: "Don Quijote de la Mancha", author: "Miguel de Cervantes", originalPublicationYear: 1605 },
  { id: "w-11", title: "Eneida", originalTitle: "Aeneis", author: "Virgílio", originalPublicationYear: -19 },
  { id: "w-12", title: "O Processo", originalTitle: "Der Process", author: "Franz Kafka", originalPublicationYear: 1925 },
  // Unowned read work (proves Reading History is independent of ownership)
  { id: "w-13", title: "O Príncipe", originalTitle: "Il Principe", author: "Nicolau Maquiavel", originalPublicationYear: 1532 },
  // Wishlist works (unowned)
  { id: "w-14", title: "Guerra e Paz", originalTitle: "Война и мир", author: "Lev Tolstói", originalPublicationYear: 1869 },
  { id: "w-15", title: "Fausto", originalTitle: "Faust", author: "Johann Wolfgang von Goethe", originalPublicationYear: 1808 },
  { id: "w-16", title: "A Montanha Mágica", originalTitle: "Der Zauberberg", author: "Thomas Mann", originalPublicationYear: 1924 }
];

export const SAMPLE_EDITIONS: Edition[] = [
  { id: "ed-1", workId: "w-1", isbn: "978-8573266467", publisher: "Editora 34", publicationYear: 2016, translator: "Paulo Bezerra", pages: 592, format: "Capa comum", cover: { type: "generated", style: "banded", primaryColor: "#1a2332", accentColor: "#d4a373", textColor: "#f7f2ea", layoutVariant: "split", geometryShape: "rectangles", subtitle: "Tradução direta do russo" } },
  { id: "ed-2", workId: "w-2", isbn: "978-8532604637", publisher: "Vozes de Bolso", publicationYear: 2019, pages: 448, format: "Capa dura", cover: { type: "generated", style: "minimal", primaryColor: "#1f221e", accentColor: "#c9a96e", textColor: "#eae5d8", layoutVariant: "top-heavy", geometryShape: "circle" } },
  { id: "ed-3", workId: "w-3", isbn: "978-8535907407", publisher: "Companhia das Letras", publicationYear: 2005, translator: "Haroldo de Campos", pages: 720, format: "Capa comum", cover: { type: "generated", style: "typographic", primaryColor: "#2b1b17", accentColor: "#e6ba7e", textColor: "#f8f5ee", layoutVariant: "center", geometryShape: "rule-lines" } },
  { id: "ed-4", workId: "w-4", isbn: "978-8573261165", publisher: "Editora 34", publicationYear: 2011, translator: "Italo Eugenio Mauro", pages: 864, format: "Edição bilíngue", cover: { type: "generated", style: "geometric", primaryColor: "#192024", accentColor: "#b89758", textColor: "#f4ede2", layoutVariant: "center", geometryShape: "arch" } },
  { id: "ed-5", workId: "w-5", isbn: "978-8525410184", publisher: "L&PM Pocket", publicationYear: 2001, translator: "Millôr Fernandes", pages: 160, format: "Bolso", cover: { type: "generated", style: "modernist", primaryColor: "#14171a", accentColor: "#d9ab55", textColor: "#e8e5dc", layoutVariant: "bottom-heavy", geometryShape: "rectangles" } },
  { id: "ed-6", workId: "w-6", isbn: "978-8544001639", publisher: "Martin Claret", publicationYear: 2017, pages: 368, format: "Capa dura", cover: { type: "generated", style: "minimal", primaryColor: "#212529", accentColor: "#c29d59", textColor: "#f0ebe1", layoutVariant: "top-heavy", geometryShape: "circle" } },
  { id: "ed-7", workId: "w-7", isbn: "978-8573264098", publisher: "Editora 34", publicationYear: 2008, translator: "Paulo Bezerra", pages: 1040, format: "Capa comum", cover: { type: "generated", style: "banded", primaryColor: "#281b24", accentColor: "#d49a6a", textColor: "#f9f4ec", layoutVariant: "split", geometryShape: "rectangles" } },
  { id: "ed-8", workId: "w-8", isbn: "978-8535924718", publisher: "Companhia das Letras", publicationYear: 2014, translator: "Christian Werner", pages: 608, format: "Capa comum", cover: { type: "generated", style: "geometric", primaryColor: "#15222e", accentColor: "#dfb15b", textColor: "#f5eee4", layoutVariant: "center", geometryShape: "circle" } },
  { id: "ed-9", workId: "w-9", isbn: "978-8592886745", publisher: "Edipro", publicationYear: 2019, translator: "Edson Bini", pages: 224, format: "Capa dura", cover: { type: "generated", style: "typographic", primaryColor: "#2a221b", accentColor: "#cbb17b", textColor: "#f3ede3", layoutVariant: "center", geometryShape: "rule-lines" } },
  { id: "ed-10", workId: "w-10", isbn: "978-8535921854", publisher: "Penguin-Companhia", publicationYear: 2012, translator: "Sérgio Molina", pages: 1328, format: "Capa comum", cover: { type: "generated", style: "modernist", primaryColor: "#1c2120", accentColor: "#cda35f", textColor: "#ebe6db", layoutVariant: "bottom-heavy", geometryShape: "arch" } },
  { id: "ed-11", workId: "w-11", isbn: "978-8532529732", publisher: "Rocco", publicationYear: 2014, translator: "Carlos Alberto Nunes", pages: 416, format: "Capa comum", cover: { type: "generated", style: "minimal", primaryColor: "#231f28", accentColor: "#d8b26e", textColor: "#f4eee6", layoutVariant: "top-heavy", geometryShape: "circle" } },
  { id: "ed-12", workId: "w-12", isbn: "978-8535906806", publisher: "Companhia das Letras", publicationYear: 2005, translator: "Modesto Carone", pages: 320, format: "Capa comum", cover: { type: "generated", style: "geometric", primaryColor: "#18181a", accentColor: "#c4a053", textColor: "#e7e2d6", layoutVariant: "center", geometryShape: "cross-hatch" } },
  // Editions for unowned works
  { id: "ed-13", workId: "w-13", isbn: "978-8535916324", publisher: "Companhia das Letras", publicationYear: 2010, translator: "Maurício Santana Dias", pages: 248, format: "Capa comum", cover: { type: "generated", style: "banded", primaryColor: "#1c1c1f", accentColor: "#d08c51", textColor: "#f2ede4", layoutVariant: "split", geometryShape: "rectangles" } },
  { id: "ed-14", workId: "w-14", isbn: "978-8535929874", publisher: "Companhia das Letras", publicationYear: 2017, translator: "Rubens Figueiredo", pages: 1536, format: "Box 2 Volumes", cover: { type: "generated", style: "modernist", primaryColor: "#161b26", accentColor: "#c7a256", textColor: "#f5f0e8", layoutVariant: "center", geometryShape: "arch" } },
  { id: "ed-15", workId: "w-15", isbn: "978-8573262988", publisher: "Editora 34", publicationYear: 2004, translator: "Jenny Klabin Segall", pages: 720, format: "Capa comum", cover: { type: "generated", style: "typographic", primaryColor: "#261c1d", accentColor: "#e0ad64", textColor: "#f9f3ea", layoutVariant: "top-heavy", geometryShape: "circle" } },
  { id: "ed-16", workId: "w-16", isbn: "978-8501016836", publisher: "Record", publicationYear: 2016, translator: "Herbert Caro", pages: 896, format: "Capa dura", cover: { type: "generated", style: "minimal", primaryColor: "#1a2223", accentColor: "#bfa068", textColor: "#ece8df", layoutVariant: "center", geometryShape: "rule-lines" } }
];

export const SAMPLE_LIBRARY_ITEMS: LibraryItem[] = [
  { id: "item-1", editionId: "ed-1", readingStatus: "read", addedAt: "2023-01-10T10:00:00Z" },
  { id: "item-2", editionId: "ed-2", readingStatus: "reading", addedAt: "2023-03-15T14:30:00Z" },
  { id: "item-3", editionId: "ed-3", readingStatus: "read", addedAt: "2022-11-20T09:00:00Z" },
  { id: "item-4", editionId: "ed-4", readingStatus: "read", addedAt: "2023-05-12T11:20:00Z" },
  { id: "item-5", editionId: "ed-5", readingStatus: "read", addedAt: "2022-08-04T16:00:00Z" },
  { id: "item-6", editionId: "ed-6", readingStatus: "read", addedAt: "2023-02-18T18:45:00Z" },
  { id: "item-7", editionId: "ed-7", readingStatus: "unread", addedAt: "2024-01-05T12:00:00Z" },
  { id: "item-8", editionId: "ed-8", readingStatus: "read", addedAt: "2023-04-22T08:15:00Z" },
  { id: "item-9", editionId: "ed-9", readingStatus: "reading", addedAt: "2023-06-10T17:00:00Z" },
  { id: "item-10", editionId: "ed-10", readingStatus: "unread", addedAt: "2023-09-14T19:30:00Z" },
  { id: "item-11", editionId: "ed-11", readingStatus: "unread", addedAt: "2024-02-01T15:00:00Z" },
  { id: "item-12", editionId: "ed-12", readingStatus: "read", addedAt: "2023-07-29T13:40:00Z" }
];

export const SAMPLE_READING_RECORDS: ReadingRecord[] = [
  // Reread demonstration for w-1 (Crime e Castigo completed in 2018 and reread in 2023)
  { id: "rr-1b", workId: "w-1", editionId: "ed-1", startedAt: "2023-02-01T00:00:00Z", finishedAt: "2023-04-18T18:30:00Z" },
  { id: "rr-1a", workId: "w-1", editionId: "ed-1", startedAt: "2018-07-10T00:00:00Z", finishedAt: "2018-09-05T20:00:00Z" },
  { id: "rr-3", workId: "w-3", editionId: "ed-3", finishedAt: "2021-11-12T14:00:00Z" },
  { id: "rr-4", workId: "w-4", editionId: "ed-4", finishedAt: "2022-06-30T19:00:00Z" },
  { id: "rr-5", workId: "w-5", editionId: "ed-5", finishedAt: "2020-04-15T10:00:00Z" },
  { id: "rr-6", workId: "w-6", editionId: "ed-6", finishedAt: "2022-12-08T16:20:00Z" },
  { id: "rr-8", workId: "w-8", editionId: "ed-8", finishedAt: "2021-08-25T11:00:00Z" },
  { id: "rr-12", workId: "w-12", editionId: "ed-12", finishedAt: "2024-01-20T21:15:00Z" },
  // Crucial requirement: Unowned read work in reading history!
  { id: "rr-13", workId: "w-13", editionId: "ed-13", startedAt: "2019-03-01T00:00:00Z", finishedAt: "2019-04-10T17:00:00Z" }
];

export const SAMPLE_QUEUE_ITEMS: ReadingQueueItem[] = [
  { id: "rq-1", workId: "w-7", libraryItemId: "item-7", position: 1, addedAt: "2024-02-15T10:00:00Z" },
  { id: "rq-2", workId: "w-11", libraryItemId: "item-11", position: 2, addedAt: "2024-02-20T11:00:00Z" },
  { id: "rq-3", workId: "w-1", libraryItemId: "item-1", position: 3, addedAt: "2024-03-01T09:30:00Z" }
];

export const SAMPLE_WISHLIST_ITEMS: WishlistItem[] = [
  { id: "wl-1", workId: "w-14", editionId: "ed-14", addedAt: "2024-01-15T10:00:00Z", desiredEditionNotes: "Tradução de Rubens Figueiredo (Cia das Letras)", priority: "high" },
  { id: "wl-2", workId: "w-15", editionId: "ed-15", addedAt: "2024-02-10T14:30:00Z", desiredEditionNotes: "Tradução de Jenny Klabin Segall (Ed. 34)", priority: "medium" },
  { id: "wl-3", workId: "w-16", editionId: "ed-16", addedAt: "2024-03-01T16:00:00Z", desiredEditionNotes: "Edição Capa Dura Record", priority: "medium" }
];

export const SAMPLE_BOOK_NOTES: BookNote[] = [
  {
    id: "n-1",
    workId: "w-1",
    libraryItemId: "item-1",
    content: "Raskólnikov articula a teoria do homem extraordinário no artigo 'Sobre o crime'. O paralelo com Napoleão é explícito e central para sua autocrítica posterior.",
    page: 260,
    chapter: "Parte III, Cap. 5",
    createdAt: "2023-03-10T14:00:00Z",
    updatedAt: "2023-03-10T14:00:00Z"
  },
  {
    id: "n-2",
    workId: "w-1",
    libraryItemId: "item-1",
    content: "O sonho do cavalo sacrificado no início da narrativa antecipa o colapso emocional e a rejeição instintiva da violência que sua mente racional pretendia cometer.",
    page: 68,
    chapter: "Parte I, Cap. 5",
    createdAt: "2023-02-18T10:30:00Z",
    updatedAt: "2023-02-18T10:30:00Z"
  },
  {
    id: "n-3",
    workId: "w-2",
    libraryItemId: "item-2",
    content: "'Fizeste-nos para Ti, e inquieto está o nosso coração enquanto não repousar em Ti.' Abertura que sintetiza toda a antropologia agostiniana.",
    page: 25,
    chapter: "Livro I, Cap. 1",
    createdAt: "2023-04-05T09:15:00Z",
    updatedAt: "2023-04-05T09:15:00Z"
  }
];
