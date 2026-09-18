import type { ExternalBookMetadata } from "../../../shared/bookMetadataTypes.js";

/** Internal canonical shape returned by each provider before merging. */
export interface ProviderEditionResult {
  isbn10?: string;
  isbn13?: string;
  title?: string;
  authors?: string[];
  originalPublicationYear?: number;
  publisher?: string;
  publicationYear?: number;
  language?: string;
  pages?: number;
  format?: string;
  translator?: string;
  coverUrl?: string;
  providerMeta: ExternalBookMetadata["providerMeta"];
}

export interface BookMetadataProvider {
  readonly isConfigured: boolean;
  lookupByIsbn(isbn: string): Promise<ProviderEditionResult | null>;
  /** Future: title/author search – not wired in Pass 4. */
  // searchBooks?(query: string): Promise<ProviderEditionResult[]>;
}
