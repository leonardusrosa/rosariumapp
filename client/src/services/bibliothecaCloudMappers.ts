import {
  Work,
  Edition,
  LibraryItem,
  ReadingRecord,
  ReadingQueueItem,
  WishlistItem,
  BookNote,
  BookCoverDef,
} from "@/types/bibliotheca";
import { normalizeIsbn } from "@shared/bookMetadataTypes";

export function mapWorkRow(row: any): Work {
  return {
    id: row.id,
    title: row.title,
    originalTitle: row.original_title || undefined,
    author: row.author,
    originalPublicationYear: row.original_publication_year || undefined,
  };
}

export function mapEditionRow(row: any): Edition {
  return {
    id: row.id,
    workId: row.work_id,
    isbn: row.isbn || undefined,
    publisher: row.publisher || undefined,
    publicationYear: row.publication_year || undefined,
    translator: row.translator || undefined,
    language: row.language || undefined,
    pages: row.pages || undefined,
    format: row.format || undefined,
    cover: row.cover as BookCoverDef,
    providerMeta: row.provider_meta || undefined,
  };
}

export function mapLibraryItemRow(row: any): LibraryItem {
  return {
    id: row.id,
    editionId: row.edition_id,
    readingStatus: row.reading_status,
    addedAt: row.created_at,
  };
}

export function mapReadingRecordRow(row: any): ReadingRecord {
  return {
    id: row.id,
    workId: row.work_id,
    editionId: row.edition_id || undefined,
    startedAt: row.started_at || undefined,
    finishedAt: row.finished_at || undefined,
  };
}

export function mapQueueItemRow(row: any): ReadingQueueItem {
  return {
    id: row.id,
    workId: row.work_id,
    libraryItemId: row.library_item_id || undefined,
    position: row.position,
    addedAt: row.added_at,
  };
}

export function mapWishlistItemRow(row: any): WishlistItem {
  return {
    id: row.id,
    workId: row.work_id,
    editionId: row.edition_id || undefined,
    desiredEditionNotes: row.desired_edition_notes || undefined,
    priority: row.priority || undefined,
    addedAt: row.added_at,
  };
}

export function mapNoteRow(row: any): BookNote {
  return {
    id: row.id,
    workId: row.work_id,
    libraryItemId: row.library_item_id || undefined,
    content: row.content,
    page: row.page ?? undefined,
    chapter: row.chapter || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function buildImportPayload(state: {
  works: Work[];
  editions: Edition[];
  libraryItems: LibraryItem[];
  readingRecords: ReadingRecord[];
  readingQueue: ReadingQueueItem[];
  wishlistItems: WishlistItem[];
  notes: BookNote[];
}) {
  return {
    works: state.works.map((w) => ({
      id: w.id,
      title: w.title,
      originalTitle: w.originalTitle || null,
      author: w.author,
      originalPublicationYear: w.originalPublicationYear || null,
    })),
    editions: state.editions.map((e) => ({
      id: e.id,
      workId: e.workId,
      isbn: e.isbn ? normalizeIsbn(e.isbn) : null,
      publisher: e.publisher || null,
      publicationYear: e.publicationYear || null,
      translator: e.translator || null,
      language: e.language || null,
      pages: e.pages || null,
      format: e.format || null,
      cover: e.cover,
      providerMeta: e.providerMeta || null,
    })),
    libraryItems: state.libraryItems.map((l) => ({
      id: l.id,
      editionId: l.editionId,
      readingStatus: l.readingStatus,
      addedAt: l.addedAt || null,
    })),
    readingRecords: state.readingRecords.map((r) => ({
      id: r.id,
      workId: r.workId,
      editionId: r.editionId || null,
      startedAt: r.startedAt || null,
      finishedAt: r.finishedAt || null,
    })),
    readingQueue: state.readingQueue.map((q) => ({
      id: q.id,
      workId: q.workId,
      libraryItemId: q.libraryItemId || null,
      position: q.position,
      addedAt: q.addedAt || null,
    })),
    wishlistItems: state.wishlistItems.map((w) => ({
      id: w.id,
      workId: w.workId,
      editionId: w.editionId || null,
      desiredEditionNotes: w.desiredEditionNotes || null,
      priority: w.priority || null,
      addedAt: w.addedAt || null,
    })),
    notes: state.notes.map((n) => ({
      id: n.id,
      workId: n.workId,
      libraryItemId: n.libraryItemId || null,
      content: n.content,
      page: n.page ?? null,
      chapter: n.chapter || null,
      createdAt: n.createdAt || null,
      updatedAt: n.updatedAt || null,
    })),
  };
}
