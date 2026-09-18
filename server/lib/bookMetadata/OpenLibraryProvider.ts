/**
 * Open Library provider.
 *
 * Strategy:
 *   Request 1 — exact ISBN edition: /isbn/{isbn}.json
 *     Authority for: title, isbn-10/13, publisher, pub-date, pages, format, language, cover-id, edition-key, work-key
 *
 *   Request 2 — Search API by ISBN: /search.json?isbn={isbn}&fields=author_name,first_publish_year,key
 *     Authority for: author names, first_publish_year
 *
 * Both requests have a 5-second timeout.
 * Author lookup via /authors/{key}.json is not done here unless the search API yields no authors.
 */
import type { BookMetadataProvider, ProviderEditionResult } from "./types.js";
import { normalizeOpenLibrary } from "./normalizers.js";

const BASE = "https://openlibrary.org";
const TIMEOUT_MS = 8000;

function contactHeader(): Record<string, string> {
  const email = process.env.OPENLIBRARY_CONTACT_EMAIL ?? "";
  const contact = email ? `contact: ${email}` : "contact: bibliotheca-app";
  return {
    "User-Agent": `Bibliotheca/1.0 (${contact})`,
    Accept: "application/json",
  };
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: contactHeader(),
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function fetchEditionJson(isbn: string): Promise<Record<string, unknown> | null> {
  const res = await fetchWithTimeout(`${BASE}/isbn/${isbn}.json`, TIMEOUT_MS);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`OpenLibrary HTTP ${res.status}`);
  return (await res.json()) as Record<string, unknown>;
}

async function fetchSearchDoc(isbn: string): Promise<Record<string, unknown> | null> {
  try {
    const fields = "author_name,first_publish_year,key";
    const url = `${BASE}/search.json?isbn=${isbn}&limit=1&fields=${fields}`;
    const res = await fetchWithTimeout(url, TIMEOUT_MS);
    if (!res.ok) return null;
    const data = (await res.json()) as { docs?: Record<string, unknown>[] };
    return data.docs?.[0] ?? null;
  } catch {
    return null;
  }
}

export class OpenLibraryProvider implements BookMetadataProvider {
  readonly isConfigured = true;

  async lookupByIsbn(isbn: string): Promise<ProviderEditionResult | null> {
    const editionRaw = await fetchEditionJson(isbn);
    if (!editionRaw) return null;

    // Fetch search doc in parallel after we know the edition exists
    const searchDoc = await fetchSearchDoc(isbn);

    return normalizeOpenLibrary(editionRaw, searchDoc);
  }
}
