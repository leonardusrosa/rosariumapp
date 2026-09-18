/**
 * Google Books fallback provider.
 *
 * Only active when GOOGLE_BOOKS_API_KEY is set.
 * If the key is absent, lookupByIsbn returns null immediately.
 *
 * Uses: GET /books/v1/volumes?q=isbn:{isbn}&key={key}
 */
import type { BookMetadataProvider, ProviderEditionResult } from "./types.js";
import { normalizeGoogleBooks } from "./normalizers.js";

const BASE = "https://www.googleapis.com/books/v1";
const TIMEOUT_MS = 5000;

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export class GoogleBooksProvider implements BookMetadataProvider {
  private readonly apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.GOOGLE_BOOKS_API_KEY || undefined;
  }

  get isConfigured(): boolean {
    return !!this.apiKey;
  }

  async lookupByIsbn(isbn: string): Promise<ProviderEditionResult | null> {
    if (!this.isConfigured) return null;

    const url = `${BASE}/volumes?q=isbn:${isbn}&key=${this.apiKey}`;
    const res = await fetchWithTimeout(url, TIMEOUT_MS);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GoogleBooks HTTP ${res.status}`);

    const data = (await res.json()) as {
      totalItems?: number;
      items?: Record<string, unknown>[];
    };

    if (!data.totalItems || !data.items?.length) return null;

    return normalizeGoogleBooks(data.items[0]);
  }
}
