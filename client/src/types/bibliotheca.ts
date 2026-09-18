export type ReadingStatus = 'unread' | 'reading' | 'read';

export interface Work {
  id: string;
  title: string;
  originalTitle?: string;
  author: string;
  originalPublicationYear?: number;
}

export type CoverStyle =
  | 'minimal'
  | 'modernist'
  | 'geometric'
  | 'banded'
  | 'typographic';

/** Procedural cover — all required fields fully specified. */
export interface GeneratedCoverDef {
  type: 'generated';
  style: CoverStyle;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  layoutVariant?: 'center' | 'top-heavy' | 'bottom-heavy' | 'split';
  geometryShape?: 'circle' | 'arch' | 'rectangles' | 'cross-hatch' | 'rule-lines' | 'none';
  subtitle?: string;
}

/** Real remote cover image; falls back to `fallback` if the URL fails. */
export interface RemoteCoverDef {
  type: 'remote';
  url: string;
  source?: 'openlibrary' | 'google-books';
  /** Shown if the remote URL fails to load. Omitting uses a minimal default. */
  fallback?: GeneratedCoverDef;
}

export type BookCoverDef = GeneratedCoverDef | RemoteCoverDef;

/**
 * @deprecated Use BookCoverDef instead.
 * Kept for backwards-compatibility within the migration path only.
 * All new code must use BookCoverDef.
 */
export interface CoverDefinition {
  style: CoverStyle;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  layoutVariant?: 'center' | 'top-heavy' | 'bottom-heavy' | 'split';
  geometryShape?: 'circle' | 'arch' | 'rectangles' | 'cross-hatch' | 'rule-lines' | 'none';
  subtitle?: string;
}

export interface EditionProviderMeta {
  primary?: 'openlibrary' | 'google-books';
  openLibraryEditionKey?: string;
  openLibraryWorkKey?: string;
  googleVolumeId?: string;
  coverSource?: 'openlibrary' | 'google-books';
}

export interface Edition {
  id: string;
  workId: string;
  isbn?: string;
  publisher?: string;
  publicationYear?: number;
  translator?: string;
  language?: string;
  pages?: number;
  format?: string;
  cover: BookCoverDef;
  providerMeta?: EditionProviderMeta;
}

export interface LibraryItem {
  id: string;
  editionId: string;
  readingStatus: ReadingStatus;
  addedAt?: string;
}

export interface ReadingRecord {
  id: string;
  workId: string;
  editionId?: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface ReadingQueueItem {
  id: string;
  workId: string;
  libraryItemId?: string;
  position: number;
  addedAt?: string;
}

export interface WishlistItem {
  id: string;
  workId: string;
  editionId?: string;
  addedAt: string;
  desiredEditionNotes?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface BookNote {
  id: string;
  workId: string;
  libraryItemId?: string;
  content: string;
  page?: number;
  chapter?: string;
  createdAt: string;
  updatedAt: string;
}

export type SpoilerMode = 'no-spoilers' | 'reading-guide' | 'full-analysis';

export interface BookEnrichment {
  workId: string;
  synopsis: {
    noSpoilers: string;
    readingGuide: string;
    fullAnalysis: string;
  };
  context: string;
  facts: string[];
  themes: string[];
  relatedWorkIds: string[];
}

export interface BookCardViewModel {
  itemId: string;
  workId: string;
  editionId: string;
  title: string;
  originalTitle?: string;
  author: string;
  publisher?: string;
  publicationYear?: number;
  readingStatus: ReadingStatus;
  isNextRead: boolean;
  notesCount: number;
  cover: BookCoverDef;
}

export interface NavSection {
  id: string;
  latinTitle: string;
  subtitle: string;
  href: string;
  iconName: string;
  badgeCount?: number;
}

export interface LibraryFilters {
  searchQuery: string;
  statusFilter: 'all' | ReadingStatus;
}

// ─── Ingestion-only types (never persisted to localStorage) ───────────────────

export interface IdentifiedBookCandidate {
  id: string;
  title: string;
  originalTitle?: string;
  author?: string;
  originalPublicationYear?: number;
  possibleEdition?: {
    isbn?: string;
    publisher?: string;
    publicationYear?: number;
    translator?: string;
    language?: string;
    pages?: number;
    format?: string;
  };
  /** Remote cover URL from a real provider lookup. */
  remoteCoverUrl?: string;
  /** Provider metadata to persist when committed. */
  providerMeta?: EditionProviderMeta;
  confidence: 'high' | 'medium' | 'low';
  selected: boolean;
  needsReview: boolean;
  editedTitle?: string;
  editedAuthor?: string;
  readingStatus?: ReadingStatus;
  addToQueue?: boolean;
}

export interface ManualDraft {
  title: string;
  originalTitle?: string;
  author?: string;
  originalPublicationYear?: number;
  isbn?: string;
  publisher?: string;
  publicationYear?: number;
  translator?: string;
  language?: string;
  pages?: number;
  format?: string;
  coverStyle?: CoverStyle;
  readingStatus: ReadingStatus;
  addToQueue: boolean;
}

export type IngestionState =
  | { phase: 'method-select' }
  | { phase: 'image-input'; mode: 'shelf' | 'cover' }
  | { phase: 'recognizing'; mode: 'shelf' | 'cover' }
  | { phase: 'bulk-review'; candidates: IdentifiedBookCandidate[] }
  | { phase: 'candidate-review'; candidateId: string; returnToBulk: true; candidates: IdentifiedBookCandidate[] }
  | { phase: 'single-review'; candidate: IdentifiedBookCandidate; origin: 'cover' | 'isbn' | 'barcode' }
  | { phase: 'barcode-scan' }
  | { phase: 'isbn-entry' }
  | { phase: 'manual-entry'; draft: ManualDraft }
  | { phase: 'done'; addedWorkIds: string[]; addedLibraryItemIds: string[] };

