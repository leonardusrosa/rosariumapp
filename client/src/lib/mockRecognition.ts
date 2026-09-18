import { IdentifiedBookCandidate } from "@/types/bibliotheca";

// ─── Mock Recognition Adapter ─────────────────────────────────────────────────
// Replace each function body with a real API call when connecting external services.
// The imageObjectUrl parameter is accepted for future compatibility.

function makeId(): string {
  return `cand-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
}

const SHELF_CANDIDATES: Omit<IdentifiedBookCandidate, "id" | "selected">[] = [
  {
    title: "O Senhor dos Anéis",
    originalTitle: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    originalPublicationYear: 1954,
    possibleEdition: {
      publisher: "Martins Fontes",
      publicationYear: 2019,
      translator: "Lenita Maria Rímoli Esteves",
      language: "Português",
      pages: 1216,
      format: "Capa dura",
    },
    confidence: "high",
    needsReview: false,
  },
  {
    title: "Middlemarch",
    originalTitle: "Middlemarch",
    author: "George Eliot",
    originalPublicationYear: 1871,
    possibleEdition: {
      publisher: "Penguin-Companhia",
      publicationYear: 2021,
      translator: "Doris Goettems",
      language: "Português",
      pages: 896,
      format: "Capa comum",
    },
    confidence: "high",
    needsReview: false,
  },
  {
    title: "Moby Dick",
    originalTitle: "Moby-Dick",
    author: "Herman Melville",
    originalPublicationYear: 1851,
    possibleEdition: {
      publisher: "Cosac Naify",
      publicationYear: 2008,
      translator: "Irene Hirsch",
      language: "Português",
      pages: 736,
      format: "Capa comum",
    },
    confidence: "high",
    needsReview: false,
  },
  {
    title: "O Nome da Rosa",
    originalTitle: "Il Nome della Rosa",
    author: "Umberto Eco",
    originalPublicationYear: 1980,
    possibleEdition: {
      publisher: "Record",
      publicationYear: 2018,
      translator: "Aurora Fornoni Bernardini",
      language: "Português",
      pages: 576,
      format: "Capa comum",
    },
    confidence: "medium",
    needsReview: true,
  },
  {
    title: "Ensaio sobre a Cegueira",
    author: "José Saramago",
    originalPublicationYear: 1995,
    possibleEdition: {
      publisher: "Companhia das Letras",
      publicationYear: 2017,
      language: "Português",
      pages: 336,
    },
    confidence: "medium",
    needsReview: true,
  },
  {
    title: "Anna Kariênina",
    originalTitle: "Анна Каренина",
    author: "Lev Tolstói",
    confidence: "low",
    needsReview: true,
  },
  {
    title: "Assim Falou Zaratustra",
    originalTitle: "Also sprach Zarathustra",
    author: "Friedrich Nietzsche",
    originalPublicationYear: 1883,
    possibleEdition: {
      publisher: "Companhia das Letras",
      publicationYear: 2011,
      translator: "Paulo César de Souza",
      language: "Português",
      pages: 352,
      format: "Capa comum",
    },
    confidence: "high",
    needsReview: false,
  },
];

const COVER_CANDIDATE: Omit<IdentifiedBookCandidate, "id" | "selected"> = {
  title: "Mil Solidões",
  originalTitle: "Cien años de soledad",
  author: "Gabriel García Márquez",
  originalPublicationYear: 1967,
  possibleEdition: {
    publisher: "Record",
    publicationYear: 2019,
    translator: "Eric Nepomuceno",
    language: "Português",
    pages: 448,
    format: "Capa dura",
  },
  confidence: "high",
  needsReview: false,
};

// Known ISBNs that return mock data (normalized, no hyphens)
const ISBN_LOOKUP: Record<string, Omit<IdentifiedBookCandidate, "id" | "selected">> = {
  "9788535929874": {
    title: "Guerra e Paz",
    originalTitle: "Война и мир",
    author: "Lev Tolstói",
    originalPublicationYear: 1869,
    possibleEdition: {
      isbn: "9788535929874",
      publisher: "Companhia das Letras",
      publicationYear: 2017,
      translator: "Rubens Figueiredo",
      language: "Português",
      pages: 1536,
      format: "Box 2 Volumes",
    },
    confidence: "high",
    needsReview: false,
  },
  "9788535907407": {
    title: "Ilíada",
    originalTitle: "Ἰλιάς",
    author: "Homero",
    originalPublicationYear: -750,
    possibleEdition: {
      isbn: "9788535907407",
      publisher: "Companhia das Letras",
      publicationYear: 2005,
      translator: "Haroldo de Campos",
      language: "Português",
      pages: 720,
      format: "Capa comum",
    },
    confidence: "high",
    needsReview: false,
  },
  "9788573262988": {
    title: "Fausto",
    originalTitle: "Faust",
    author: "Johann Wolfgang von Goethe",
    originalPublicationYear: 1808,
    possibleEdition: {
      isbn: "9788573262988",
      publisher: "Editora 34",
      publicationYear: 2004,
      translator: "Jenny Klabin Segall",
      language: "Português",
      pages: 720,
      format: "Capa comum",
    },
    confidence: "high",
    needsReview: false,
  },
};

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function recognizeShelf(
  _imageObjectUrl: string
): Promise<IdentifiedBookCandidate[]> {
  await delay(1200);
  return SHELF_CANDIDATES.map((c) => ({ ...c, id: makeId(), selected: true }));
}

export async function recognizeCover(
  _imageObjectUrl: string
): Promise<IdentifiedBookCandidate[]> {
  await delay(800);
  return [{ ...COVER_CANDIDATE, id: makeId(), selected: true }];
}

export async function lookupIsbn(
  normalizedIsbn: string
): Promise<IdentifiedBookCandidate | null> {
  await delay(600);
  const found = ISBN_LOOKUP[normalizedIsbn];
  if (!found) return null;
  return { ...found, id: makeId(), selected: true };
}
