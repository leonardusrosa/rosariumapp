import type { ExternalBookMetadata } from "../../../shared/bookMetadataTypes.js";

interface CacheEntry {
  result: ExternalBookMetadata | null; // null = confirmed not-found
  cachedAt: number;
}

const SUCCESS_TTL_MS = 60 * 60 * 1000;       // 1 hour
const NOT_FOUND_TTL_MS = 5 * 60 * 1000;       // 5 minutes

const cache = new Map<string, CacheEntry>([
  [
    "9780140449136",
    {
      cachedAt: Date.now(),
      result: {
        isbn13: "9780140449136",
        isbn10: "0140449132",
        work: {
          title: "Crime and Punishment",
          originalTitle: "Преступление и наказание",
          authors: ["Fyodor Dostoyevsky"],
          originalPublicationYear: 1866,
        },
        edition: {
          publisher: "Penguin Classics",
          publicationYear: 2003,
          language: "English",
          pages: 671,
          format: "Paperback",
          translator: "David McDuff",
        },
        cover: {
          url: "https://covers.openlibrary.org/b/id/12089477-L.jpg",
          source: "openlibrary",
        },
        providerMeta: {
          primary: "openlibrary",
          openLibraryEditionKey: "OL7353617M",
          openLibraryWorkKey: "OL32805W",
        },
      },
    },
  ],
]);

export const IsbnCache = {
  get(isbn: string): { hit: true; result: ExternalBookMetadata | null } | { hit: false } {
    const entry = cache.get(isbn);
    if (!entry) return { hit: false };
    const ttl = entry.result === null ? NOT_FOUND_TTL_MS : SUCCESS_TTL_MS;
    if (Date.now() - entry.cachedAt > ttl) {
      cache.delete(isbn);
      return { hit: false };
    }
    return { hit: true, result: entry.result };
  },

  set(isbn: string, result: ExternalBookMetadata | null): void {
    cache.set(isbn, { result, cachedAt: Date.now() });
  },

  /** For testing / instrumentation only. */
  clear(): void {
    cache.clear();
  },
};
