/**
 * Provider-neutral contract returned by GET /api/bibliotheca/isbn/:isbn.
 * React components must not import provider-specific types.
 */
export interface ExternalBookMetadata {
  isbn10?: string;
  isbn13?: string;

  work: {
    title: string;
    originalTitle?: string;
    /** May contain multiple names; caller joins as preferred. */
    authors: string[];
    originalPublicationYear?: number;
  };

  edition: {
    publisher?: string;
    publicationYear?: number;
    language?: string;
    pages?: number;
    format?: string;
    translator?: string;
  };

  cover?: {
    url: string;
    source: "openlibrary" | "google-books";
  };

  providerMeta: {
    primary: "openlibrary" | "google-books";
    openLibraryEditionKey?: string;
    openLibraryWorkKey?: string;
    googleVolumeId?: string;
  };
}

/** Response envelope from the API endpoint. */
export type IsbnApiResponse =
  | { found: true; metadata: ExternalBookMetadata }
  | { found: false }
  | { error: "provider_unavailable" };

// ─── Shared ISBN Validation & Normalization ───────────────────────────────────

export function normalizeIsbn(raw: string): string {
  return raw.replace(/[\s\-]/g, "").toUpperCase();
}

export function validateIsbn(normalized: string): boolean {
  if (normalized.length === 10) return validateIsbn10(normalized);
  if (normalized.length === 13) return validateIsbn13(normalized);
  return false;
}

function validateIsbn10(s: string): boolean {
  if (!/^\d{9}[\dX]$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * parseInt(s[i], 10);
  }
  const last = s[9] === "X" ? 10 : parseInt(s[9], 10);
  return (sum + last) % 11 === 0;
}

function validateIsbn13(s: string): boolean {
  if (!/^\d{13}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(s[i], 10) * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  return check === parseInt(s[12], 10);
}

/**
 * Validates whether a barcode raw value is an authentic EAN-13 Bookland ISBN (starts with 978 or 979 and passes check digit).
 */
export function isBooklandIsbn13(raw: string): boolean {
  const normalized = normalizeIsbn(raw);
  if (normalized.length !== 13) return false;
  if (!/^\d{13}$/.test(normalized)) return false;
  if (!normalized.startsWith("978") && !normalized.startsWith("979")) return false;
  return validateIsbn13(normalized);
}


