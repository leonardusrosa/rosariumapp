import { IsbnCache } from "./IsbnCache.js";
import { OpenLibraryProvider } from "./OpenLibraryProvider.js";
import { GoogleBooksProvider } from "./GoogleBooksProvider.js";
import {
  mergeProviderResults,
  isUsableResult,
  hasTitle,
} from "./normalizers.js";
import {
  ExternalBookMetadata,
  IsbnApiResponse,
  normalizeIsbn,
  validateIsbn,
} from "../../../shared/bookMetadataTypes.js";
import type { ProviderEditionResult } from "./types.js";

export class BookMetadataResolver {
  private ol = new OpenLibraryProvider();
  private google = new GoogleBooksProvider();

  async resolve(rawIsbn: string): Promise<IsbnApiResponse> {
    const isbn = normalizeIsbn(rawIsbn);
    if (!validateIsbn(isbn)) {
      return { found: false };
    }

    // 1. Cache hit check
    const cached = IsbnCache.get(isbn);
    if (cached.hit) {
      return cached.result
        ? { found: true, metadata: cached.result }
        : { found: false };
    }

    let olResult: ProviderEditionResult | null = null;
    let olError = false;

    try {
      olResult = await this.ol.lookupByIsbn(isbn);
    } catch (err) {
      olError = true;
      console.warn(`[BookMetadataResolver] OpenLibrary lookup failed for ${isbn}:`, err);
    }

    // 2. OL returned complete record (usable and has cover)
    if (olResult && isUsableResult(olResult) && olResult.coverUrl) {
      const merged = mergeProviderResults(olResult, null);
      IsbnCache.set(isbn, merged);
      return { found: true, metadata: merged };
    }

    // 3. OL returned record but missing cover or author: consult Google Books if configured
    if (olResult && this.google.isConfigured) {
      try {
        const googleResult = await this.google.lookupByIsbn(isbn);
        const merged = mergeProviderResults(olResult, googleResult);
        IsbnCache.set(isbn, merged);
        return { found: true, metadata: merged };
      } catch (err) {
        console.warn(`[BookMetadataResolver] Google Books fallback failed for ${isbn}:`, err);
        const merged = mergeProviderResults(olResult, null);
        IsbnCache.set(isbn, merged);
        return { found: true, metadata: merged };
      }
    } else if (olResult && hasTitle(olResult)) {
      const merged = mergeProviderResults(olResult, null);
      IsbnCache.set(isbn, merged);
      return { found: true, metadata: merged };
    }

    // 4. OL had no result or errored: try Google Books as fallback primary
    let googleResult: ProviderEditionResult | null = null;
    let googleError = false;

    if (this.google.isConfigured) {
      try {
        googleResult = await this.google.lookupByIsbn(isbn);
      } catch (err) {
        googleError = true;
        console.warn(`[BookMetadataResolver] Google Books primary lookup failed for ${isbn}:`, err);
      }
    }

    if (googleResult && hasTitle(googleResult)) {
      const merged = mergeProviderResults(googleResult, null);
      IsbnCache.set(isbn, merged);
      return { found: true, metadata: merged };
    }

    // 5. Check if failure was due to network / provider unavailable
    if (olError && (!this.google.isConfigured || googleError)) {
      return { error: "provider_unavailable" };
    }

    // 6. Confirmed not found
    IsbnCache.set(isbn, null);
    return { found: false };
  }
}

export const bookMetadataResolver = new BookMetadataResolver();
