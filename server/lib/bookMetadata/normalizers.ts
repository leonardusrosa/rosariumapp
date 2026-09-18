/**
 * Pure normalizer functions — no I/O, fully testable.
 *
 * Converts raw Open Library and Google Books response shapes
 * into ProviderEditionResult, then merges into ExternalBookMetadata.
 */
import type { ProviderEditionResult } from "./types.js";
import type { ExternalBookMetadata } from "../../../shared/bookMetadataTypes.js";

// ─── Open Library ─────────────────────────────────────────────────────────────

/** Extract ISBN strings from OL edition's isbn_10 / isbn_13 arrays. */
function extractIsbn(raw: Record<string, unknown>) {
  const isbn10 = (raw.isbn_10 as string[] | undefined)?.[0];
  const isbn13 = (raw.isbn_13 as string[] | undefined)?.[0];
  return { isbn10, isbn13 };
}

/** Build OL large cover URL from cover ID with ?default=false so missing covers 404. */
export function buildOlCoverUrl(coverId: number | string, size: "M" | "L" = "L"): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg?default=false`;
}

/**
 * Normalizes raw OL edition JSON + raw OL search-doc JSON
 * into our internal ProviderEditionResult.
 *
 * @param editionRaw  Response from /isbn/{isbn}.json
 * @param searchDoc   First doc from /search.json?isbn=...&fields=...
 */
export function normalizeOpenLibrary(
  editionRaw: Record<string, unknown>,
  searchDoc: Record<string, unknown> | null
): ProviderEditionResult {
  const { isbn10, isbn13 } = extractIsbn(editionRaw);

  // --- Cover ---
  const coverIds = editionRaw.covers as number[] | undefined;
  const coverId = coverIds?.find((id) => id > 0);
  const coverUrl = coverId ? buildOlCoverUrl(coverId, "L") : undefined;

  // --- Edition key ---
  const editionKey = (editionRaw.key as string | undefined)?.replace("/books/", "");

  // --- Work key from edition ---
  const worksArr = editionRaw.works as Array<{ key: string }> | undefined;
  const workKey = worksArr?.[0]?.key?.replace("/works/", "");

  // --- Publisher / year / pages / format / language ---
  const publishers = editionRaw.publishers as string[] | undefined;
  const publisher = publishers?.[0];

  const publishYear = editionRaw.publish_date
    ? parseInt(String(editionRaw.publish_date).replace(/\D+/g, "").slice(0, 4))
    : undefined;

  const pages =
    (editionRaw.number_of_pages as number | undefined) ??
    (editionRaw.pagination ? undefined : undefined);

  const langArr = editionRaw.languages as Array<{ key: string }> | undefined;
  const langKey = langArr?.[0]?.key?.replace("/languages/", "");

  const physFmt = editionRaw.physical_format as string | undefined;

  // --- Translation credit ---
  // OL doesn't reliably separate translators; we skip rather than guess.

  // --- From search doc: author names, original pub year ---
  const searchAuthors = searchDoc
    ? (searchDoc.author_name as string[] | undefined)
    : undefined;
  const firstPublishYear = searchDoc
    ? (searchDoc.first_publish_year as number | undefined)
    : undefined;

  // --- Title from edition (most authoritative for this exact edition) ---
  const title = (editionRaw.title as string | undefined) ?? undefined;
  const subtitle = editionRaw.subtitle as string | undefined;
  const fullTitle = subtitle ? `${title}: ${subtitle}` : title;

  return {
    isbn10,
    isbn13,
    title: fullTitle,
    authors: searchAuthors?.length ? searchAuthors : undefined,
    originalPublicationYear: firstPublishYear,
    publisher,
    publicationYear: Number.isFinite(publishYear) ? publishYear : undefined,
    language: langKey,
    pages: Number.isFinite(pages) ? (pages as number) : undefined,
    format: physFmt,
    coverUrl,
    providerMeta: {
      primary: "openlibrary",
      openLibraryEditionKey: editionKey,
      openLibraryWorkKey: workKey,
    },
  };
}

// ─── Google Books ──────────────────────────────────────────────────────────────

const IMAGE_LINK_PREFERENCE = [
  "extraLarge",
  "large",
  "medium",
  "small",
  "thumbnail",
  "smallThumbnail",
] as const;

/** Upgrade http -> https and strip edge=curl artifact. */
export function cleanGoogleCoverUrl(url: string): string {
  let clean = url.replace(/^http:\/\//i, "https://");
  // Remove edge=curl parameter
  clean = clean.replace(/[&?]edge=curl/i, "");
  return clean;
}

export function normalizeGoogleBooks(
  volumeRaw: Record<string, unknown>
): ProviderEditionResult {
  const volumeInfo = (volumeRaw.volumeInfo ?? {}) as Record<string, unknown>;
  const volumeId = volumeRaw.id as string | undefined;

  const title = volumeInfo.title as string | undefined;
  const authors = volumeInfo.authors as string[] | undefined;
  const publisher = volumeInfo.publisher as string | undefined;
  const pubDateStr = volumeInfo.publishedDate as string | undefined;
  const pubYear = pubDateStr ? parseInt(pubDateStr.slice(0, 4)) : undefined;
  const pages = volumeInfo.pageCount as number | undefined;
  const language = volumeInfo.language as string | undefined;

  // Extract ISBNs from industryIdentifiers
  const identifiers = volumeInfo.industryIdentifiers as
    | Array<{ type: string; identifier: string }>
    | undefined;
  const isbn13 = identifiers?.find((i) => i.type === "ISBN_13")?.identifier;
  const isbn10 = identifiers?.find((i) => i.type === "ISBN_10")?.identifier;

  // Best available cover
  const imageLinks = volumeInfo.imageLinks as Record<string, string> | undefined;
  let coverUrl: string | undefined;
  if (imageLinks) {
    for (const key of IMAGE_LINK_PREFERENCE) {
      if (imageLinks[key]) {
        coverUrl = cleanGoogleCoverUrl(imageLinks[key]);
        break;
      }
    }
  }

  return {
    isbn10,
    isbn13,
    title,
    authors: authors?.length ? authors : undefined,
    publisher,
    publicationYear: Number.isFinite(pubYear) ? pubYear : undefined,
    language,
    pages: Number.isFinite(pages) ? (pages as number) : undefined,
    coverUrl,
    providerMeta: {
      primary: "google-books",
      googleVolumeId: volumeId,
    },
  };
}

// ─── Merge ────────────────────────────────────────────────────────────────────

/**
 * Merges OL (primary) and Google (fallback) results with deterministic precedence.
 * OL fields win when non-null; Google fills gaps.
 */
export function mergeProviderResults(
  primary: ProviderEditionResult,
  fallback: ProviderEditionResult | null
): ExternalBookMetadata {
  const g = fallback;

  const title = primary.title ?? g?.title ?? "Título desconhecido";
  const authors =
    primary.authors?.length ? primary.authors : g?.authors?.length ? g.authors : [];

  let coverUrl = primary.coverUrl ?? g?.coverUrl;
  let coverSource: "openlibrary" | "google-books" | undefined =
    primary.coverUrl ? primary.providerMeta.primary :
    g?.coverUrl ? "google-books" : undefined;

  return {
    isbn10: primary.isbn10 ?? g?.isbn10,
    isbn13: primary.isbn13 ?? g?.isbn13,
    work: {
      title,
      authors,
      originalPublicationYear:
        primary.originalPublicationYear ?? g?.originalPublicationYear,
    },
    edition: {
      publisher: primary.publisher ?? g?.publisher,
      publicationYear: primary.publicationYear ?? g?.publicationYear,
      language: primary.language ?? g?.language,
      pages: primary.pages ?? g?.pages,
      format: primary.format ?? g?.format,
      translator: primary.translator ?? g?.translator,
    },
    cover: coverUrl && coverSource
      ? { url: coverUrl, source: coverSource }
      : undefined,
    providerMeta: {
      primary: primary.providerMeta.primary,
      openLibraryEditionKey: primary.providerMeta.openLibraryEditionKey,
      openLibraryWorkKey: primary.providerMeta.openLibraryWorkKey,
      googleVolumeId:
        primary.providerMeta.googleVolumeId ?? g?.providerMeta.googleVolumeId,
    },
  };
}

/** True if a result has at least a usable title and author. */
export function isUsableResult(r: ProviderEditionResult | null): r is ProviderEditionResult {
  return !!r && !!r.title && (r.authors?.length ?? 0) > 0;
}

/** True if a result has at least a title (weakly usable). */
export function hasTitle(r: ProviderEditionResult | null): r is ProviderEditionResult {
  return !!r && !!r.title;
}
